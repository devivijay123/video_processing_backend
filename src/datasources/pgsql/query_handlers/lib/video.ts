import { PoolClient } from 'pg';
import logger from '@logger';
import { deleteRecord, fetchRecord, fetchRecords, saveRecord, updateRecord } from '@db/helpers/query_execution';
import { IVideoDetails, videoDetails } from 'src/models/lib/video';

const TAG = 'datasources.pgsql.query_handlers.lib.video';
export async function saveVideoDetails(connection: PoolClient, videoDetails: any) {
    logger.info(`${TAG}.saveCourseDetails() `);
    try {
        const uid = crypto.randomUUID();
        const query: string = `insert into video_details( uid,file_name, original_file_name, content_type,  s3_bucket,file_path,file_url)
        values($1, $2, $3, $4, $5, $6, $7)`;

        const result = await saveRecord(connection, query, [
            uid,
            videoDetails.fileName,
            videoDetails.originalFileName,
            videoDetails.contentType,
            videoDetails.s3Bucket,
            videoDetails.filePath,
            videoDetails.fileUrl
          
        ])

        return uid
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.saveVideoDetails() `, error);
        throw error;
    }
}
