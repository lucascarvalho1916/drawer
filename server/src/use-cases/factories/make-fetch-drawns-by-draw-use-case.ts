import { PrismaEventsRepository } from '@/repositories/prisma/prisma-events-repository'
import { FetchDrawnsByDrawUseCase } from '../fetch-drawns-by-draw'

export function makeFetchDrawnsByDrawUseCase() {
  const eventsRepository = new PrismaEventsRepository()
  const useCase = new FetchDrawnsByDrawUseCase(eventsRepository)

  return useCase
}
