import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { ChangeOwnPasswordUserUseCase } from '../change-own-password'

export function makeChangeOwnPasswordUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new ChangeOwnPasswordUserUseCase(usersRepository)

  return useCase
}
