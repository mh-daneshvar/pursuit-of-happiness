import LogMessage from '@Common/logMessage.enum';

export default class BaseEvent {
  constructor(
    private readonly message: LogMessage,
    private readonly details: Record<string, any>,
    private readonly searchBy?: string | number,
  ) {}

  public getMessage(): LogMessage {
    return this.message;
  }

  public getDetails(): Record<string, any> {
    return this.details;
  }

  public getSearchBy(): string {
    return this.searchBy?.toString();
  }
}
