
import logger from '@logger';
import { PoolClient, QueryResult } from 'pg';
import nodeUtil from 'util';

export async function saveRecord(connection: PoolClient, query: string, replacements: any = {}):
    Promise<any> {
    try {
        logger.info('STARTED saveRecord()');
        logger.debug(`executing sql query:${query} replacements : ${nodeUtil.inspect(replacements)} `);

        const result: any = await connection.query(query, replacements);
        logger.debug("saveRecord result::" + nodeUtil.inspect(result));
        return getInsertedRecord(result, 'saveRecord()');
    } catch (error) {
        logger.error(`ERROR in saveRecord()`, error);
        throw error;
    }
}

export async function fetchRecord(connection: PoolClient, query: string, replacements: any = []):
    Promise<any> {
    try {
        logger.info('STARTED fetchRecord()');
        logger.debug(`executing sql query:${query} replacements : ${nodeUtil.inspect(replacements)} `);

        // @ts-ignore
        const result = await connection.query(query, replacements);
        // logger.debug("result::"+nodeUtil.inspect(result));
        return getRecord(result, 'fetchRecord()');
    } catch (error) {
        logger.error(`ERROR in fetchRecord() `, error);
        throw error;
    }
}

export async function fetchRecords(connection: PoolClient, query: string, replacements: any = {}):
    Promise<any> {
    try {
        logger.info('STARTED fetchRecords()');
        logger.debug(`executing sql query:${query} replacements : ${nodeUtil.inspect(replacements)} `);
        // @ts-ignore
        const result = await connection.query(query, replacements);
        return result?.rows;
    } catch (error) {
        logger.error(`ERROR in fetchRecords()`, error);
        throw error;
    }
}

export async function updateRecord(connection: PoolClient, query: string, replacements: any = {}):
    Promise<void> {
    try {
        logger.info('STARTED updateRecord()');
        logger.debug(`executing sql query:${query} replacements : ${nodeUtil.inspect(replacements)} `);
        await connection.query(query, replacements);
        return;
    } catch (error) {
        logger.error(`ERROR in updateRecord()`, error);
        throw error;
    }
}

export async function deleteRecord(connection: PoolClient, query: string, replacements: any = {}):
    Promise<void> {
    try {
        logger.info('STARTED deleteRecord()');
        logger.debug(`executing sql query:${query} replacements : ${nodeUtil.inspect(replacements)} `);
        // @ts-ignore
        await connection.query(query, replacements);
        return;
    } catch (error) {
        logger.error(`ERROR in deleteRecord()`, error);
        throw error;
    }
}

export function getRecord(dbResultsArray: QueryResult, debugMsg: string): any {
    if (dbResultsArray?.rowCount >= 0) {
        if (dbResultsArray?.rowCount === 0) {
            return null;
        } else if (dbResultsArray?.rowCount === 1) {
            return dbResultsArray.rows[0];
        } else {
            throw (new Error('More than one record found for ' + debugMsg));
        }
    }
}

export function getInsertedRecord(dbResultsArray: QueryResult, debugMsg: string): any {
    if (dbResultsArray?.rowCount >= 0) {
        if (dbResultsArray?.rowCount === 0) {
            return null;
        } else {
            return dbResultsArray.rows[0];
        }
    }
}
