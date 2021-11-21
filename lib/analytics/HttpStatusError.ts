export class HttpStatusError extends Error {
  readonly name = "HttpStatusError";

  constructor(
    expectedStatus: number,
    actualStatus: number,
    message: string = "Unexpected status code"
  ) {
    super(message);
    this.message = `${message}: Expected status ${expectedStatus} but got ${actualStatus}`;
  }
}
