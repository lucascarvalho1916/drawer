import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { ChangePasswordUserUseCase } from '../change-password-user'

export function makeChangePasswordUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new ChangePasswordUserUseCase(usersRepository)

  return useCase
}
