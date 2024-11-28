import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export default class StdoutLogger implements LoggerService {
  constructor(private readonly configService: ConfigService) {}
  private _printer(
    level: string,
    message: string,
    context: string,
    details: Record<string, any>,
    searchBy?: string,
    traceId?: string,
  ): void {
    console.log(
      JSON.stringify({
        app_name: this.configService.get<string>('APP_NAME'),
        level,
        message,
        trace_id: traceId ? traceId.toString() : undefined,
        search_by: searchBy ? searchBy.toString() : undefined,
        version: this.configService.get<string>('APP_VERSION', 'unknown'),
        context: typeof details === 'string' ? details : context,
        details: JSON.stringify(
          typeof details === 'string' ? context : details,
        ),
        created_at: new Date(),
      }),
    );
  }

  error(
    message: string,
    context: string,
    details: Record<string, any>,
    searchBy: string,
  ): void {
    this._printer('ERROR', message, context, details, searchBy);
  }

  warn(message: string, context: string, details: Record<string, any>): void {
    this._printer('WARN', message, context, details);
  }

  debug(message: string, context: string, details: Record<string, any>): void {
    this._printer('DEBUG', message, context, details);
  }

  log(
    message: string,
    context: string,
    details: Record<string, any>,
    searchBy: string,
  ): void {
    this._printer('INFO', message, context, details, searchBy);
  }
}
