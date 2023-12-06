export class TheUseOfCharactersInTheCollaboratorNameError extends Error {
  constructor() {
    super(
      'The use of special characters and numbers in the name is not allowed.',
    )
  }
}
