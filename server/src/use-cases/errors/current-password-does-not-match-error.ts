export class CurrentPasswordDoesNotMatchError extends Error {
  constructor() {
    super('Current password does not match.')
  }
}
