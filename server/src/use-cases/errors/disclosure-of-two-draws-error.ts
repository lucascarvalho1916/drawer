export class DisclosureOfTwoDrawsError extends Error {
  constructor() {
    super('It is not allowed to publicize more than one draw at the same time.')
  }
}
