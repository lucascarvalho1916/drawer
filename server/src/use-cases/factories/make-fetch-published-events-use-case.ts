import { PrismaEventsRepository } from '@/repositories/prisma/prisma-events-repository'
import { FetchPublishedEventsUseCase } from '../fetch-published-events'

export function makeFetchPublishedEventsUseCase() {
  const eventsRepository = new PrismaEventsRepository()
  const useCase = new FetchPublishedEventsUseCase(eventsRepository)

  return useCase
}
