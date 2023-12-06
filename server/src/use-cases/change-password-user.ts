import { ThereWereNoChangesError } from './errors/there-were-no-changes-error'
import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { compare, hash } from 'bcryptjs'

interface ChangePasswordUserUseCaseRequest {
  userId: string
  password: string
}

interface ChangePasswordUserUseCaseResponse {
  user: User
}

export class ChangePasswordUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    password,
  }: ChangePasswordUserUseCaseRequest): Promise<ChangePasswordUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const samePassword = await compare(password, user.password_hash)

    if (samePassword) {
      throw new ThereWereNoChangesError()
    }

    const password_hash = await hash(password, 6)

    await this.usersRepository.changePassword(userId, password_hash)

    return {
      user,
    }
  }
}
