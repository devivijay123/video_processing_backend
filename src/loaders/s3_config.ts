
import { S3Client } from '@aws-sdk/client-s3';
import log from '@logger';
import { AWS_S3 } from '@config';

let s3Connection;

export function s3ConnectionLoader() {
    log.info(`s3ConnectionLoader()`);
    log.debug(`creating AWS connection with config: ${JSON.stringify(AWS_S3)}`);
    try {
        if (s3Connection) {
            return s3Connection;
        }
        s3Connection = new S3Client({
            credentials: {
                accessKeyId: AWS_S3.accessKeyId,
                secretAccessKey: AWS_S3.secretAccessKey,
            },
            // acl: AWS_S3.ACL,
            region: AWS_S3.region
        })
      
        return s3Connection;
    } catch (e) {
        log.error('ERROR Occurred while creating AWSConnection()', e);
    }
}
