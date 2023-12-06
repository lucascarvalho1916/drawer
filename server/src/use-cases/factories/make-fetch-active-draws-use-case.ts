import { PrismaDrawsRepository } from '@/repositories/prisma/prisma-draws-repository'
import { FetchActiveDrawsUseCase } from '../fetch-active-draws'

export function makeFetchActiveDrawsUseCase() {
  const drawsRepository = new PrismaDrawsRepository()
  const useCase = new FetchActiveDrawsUseCase(drawsRepository)

  return useCase
}
