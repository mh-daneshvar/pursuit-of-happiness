import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { NextFunction, Request, Response } from 'express';
import SyslogLogger from '@SecondaryAdapters/logger/syslog.logger';
import StdoutLogger from '@SecondaryAdapters/logger/stdout.logger';

async function bootstrap(): Promise<Logger> {
  const logger = new Logger('Bootstrap');

  // --------------------------------------------
  // CREATE THE APP -----------------------------
  // --------------------------------------------

  const app = await NestFactory.create(AppModule);

  // --------------------------------------------
  // PREPARE UTILITIES --------------------------
  // --------------------------------------------

  // load the configurations
  const configService = app.get(ConfigService);
  const appName = configService.get<string>('APP_NAME');

  // Configure the logger
  const loggingStrategy = configService
    .get<string>('APP_LOGGING_STRATEGY')
    ?.toUpperCase();
  if (loggingStrategy === 'SYSLOG') {
    app.useLogger(new SyslogLogger(configService));
  } else if (loggingStrategy === 'STDOUT') {
    app.useLogger(new StdoutLogger(configService));
  }

  // Configure the global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Configure cors
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });

  // --------------------------------------------
  // 3D-PARTIES ---------------------------------
  // --------------------------------------------

  Sentry.init({
    dsn: configService.get<string>('SENTRY_DSN'),
    tracesSampleRate: 1.0,
  });

  // --------------------------------------------
  // RUN THE API --------------------------------
  // --------------------------------------------

  // RESTful
  const appRestPort = configService.get<string>('APP_REST_PORT');
  await app.listen(appRestPort);

  // listen to the all defined ports
  await app.startAllMicroservices();
  logger.log(`${appName} RESTful is running on port ${appRestPort}`);
  return logger;
}

bootstrap()
  .then((logger) => {
    logger.log(`App is running`);
  })
  .catch((e) => {
    console.error({
      level: 'ERROR',
      message: 'App could not run',
      context: 'Bootstrap',
      details: e,
    });
  });
