import { RegisterCollaboratorUseCase } from '../register-collaborator'
import { PrismaCollaboratorsRepository } from '@/repositories/prisma/prisma-collaborators-repository'

export function makeRegisterCollaboratorUseCase() {
  const collaboratorsRepository = new PrismaCollaboratorsRepository()
  const useCase = new RegisterCollaboratorUseCase(collaboratorsRepository)

  return useCase
}
