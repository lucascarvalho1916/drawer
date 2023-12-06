import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { compare, hash } from 'bcryptjs'
import { CurrentPasswordDoesNotMatchError } from './errors/current-password-does-not-match-error'

interface ChangeOwnPasswordUserUseCaseRequest {
  userId: string
  currentPassword: string
  newPassword: string
}

interface ChangeOwnPasswordUserUseCaseResponse {
  user: User
}

export class ChangeOwnPasswordUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    currentPassword,
    newPassword,
  }: ChangeOwnPasswordUserUseCaseRequest): Promise<ChangeOwnPasswordUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    console.log(currentPassword)
    console.log(user.password_hash)

    const currentPasswordMatch = await compare(
      currentPassword,
      user.password_hash,
    )

    if (!currentPasswordMatch) {
      throw new CurrentPasswordDoesNotMatchError()
    }

    const password_hash = await hash(newPassword, 6)

    await this.usersRepository.changePassword(userId, password_hash)

    return {
      user,
    }
  }
}
