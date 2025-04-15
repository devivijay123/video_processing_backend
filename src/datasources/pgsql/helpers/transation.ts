import log from '@logger';
import {PoolClient, types} from 'pg';
import {connectionPool} from './database'

// Parse BIGINT (OID(Object Identfier) 20) and INT (OID 23) as integers
types.setTypeParser(20, val => parseInt(val, 10));
types.setTypeParser(23, val => parseInt(val, 10));
types.setTypeParser(1700, val => parseFloat(val));

const TAG = 'data_stores.mysql.helpers.transaction.';

export async function beginTransaction(connection: PoolClient): Promise<void> {
    log.info(TAG + 'beginTransaction()');
    try {
        await connection.query('BEGIN');
    } catch (e) {
        log.error(TAG +'ERROR occurred beginTransaction() ', e);
        throw e;
    }
}

export async function releaseConnection(connection: PoolClient): Promise<void> {
    log.info('endTransaction()');
    log.debug('END transaction');
    try {
        connection.release();
    } catch (e) {
        log.error('ERROR occurred releaseConnection() ', e);
        throw e;
    }
}

export async function commitTransaction(connection: PoolClient): Promise<void> {
    log.info('commitTransaction()');
    try {
        await connection.query('COMMIT');
    } catch (e) {
        log.error('ERROR occurred commitTransaction() ', e);
        throw e;
    }
}

export async function rollBackTransaction(connection: PoolClient): Promise<void> {
    log.info('rollBackTransaction()');
    try {
        await connection.query('ROLLBACK');
    } catch (e) {
        log.error('ERROR occurred rollBackTransaction() ', e);
        throw e;
    }
}

export async function handleTransaction(connection: PoolClient, commit: boolean, module: string = '') {
    log.info(TAG + 'handleTransaction()');
    try {
        if (commit) {
            await commitTransaction(connection);
        }else{
            await rollBackTransaction(connection)
        }

        await releaseConnection(connection);
    } catch (e) {
        log.error('ERROR occurred handleTransaction() ', e);
        throw e;
    }
}

export async function getConnection(isTransactional?: boolean): Promise<PoolClient> {
    log.info(TAG +'getConnection()');
        try {
            const pool = await connectionPool();
            const client = await pool.connect();
            if(isTransactional){
                await beginTransaction(client);
            }
            return client;
        } catch (e) {
            log.error(TAG +'ERROR occurred getConnection() ', e);
            throw e;
        }
}
