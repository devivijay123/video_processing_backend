import bodyParser from 'body-parser';
import cors from 'cors';
import { Application } from 'express';
import logger from '@logger';
import morgan from 'morgan';
import helmet from 'helmet'
import { API_CALL_LOG_FORMAT, CORS_ORIGIN_URLS, REQUEST_BODY_LIMIT } from '@config';

export default (app: Application) => {
    logger.info('initializationExpressServer()');
    const corsOptions = {
        origin: '*',
        methods: 'GET, OPTIONS, PUT, PATCH, POST, DELETE',
        exposedHeaders: 'message,showMessage'
    };

    const stream = {
        write: (message: string) => {
            logger.info(message);
        },
    };

    app.use(bodyParser.urlencoded({
        limit: `${REQUEST_BODY_LIMIT}mb`,
        extended: true,
    }));

    app.use(bodyParser.json({
        limit: `${REQUEST_BODY_LIMIT}mb`,
    }));

    app.use(cors(corsOptions));
    app.use(helmet())
    app.use(morgan(API_CALL_LOG_FORMAT, { stream }));

};
