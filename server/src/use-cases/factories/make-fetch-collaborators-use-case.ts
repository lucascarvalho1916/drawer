import { PrismaCollaboratorsRepository } from '@/repositories/prisma/prisma-collaborators-repository'
import { FetchCollaboratorsUseCase } from '../fetch-collaborators'

export function makeFetchCollaboratorsUseCase() {
  const collaboratorsRepository = new PrismaCollaboratorsRepository()
  const useCase = new FetchCollaboratorsUseCase(collaboratorsRepository)

  return useCase
}
