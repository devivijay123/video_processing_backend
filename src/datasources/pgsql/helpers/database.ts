import {PG_DATABASE} from '@config';
import log from '@logger';

import { Pool, Client } from 'pg';

let pool;
//const ESCAPE_FIELDS = ['order', 'sort_order', 'sort_by', 'limit', 'offset', 'sortBy', 'sortOrder', 'bulkData'];

export const connectionPool = async ():Promise<Pool> => {
    try {
        log.info(`sqlConnection()`);
        if (pool) {
            return pool;
        }
        log.debug(`creating connection pool with config: ${JSON.stringify(PG_DATABASE)}`);
        pool = new Pool({
            host: PG_DATABASE.host,
            database: PG_DATABASE.db_name,
            user: PG_DATABASE.username,
            password: PG_DATABASE.password,
            port: PG_DATABASE.port,
            options: PG_DATABASE.options,
          //  poolSize: PG_DATABASE.pool_size
        })

        // await pool.query('SELECT NOW()')

        return pool;
    } catch (error) {
        log.error('ERROR Occurred while creating sqlConnection()', error);
        throw error;
    }
};


