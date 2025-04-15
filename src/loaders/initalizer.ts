import { checkEnv } from '@config';
import { connectionPool } from '@db/helpers/database';
import { s3ConnectionLoader } from '@loaders/s3_config';

import log from '@logger';

// import initializeRoutes from '@routes/initializer';
import { Application } from 'express';
import initializeRoutes from '@routes/initializer';
import serverLoader from './server';


export async function initializeApp(app: Application) {
    try {
        await checkEnv();

        await connectionPool();
    
        serverLoader(app);
        s3ConnectionLoader();
  
        initializeRoutes(app);
    } catch (error) {
        log.error('ERROR occurred in initializeApp().', error);
        throw error;
    }
}
