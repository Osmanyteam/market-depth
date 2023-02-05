// we create custom error classes for API exceptions
export default class ApiError extends Error {
  public apiCode: number

  constructor (message: string, apiCode: number) {
    super(message)
    this.apiCode = apiCode
  }
}
