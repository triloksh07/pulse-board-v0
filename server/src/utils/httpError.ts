export class HttpError extends Error {
  public statusCode: number;
  public details: any;

  constructor(statusCode: number, message: string, details: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    
    // Set prototype explicitly for extending built-in Error in TS
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export function notFound(message: string = "Resource not found"): HttpError {
  return new HttpError(404, message);
}