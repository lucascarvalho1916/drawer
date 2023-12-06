import { PrismaCollaboratorsRepository } from '@/repositories/prisma/prisma-collaborators-repository'
import { GetNotDrawnsByDrawUseCase } from '../get-not-drawns-by-draw'

export function makeGetNotDrawnsByDrawUseCase() {
  const collaboratorsRepository = new PrismaCollaboratorsRepository()
  const useCase = new GetNotDrawnsByDrawUseCase(collaboratorsRepository)

  return useCase
}
