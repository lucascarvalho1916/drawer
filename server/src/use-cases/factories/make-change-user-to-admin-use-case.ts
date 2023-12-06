import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ChangeUserToAdminUseCase } from '../change-user-to-admin'

export function makeChangeUserToAdminUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new ChangeUserToAdminUseCase(usersRepository)

  return useCase
}
