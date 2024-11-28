import { Logger } from '@nestjs/common';
import IBasePayload from '@SecondaryAdapters/internalEvents/configs/base.payload';

export default class BaseListener {
  private readonly logger = new Logger();

  public logInfo(msg: IBasePayload): void {
    const { context, event } = msg;
    this.logger.log(
      event.getMessage(),
      context,
      event.getDetails(),
      event.getSearchBy(),
    );
  }

  public logError(msg: IBasePayload): void {
    const { context, event } = msg;
    this.logger.error(
      event.getMessage(),
      context,
      event.getDetails(),
      event.getSearchBy(),
    );
  }
}
