import { EditCollaboratorUseCase } from '../edit-collaborators'
import { PrismaCollaboratorsRepository } from '@/repositories/prisma/prisma-collaborators-repository'

export function makeEditCollaboratorUseCase() {
  const collaboratorsRepository = new PrismaCollaboratorsRepository()
  const useCase = new EditCollaboratorUseCase(collaboratorsRepository)

  return useCase
}
