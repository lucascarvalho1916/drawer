import { CollaboratorsRepository } from '@/repositories/collaborators-repository'
import { Collaborator } from '@prisma/client'
import { CPFAlreadyExistsError } from './errors/cpf-already-exists-error'
import { formatName } from './utils/formatName'

interface RegisterCollaboratorUseCaseRequest {
  name: string
  cpf: string
  startAt: Date
  userId: string
}

interface RegisterCollaboratorUseCaseResponse {
  collaborator: Collaborator
}

export class RegisterCollaboratorUseCase {
  constructor(private collaboratorsRepository: CollaboratorsRepository) {}

  async execute({
    name,
    cpf,
    startAt,
    userId,
  }: RegisterCollaboratorUseCaseRequest): Promise<RegisterCollaboratorUseCaseResponse> {
    const formattedName = formatName(name)

    const userWithSameCPF = await this.collaboratorsRepository.findByCPF(cpf)

    if (userWithSameCPF) {
      throw new CPFAlreadyExistsError()
    }

    const collaborator = await this.collaboratorsRepository.create({
      name: formattedName,
      cpf,
      start_at: startAt,
      user_id: userId,
    })

    return {
      collaborator,
    }
  }
}
