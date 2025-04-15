import { ErrorCodes, ErrorMessages } from '@constants/error_constants';
import { HttpStatusCodes } from '@constants/status_codes';
import { NextFunction, Request, Response } from 'express';
import { responseBuilder } from '@helpers/response_builder';
import logger from '@logger';
import { APIError, IServiceResponse, ServiceResponse, AppError } from '@models';

export function errorHandler(error: Error, req: Request, res: Response, next?: NextFunction): void {
    logger.info('errorHandler()');
    try {
        const response: IServiceResponse = new ServiceResponse(
            HttpStatusCodes.INTERNAL_SERVER_ERROR,
            ErrorMessages.INTERNAL_SERVER_ERROR,
            null);
        if (error instanceof AppError) {
            if (error?.httpCode) response.statusCode = error?.httpCode

            if (error?.message) response.message = error?.message

            response.errors = error.errors;
        } else {
            logger.error('handling ERROR :', error);
        }
        return responseBuilder(response, res, next, req);
    } catch (e) {
        logger.error('Error in middlewares.errorHandler()', e);
    }
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
        errors: [new APIError(ErrorMessages.INTERNAL_SERVER_ERROR, ErrorCodes.SYSTEM_ERROR, null)]
    });
}
