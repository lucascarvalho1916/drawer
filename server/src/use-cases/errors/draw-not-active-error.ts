export class DrawNotActiveError extends Error {
  constructor() {
    super('Draw is not active.')
  }
}
