import { CollaboratorsRepository } from '@/repositories/collaborators-repository'
import { Collaborator } from '@prisma/client'
import { formatName } from './utils/formatName'
import { CPFAlreadyExistsError } from './errors/cpf-already-exists-error'
import { ThereWereNoChangesError } from './errors/there-were-no-changes-error'
import { OneOfTheFieldsIsRequiredError } from './errors/one-of-the-fields-is-required-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditCollaboratorUseCaseRequest {
  collaboratorId: string
  name: string | null | undefined
  cpf: string | null | undefined
  endAt: Date | null | undefined
}

interface EditCollaboratorUseCaseResponse {
  collaborator: Collaborator
}

export class EditCollaboratorUseCase {
  constructor(private collaboratorsRepository: CollaboratorsRepository) {}

  async execute({
    collaboratorId,
    name,
    cpf,
    endAt,
  }: EditCollaboratorUseCaseRequest): Promise<EditCollaboratorUseCaseResponse> {
    if (name === '' && cpf === '' && endAt === null) {
      throw new OneOfTheFieldsIsRequiredError()
    }

    const collaboratorExists = await this.collaboratorsRepository.findById(
      collaboratorId,
    )

    if (!collaboratorExists) {
      throw new ResourceNotFoundError()
    }

    if (collaboratorExists?.name === name && cpf === '' && endAt === null) {
      throw new ThereWereNoChangesError()
    }

    if (name === '' && collaboratorExists?.cpf === cpf && endAt === null) {
      throw new ThereWereNoChangesError()
    }

    if (
      name === '' &&
      cpf === '' &&
      collaboratorExists?.end_at?.toString() === endAt?.toString()
    ) {
      throw new ThereWereNoChangesError()
    }

    if (
      collaboratorExists?.name === name &&
      collaboratorExists?.cpf === cpf &&
      collaboratorExists?.end_at?.toString() === endAt?.toString()
    ) {
      throw new ThereWereNoChangesError()
    }

    const updatedData: { name?: string; cpf?: string; endAt?: Date } = {}

    if (name !== undefined && name !== null && name !== '') {
      const formattedName = formatName(name)

      updatedData.name = formattedName
    }

    if (cpf !== undefined && cpf !== null && cpf !== '') {
      const CPFAlreadyExists = await this.collaboratorsRepository.findByCPF(cpf)

      if (
        collaboratorExists?.cpf === CPFAlreadyExists?.cpf &&
        collaboratorExists?.id !== CPFAlreadyExists?.id
      ) {
        throw new CPFAlreadyExistsError()
      }

      updatedData.cpf = cpf
    }

    if (endAt !== undefined && endAt !== null) {
      updatedData.endAt = endAt
    }

    const collaborator = await this.collaboratorsRepository.edit(
      collaboratorId,
      updatedData,
    )

    return {
      collaborator,
    }
  }
}
