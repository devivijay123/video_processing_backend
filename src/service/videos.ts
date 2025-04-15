import { HttpStatusCodes } from "@constants/status_codes";
import { commitTransaction, getConnection, releaseConnection, rollBackTransaction } from "@db/helpers/transation";
import logger from "@logger";
import { IServiceResponse, ServiceResponse } from "@models";
import { spawn } from 'child_process';
import { VideoData } from '@db/queries';
import path from 'path';
import fs from 'fs';
import * as nodeUtil from 'util';
import { DIRECTORIES } from "@constants/file_constants";
import { saveFile, getFileUrl } from "@helpers/s3_media";
import { AWS_S3 } from "@config";

const TAG = 'service.videos';

export async function saveVideo(payload: any): Promise<IServiceResponse> {
    logger.info(TAG + '.saveVideo()');
    const serviceResponse: IServiceResponse = new ServiceResponse(
        HttpStatusCodes.OK,
        'Video saved successfully'
    );

    let connection = null;
    const file = payload;
    const fileName = file.originalname;
    const filePath = file.path;

    try {
        connection = await getConnection(true);
        const fileDirectory = DIRECTORIES.CONVOLVE_VIDEOS;
        const data = await saveFile(file, fileDirectory, AWS_S3.bucketName);

        logger.debug(`${TAG}.uploadimage 's3 response:'` + nodeUtil.inspect(data));
        logger.debug(`${TAG}.uploadimage 'fileS3 URL: ' ` + getFileUrl(data.savedFileKey, AWS_S3.bucketName));

        const fileDetails = {
            fileName: data?.savedFileName,
            originalFileName: file?.originalname,
            contentType: file?.mimetype,
            s3Bucket: AWS_S3.bucketName,
            filePath: data?.savedFileKey,
            fileUrl: data?.savedLocation
        };

        const videoId = await VideoData.saveVideoDetails(connection, fileDetails);
        const videoPath = file.path;

        logger.info(`Processing video at: ${videoPath}`);
        const result = await runPythonScript(videoPath);
        console.log("result",result)

        // You can use `result.detections` and `result.frames` here as needed
        serviceResponse.data = {
            videoId,
            detections: result.detections,
            frames: result.frames,
            filePath: fileDetails.filePath,
            fileName: fileDetails.fileName,
            originalFileName: fileDetails.originalFileName

        };

        await commitTransaction(connection);

    } catch (error) {
        await rollBackTransaction(connection);
        logger.error(`ERROR in ${TAG}.saveVideo():`, error);
        logger.debug('Error stack:', error.stack);
        serviceResponse.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
        serviceResponse.message = 'Failed to process video';
        serviceResponse.addServerError(error.message);
    } finally {
        await releaseConnection(connection);
    }

    return serviceResponse;
}

function runPythonScript(videoPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const scriptPath = path.resolve(__dirname, 'yolo', 'detect.py');
        const py = spawn('python', [scriptPath, videoPath]);

        logger.info(` Running Python script: python ${scriptPath} ${videoPath}`);

        let outputData = '';
        let errorData = '';

        py.stdout.on('data', (data) => {
            outputData += data.toString();
            logger.info(`🔚 outputData ${outputData}`);
        });

        py.stderr.on('data', (data) => {
            errorData += data.toString();
            logger.info(`🔚 errorData ${outputData}`);
        });

        py.on('close', (code) => {
            logger.info(`🔚 Python script exited with code ${code}`);
            if (code === 0) {
                try {
                    const jsonData = JSON.parse(outputData);
                    console.log("outputData", outputData, jsonData)
                    logger.debug(` Python output parsed: ${JSON.stringify(jsonData).substring(0, 500)}...`);
                    resolve(jsonData);
                } catch (err) {
                    logger.error(' Failed to parse JSON from Python script', err);
                    reject(new Error('Failed to parse JSON output from Python script.'));
                }
            } else {
                logger.error(` Python script error output: ${errorData}`);
                reject(new Error(`Python script failed with code ${code}.`));
            }
        });

        py.on('error', (err) => {
            logger.error(' Failed to start Python process', err);
            reject(new Error('Failed to start Python process.'));
        });
    });
}
