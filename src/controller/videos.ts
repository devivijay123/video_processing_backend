
import { responseBuilder } from "@helpers/response_builder";
import logger from "@logger";
import { IServiceResponse,  } from "@models";
import { NextFunction, Response } from "express";
import * as service from '@service/videos';
import { pipeFile } from '../helpers/s3_media'
import { AWS_S3 } from "@config";

const TAG = 'controller.videos';

export async function saveVideo(req: any, res: Response, next: NextFunction): Promise<void> {
    logger.info(TAG + '.saveVideo() ');
    try {
        console.log("sudjas",req.file)
        logger.debug(`video object  ${JSON.stringify(req.file)}`);
        const response: IServiceResponse = await service.saveVideo(req.file);
        responseBuilder(response, res, next, req);
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.saveVideo() `, error);
        next(error);
    }
}
export async function getS3FileByFilePath(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info(`${TAG}.getS3FileByFilePath()`)
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    
      const filePath = req.params['filePath']
     
      await pipeFile(filePath, AWS_S3.bucketName, res)
    } catch (error) {
      logger.error(`ERROR occurred in ${TAG}.getS3FileByFilePath() `, error)
      next(error)
    }
  }
  