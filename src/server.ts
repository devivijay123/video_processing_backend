import 'reflect-metadata';
import express from 'express';
import { initializeApp } from '@loaders/initalizer';
import { PORT } from '@config';
import log from '@logger';
import http from 'http';


async function startApplication() {
  try {
    const app: express.Application = express();
    app.use(
      express.json({
        type: [
          'text/plain',
          'application/json'
        ],
      })
    );

    await initializeApp(app);
    const server = http.createServer(app);

 
    server.listen(PORT, () => {
      log.info(`SERVER listening on PORT:${PORT}`);
    });

  } catch (error) {
    log.error('ERROR in Starting Application', error);
    log.error('Killing Application process');
    process.exit(1);
  }
}

startApplication().catch((err) => log.error('ERROR occurred while starting Application.', err));
