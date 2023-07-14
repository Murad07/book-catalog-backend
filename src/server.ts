import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
// import { logger, errorlogger } from './shared/logger';
import { Server } from 'http';

// const port: number = 5000;

process.on('uncaughtException', error => {
  // console.log(error);
  console.log(error);
  process.exit(1);
});

let server: Server;

// database connection
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    // console.log('Database connection successfull');
    console.log('Database connection successfull');

    server = app.listen(config.port, () => {
      // console.log(`Server listening on port ${config.port}`);
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (err) {
    // console.log('Failed to connect database', err);
    console.log('Failed to connect database', err);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        // console.log(error);
        console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

process.on('SIGTERM', () => {
  // console.log('SIGTERM is received');
  console.log('SIGTERM is received');
  if (server) {
    server.close();
  }
});
