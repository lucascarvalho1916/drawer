import { Prisma, Draw } from '@prisma/client'

export interface UpdateDraw {
  description?: string
  endAt?: Date
}

export interface DrawsRepository {
  findById(id: string): Promise<Draw | null>
  fetchPublished(): Promise<Draw[]>
  toPublicize(id: string, newParamPublicize: boolean): Promise<Draw>
  findMany(
    page: number | undefined,
    resultsPerPage: number | undefined,
    query: string,
    sortColumn: string,
    sortDirection: string,
  ): Promise<{
    draws: Draw[]
    total: number
    perPage: number
    currentPage: number
  }>
  findManyActive(date: Date): Promise<Draw[]>
  edit(id: string, data: UpdateDraw): Promise<Draw>
  create(data: Prisma.DrawUncheckedCreateInput): Promise<Draw>
}
