export class ThereWereNoChangesError extends Error {
  constructor() {
    super('No changes made.')
  }
}
