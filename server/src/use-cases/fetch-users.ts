import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'

interface FetchUsersUseCaseRequest {
  page: number | undefined
  resultsPerPage: number | undefined
  query: string
  sortColumn: string
  sortDirection: string
}

interface FetchUsersUseCaseResponse {
  users: User[]
  total: number
  perPage: number
  currentPage: number
}

export class FetchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
    resultsPerPage,
    query,
    sortColumn,
    sortDirection,
  }: FetchUsersUseCaseRequest): Promise<FetchUsersUseCaseResponse> {
    const { users, total, perPage, currentPage } =
      await this.usersRepository.findMany(
        page,
        resultsPerPage,
        query,
        sortColumn,
        sortDirection,
      )

    return {
      users,
      total,
      perPage,
      currentPage,
    }
  }
}
