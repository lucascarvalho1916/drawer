import { Prisma, User } from '@prisma/client'

export interface UpdateUser {
  name?: string
  login?: string
  email?: string
  endAt?: Date
}

export interface UsersRepository {
  findMany(
    page: number | undefined,
    resultsPerPage: number | undefined,
    search: string,
    sortColumn: string,
    sortDirection: string,
  ): Promise<{
    users: User[]
    total: number
    perPage: number
    currentPage: number
  }>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByLogin(login: string): Promise<User | null>
  changeToAdmin(id: string, newParamIsAdmin: boolean): Promise<User>
  changePassword(id: string, password_hash: string): Promise<User>
  edit(id: string, data: UpdateUser): Promise<User>
  create(data: Prisma.UserCreateInput): Promise<User>
}
