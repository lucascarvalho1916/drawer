import { PrismaDrawsRepository } from '@/repositories/prisma/prisma-draws-repository'
import { FetchDrawsUseCase } from '../fetch-draws'

export function makeFetchDrawsUseCase() {
  const drawsRepository = new PrismaDrawsRepository()
  const useCase = new FetchDrawsUseCase(drawsRepository)

  return useCase
}
