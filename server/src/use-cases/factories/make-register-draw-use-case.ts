import { PrismaDrawsRepository } from '@/repositories/prisma/prisma-draws-repository'
import { RegisterDrawUseCase } from '../register-draw'

export function makeRegisterDrawUseCase() {
  const drawsRepository = new PrismaDrawsRepository()
  const useCase = new RegisterDrawUseCase(drawsRepository)

  return useCase
}
