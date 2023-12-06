import { EditUserUseCase } from '../edit-user'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeEditUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new EditUserUseCase(usersRepository)

  return useCase
}
