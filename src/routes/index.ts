import log from '@logger';
import * as APIPaths from '@constants/api_path_constants';
import { errorHandler } from '@middleware/error_handler';
import { Application } from 'express';
import v1Routes from './v1';

export default function initializeRoutes(app: Application) {
    log.info('initializeRoutes()');
    app.use(APIPaths.DEFAULT_ROUTE, v1Routes);
    app.use(errorHandler);
}
