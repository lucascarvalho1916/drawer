import { PrismaCollaboratorsRepository } from '@/repositories/prisma/prisma-collaborators-repository'
import { FetchPublishedNotDrawnsByDrawUseCase } from '../fetch-published-not-drawns-by-draw'

export function makeFetchPublishedNotDrawnsByDrawUseCase() {
  const collaboratorsRepository = new PrismaCollaboratorsRepository()
  const useCase = new FetchPublishedNotDrawnsByDrawUseCase(
    collaboratorsRepository,
  )

  return useCase
}
