import { PrismaEventsRepository } from '@/repositories/prisma/prisma-events-repository'
import { FetchEventsUseCase } from '../fetch-events'

export function makeFetchEventsUseCase() {
  const eventsRepository = new PrismaEventsRepository()
  const useCase = new FetchEventsUseCase(eventsRepository)

  return useCase
}
