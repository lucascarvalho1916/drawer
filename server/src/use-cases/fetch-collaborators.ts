import { CollaboratorsRepository } from '@/repositories/collaborators-repository'
import { Collaborator } from '@prisma/client'

interface FetchCollaboratorsUseCaseRequest {
  page: number | undefined
  resultsPerPage: number | undefined
  query: string
  sortColumn: string
  sortDirection: string
}

interface FetchCollaboratorsUseCaseResponse {
  collaborators: Collaborator[]
  total: number
  perPage: number
  currentPage: number
}

export class FetchCollaboratorsUseCase {
  constructor(private collaboratorsRepository: CollaboratorsRepository) {}

  async execute({
    page,
    resultsPerPage,
    query,
    sortColumn,
    sortDirection,
  }: FetchCollaboratorsUseCaseRequest): Promise<FetchCollaboratorsUseCaseResponse> {
    const { collaborators, total, perPage, currentPage } =
      await this.collaboratorsRepository.findMany(
        page,
        resultsPerPage,
        query,
        sortColumn,
        sortDirection,
      )

    return {
      collaborators,
      total,
      perPage,
      currentPage,
    }
  }
}
