import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';
import { Syslog } from 'winston-syslog';

export default class SyslogLogger implements LoggerService {
  private logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    this.logger = winston.createLogger({
      transports: [
        new Syslog({
          port: +this.configService.get<number>('APP_LOGGING_SYSLOG_PORT'),
          protocol: this.configService.get<string>(
            'APP_LOGGING_SYSLOG_PROTOCOL',
          ),
          app_name: this.configService.get<string>('APP_NAME'),
          host: this.configService.get<string>('APP_LOGGING_SYSLOG_HOST'),
          eol: '\n',
        }),
      ],
    });
  }

  private _printer(
    level: string,
    message: string,
    context: string,
    details: Record<string, any>,
    searchBy?: string,
    traceId?: string,
  ): void {
    const logMessage = {
      app_name: this.configService.get<string>('APP_NAME'),
      level: level.toUpperCase(),
      message,
      trace_id: traceId ? traceId.toString() : undefined,
      search_by: searchBy ? searchBy.toString() : undefined,
      version: this.configService.get<string>('APP_VERSION', 'unknown'),
      context: typeof details === 'string' ? details : context,
      details: JSON.stringify(typeof details === 'string' ? context : details),
      created_at: new Date(),
    };

    this.logger.log(level, JSON.stringify(logMessage));
  }

  log(
    message: string,
    context: string,
    details: Record<string, any>,
    searchBy: string,
  ): void {
    this._printer('info', message, context, details, searchBy);
  }

  error(
    message: string,
    context: string,
    details: Record<string, any>,
    searchBy: string,
  ): void {
    this._printer('error', message, context, details, searchBy);
  }

  warn(message: string, context: string, details: Record<string, any>): void {
    this._printer('warn', message, context, details);
  }

  debug(message: string, context: string, details: Record<string, any>): void {
    this._printer('debug', message, context, details);
  }
}
