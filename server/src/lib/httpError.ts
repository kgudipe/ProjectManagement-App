/** Error type that carries an HTTP status code so the error handler can respond appropriately. */
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export const notFoundError = (resource: string) => new HttpError(404, `${resource} not found`);
