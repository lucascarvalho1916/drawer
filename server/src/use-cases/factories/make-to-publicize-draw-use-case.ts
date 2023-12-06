import { PrismaDrawsRepository } from '@/repositories/prisma/prisma-draws-repository'
import { ToPublicizeDrawUseCase } from '../to-publicize-draw'

export function makeToPublicizeDrawUseCase() {
  const drawsRepository = new PrismaDrawsRepository()
  const useCase = new ToPublicizeDrawUseCase(drawsRepository)

  return useCase
}
