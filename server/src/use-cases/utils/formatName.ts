import { TheUseOfCharactersInTheCollaboratorNameError } from '../errors/the-use-of-characters-in-the-collaborator-name'

export function formatName(name: string) {
  const regex = /[0-9!@#$%^&*(),.?":{}|<>]/g

  if (regex.test(name)) {
    throw new TheUseOfCharactersInTheCollaboratorNameError()
  }

  const words = name.toLowerCase().split(' ')

  const formattedName = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return formattedName
}
