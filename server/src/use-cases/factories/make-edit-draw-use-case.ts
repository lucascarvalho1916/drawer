import { PrismaDrawsRepository } from '@/repositories/prisma/prisma-draws-repository'
import { EditDrawUseCase } from '../edit-draw'

export function makeEditDrawUseCase() {
  const drawsRepository = new PrismaDrawsRepository()
  const useCase = new EditDrawUseCase(drawsRepository)

  return useCase
}
