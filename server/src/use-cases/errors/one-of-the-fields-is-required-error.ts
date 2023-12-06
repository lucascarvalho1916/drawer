export class OneOfTheFieldsIsRequiredError extends Error {
  constructor() {
    super('At least one of the fields (name, cpf, endAt) is required.')
  }
}
