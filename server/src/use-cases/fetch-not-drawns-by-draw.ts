import { CollaboratorsRepository } from '@/repositories/collaborators-repository'
import { Collaborator } from '@prisma/client'

interface FetchNotDrawnsByDrawUseCaseRequest {
  page: number | undefined
  resultsPerPage: number | undefined
  query: string
  sortColumn: string
  sortDirection: string
  drawId: string
}

interface FetchNotDrawnsByDrawUseCaseResponse {
  collaborators: Collaborator[]
  total: number
  perPage: number
  currentPage: number
}

export class FetchNotDrawnsByDrawUseCase {
  constructor(private collaboratorsRepository: CollaboratorsRepository) {}

  async execute({
    page,
    resultsPerPage,
    query,
    sortColumn,
    sortDirection,
    drawId,
  }: FetchNotDrawnsByDrawUseCaseRequest): Promise<FetchNotDrawnsByDrawUseCaseResponse> {
    const { collaborators, total, perPage, currentPage } =
      await this.collaboratorsRepository.findNotDrawnByDraw(
        page,
        resultsPerPage,
        query,
        sortColumn,
        sortDirection,
        drawId,
      )

    return {
      collaborators,
      total,
      perPage,
      currentPage,
    }
  }
}
