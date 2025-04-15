import {LOG_LEVEL,LOG_DIRECTORY} from '@config';
import path from 'path';
import {createLogger, format, transports} from 'winston';
import 'winston-daily-rotate-file';

const objectifyError = format((info: any, error?: any) => {
    if (error instanceof Error) {
        info = Object.assign({
            message: info.message,
            stack: error.stack,
        }, info);
    }
    return info;
});

const printf = (info: any) => {
    return `${info.timestamp} ${info.label}[${info.level}]: ${info.message} ${info.stack ? info.stack : ''}`;
};

function logger() {
    return createLogger({
        exitOnError: false,
        level: LOG_LEVEL,
        format: format.combine(
            objectifyError(),
            format.label({
                label: path.basename(process.mainModule ? process.mainModule.filename : ''),
            }),
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.printf(printf),
        ),
        silent: process.env.NODE_ENV === 'test',
        transports: [
            new transports.Console({
                format: format.combine(
                    objectifyError(),
                    format.colorize(),
                    format.timestamp({
                        format: 'YYYY-MM-DD HH:mm:ss',
                    }),
                    format.printf(printf),
                ),
            }),
            new transports.DailyRotateFile({
                filename: path.resolve(LOG_DIRECTORY??"./logs", 'video-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '50m',
                maxFiles: '15d',
            }),
        ],
    });
}

export default logger();
