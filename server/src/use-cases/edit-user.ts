import { formatName } from './utils/formatName'
import { ThereWereNoChangesError } from './errors/there-were-no-changes-error'
import { OneOfTheFieldsIsRequiredError } from './errors/one-of-the-fields-is-required-error'
import { UsersRepository } from '@/repositories/users-repository'
import { LoginAlreadyExistsError } from './errors/login-already-exists-error'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditUserUseCaseRequest {
  userId: string
  name: string | null | undefined
  login: string | null | undefined
  email: string | null | undefined
  endAt: Date | null | undefined
}

interface EditUserUseCaseResponse {
  user: User
}

export class EditUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    name,
    login,
    email,
    endAt,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    if (name === '' && login === '' && email === '' && endAt === null) {
      throw new OneOfTheFieldsIsRequiredError()
    }

    const userExists = await this.usersRepository.findById(userId)

    if (!userExists) {
      throw new ResourceNotFoundError()
    }

    if (
      userExists?.name === name &&
      login === '' &&
      email === '' &&
      endAt === null
    ) {
      throw new ThereWereNoChangesError()
    }

    if (
      name === '' &&
      userExists?.login === login &&
      email === '' &&
      endAt === null
    ) {
      throw new ThereWereNoChangesError()
    }

    if (
      name === '' &&
      login === '' &&
      userExists?.email === email &&
      endAt === null
    ) {
      throw new ThereWereNoChangesError()
    }

    if (
      name === '' &&
      login === '' &&
      email === '' &&
      userExists?.end_at?.toString() === endAt?.toString()
    ) {
      throw new ThereWereNoChangesError()
    }

    if (
      userExists?.name === name &&
      userExists?.login === login &&
      userExists?.email === email &&
      userExists?.end_at?.toString() === endAt?.toString()
    ) {
      throw new ThereWereNoChangesError()
    }

    const updatedData: {
      name?: string
      login?: string
      email?: string
      endAt?: Date
    } = {}

    if (name !== undefined && name !== null && name !== '') {
      const formattedName = formatName(name)

      updatedData.name = formattedName
    }

    if (login !== undefined && login !== null && login !== '') {
      const loginAlreadyExists = await this.usersRepository.findByLogin(login)

      if (
        userExists?.login === loginAlreadyExists?.login &&
        userExists?.id !== loginAlreadyExists?.id
      ) {
        throw new LoginAlreadyExistsError()
      }

      updatedData.login = login
    }

    if (email !== undefined && email !== null && email !== '') {
      const emailAlreadyExists = await this.usersRepository.findByEmail(email)

      if (
        userExists?.email === emailAlreadyExists?.email &&
        userExists?.id !== emailAlreadyExists?.id
      ) {
        throw new EmailAlreadyExistsError()
      }

      updatedData.email = email
    }

    if (endAt !== undefined && endAt !== null) {
      updatedData.endAt = endAt
    }

    const user = await this.usersRepository.edit(userId, updatedData)

    return {
      user,
    }
  }
}
