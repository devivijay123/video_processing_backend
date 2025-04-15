import { config } from 'dotenv';
import { AppError } from '@models';
import { resolve } from 'path';
import logger from '@logger';

config({ path: resolve(__dirname, '../../.env') });

export const LOG_LEVEL = process.env?.LOG_LEVEL ?? 'debug';
export const LOG_DIRECTORY = process.env?.LOG_DIRECTORY ?? './logs';

export const PORT = process.env.PORT || 8001;
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'careerpedia_jwt_a';
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'careerpedia_jwt_r';
export const JWT_ACCESS_TOKEN_EXPIRY_TIME = parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRY_TIME || '') || (6 * 60 * 60);
export const JWT_REFRESH_TOKEN_EXPIRY_TIME = parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY_TIME || '') || (30 * 24 * 60 * 60);
export const CORS_ORIGIN_URLS = process.env.CORS_ORIGIN || '*';
export const API_CALL_LOG_FORMAT = process.env.API_CALL_LOG_FORMAT ||
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]';
export const REQUEST_BODY_LIMIT = parseInt(process.env.REQUEST_BODY_LIMIT || '100');
export const CONF_DIR_PATH = process.env.CONF_DIR_PATH || resolve('./config/');


export const AWS_S3 = {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_CODE || '',
    acl: process.env.ACL || '"public-read"',
    bucketName: process.env.S3_BUCKET_NAME || '',
    region: process.env.S3_REGION || '',

};

export const PG_DATABASE = {
    host: process.env.SQL_DATABASE_HOST || 'localhost',
    port: parseInt(process.env.SQL_DATABASE_PORT || '3306'),
    username: process.env.SQL_DATABASE_USERNAME,
    password: process.env.SQL_DATABASE_PASSWORD,
    db_name: process.env.SQL_DATABASE_NAME || '',
    options: process.env.SQL_DATABASE_OPTIONS || "-c search_path=some_schema",
    pool_size: parseInt(process.env.SQL_DATABASE_POOL_SIZE || '30'),
};
export async function checkEnv() {
    logger.info('STARTED Validation of env variables!');
    const mandatoryFields = ['SQL_DATABASE_HOST', 'SQL_DATABASE_USERNAME', 'SQL_DATABASE_PASSWORD'];
    mandatoryFields.forEach((field) => {
        if (!process.env[field]) {
            throw new AppError(`Required configuration '${field}' is missing`);
        }
    });
}