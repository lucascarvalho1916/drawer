import { User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ChangeUserToAdminUseCaseRequest {
  userId: string
}

interface ChangeUserToAdminUseCaseResponse {
  user: User
}

export class ChangeUserToAdminUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: ChangeUserToAdminUseCaseRequest): Promise<ChangeUserToAdminUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const newParamIsAdmin = user.is_admin !== true

    await this.usersRepository.changeToAdmin(userId, newParamIsAdmin)

    return {
      user,
    }
  }
}
