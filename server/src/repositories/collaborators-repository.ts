import { Collaborator, Prisma } from '@prisma/client'

export interface UpdateCollaborator {
  name?: string
  cpf?: string
  endAt?: Date
}

export interface CollaboratorsRepository {
  findNotDrawnByDraw(
    page: number | undefined,
    resultsPerPage: number | undefined,
    search: string,
    sortColumn: string,
    sortDirection: string,
    drawId: string,
  ): Promise<{
    collaborators: Collaborator[]
    total: number
    perPage: number
    currentPage: number
  }>
  findPublishedNotDrawnByDraw(
    drawId: string,
    query: string,
  ): Promise<{
    collaborators: Collaborator[]
    total: number
  }>
  findById(id: string): Promise<Collaborator | null>
  findByCPF(cpf: string): Promise<Collaborator | null>
  findMany(
    page: number | undefined,
    resultsPerPage: number | undefined,
    search: string,
    sortColumn: string,
    sortDirection: string,
  ): Promise<{
    collaborators: Collaborator[]
    total: number
    perPage: number
    currentPage: number
  }>
  findAllActives(): Promise<Collaborator[]>
  findAllNotDrawnByDraw(drawId: string): Promise<Collaborator[]>
  countNotDrawnsByDrawId(drawId: string): Promise<number>
  edit(id: string, data: UpdateCollaborator): Promise<Collaborator>
  create(data: Prisma.CollaboratorUncheckedCreateInput): Promise<Collaborator>
}
