import { Collaborator, Draw, Event, Prisma } from '@prisma/client'

export interface EventsRepository {
  findMany(
    page: number | undefined,
    resultsPerPage: number | undefined,
    search: string,
    sortColumn: string,
    sortDirection: string,
  ): Promise<{
    events: (Event & { collaborator: Collaborator; draw: Draw })[]
    total: number
    perPage: number
    currentPage: number
  }>
  fetchPublished(search: string): Promise<{
    events: (Event & { collaborator: Collaborator; draw: Draw })[]
    total: number
  }>
  findManyByDrawId(drawId: string, page: number): Promise<Event[]>
  findAllByDrawId(drawId: string): Promise<Event[]>
  countByDrawId(drawId: string): Promise<number>
  create(data: Prisma.EventUncheckedCreateInput): Promise<Event>
}
