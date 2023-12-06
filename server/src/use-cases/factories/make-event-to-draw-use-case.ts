import { PrismaEventsRepository } from '@/repositories/prisma/prisma-events-repository'
import { EventToDrawUseCase } from '../event-to-draw'
import { PrismaCollaboratorsRepository } from '@/repositories/prisma/prisma-collaborators-repository'
import { PrismaDrawsRepository } from '@/repositories/prisma/prisma-draws-repository'

export function makeEventToDrawUseCase() {
  const eventsRepository = new PrismaEventsRepository()
  const collaboratorsRepository = new PrismaCollaboratorsRepository()
  const drawsRepository = new PrismaDrawsRepository()

  const useCase = new EventToDrawUseCase(
    eventsRepository,
    collaboratorsRepository,
    drawsRepository,
  )

  return useCase
}
