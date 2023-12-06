import { DrawsRepository } from '@/repositories/draws-repository'
import { Draw } from '@prisma/client'

interface FetchDrawsUseCaseRequest {
  page: number | undefined
  resultsPerPage: number | undefined
  query: string
  sortColumn: string
  sortDirection: string
}

interface FetchDrawsUseCaseResponse {
  draws: Draw[]
  total: number
  perPage: number
  currentPage: number
}

export class FetchDrawsUseCase {
  constructor(private drawsRepository: DrawsRepository) {}

  async execute({
    page,
    resultsPerPage,
    query,
    sortColumn,
    sortDirection,
  }: FetchDrawsUseCaseRequest): Promise<FetchDrawsUseCaseResponse> {
    const { draws, total, perPage, currentPage } =
      await this.drawsRepository.findMany(
        page,
        resultsPerPage,
        query,
        sortColumn,
        sortDirection,
      )

    return {
      draws,
      total,
      perPage,
      currentPage,
    }
  }
}
