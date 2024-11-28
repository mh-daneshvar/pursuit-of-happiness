import BaseError from '@Errors/base.error';

export default class PostgresError extends BaseError {
  constructor(e: Error, message?: string) {
    message =
      message ?? (e.message.length > 0 ? e.message : 'testRedis error!');
    super(e, message, true);
    this.name = this.constructor.name;
  }
}
