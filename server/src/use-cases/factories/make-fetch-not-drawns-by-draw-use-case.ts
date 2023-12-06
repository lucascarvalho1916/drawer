import { PrismaCollaboratorsRepository } from '@/repositories/prisma/prisma-collaborators-repository'
import { FetchNotDrawnsByDrawUseCase } from '../fetch-not-drawns-by-draw'

export function makeFetchNotDrawnsByDrawUseCase() {
  const collaboratorsRepository = new PrismaCollaboratorsRepository()
  const useCase = new FetchNotDrawnsByDrawUseCase(collaboratorsRepository)

  return useCase
}
