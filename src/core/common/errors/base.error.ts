export default class BaseError extends Error {
  protected rootCause: Error;
  protected logError: boolean;

  constructor(
    rootCause: Error,
    message: string = '',
    logError: boolean = false,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.rootCause = rootCause;
    this.logError = logError;
  }
}
