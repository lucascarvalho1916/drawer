import { PrismaEventsRepository } from '@/repositories/prisma/prisma-events-repository'
import { GetDrawnsByDrawUseCase } from '../get-drawns-by-draw'

export function makeGetDrawnsByDrawUseCase() {
  const eventsRepository = new PrismaEventsRepository()
  const useCase = new GetDrawnsByDrawUseCase(eventsRepository)

  return useCase
}
