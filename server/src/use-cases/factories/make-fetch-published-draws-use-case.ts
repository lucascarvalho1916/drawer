import { PrismaDrawsRepository } from '@/repositories/prisma/prisma-draws-repository'
import { FetchPublishedDrawsUseCase } from '../fetch-published-draws'

export function makeFetchPublishedDrawsUseCase() {
  const drawsRepository = new PrismaDrawsRepository()
  const useCase = new FetchPublishedDrawsUseCase(drawsRepository)

  return useCase
}
