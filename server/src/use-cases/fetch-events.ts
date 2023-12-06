import { EventsRepository } from '@/repositories/events-repository'
import { Collaborator, Draw, Event } from '@prisma/client'

interface FetchEventsUseCaseRequest {
  page: number | undefined
  resultsPerPage: number | undefined
  query: string
  sortColumn: string
  sortDirection: string
}

interface FetchEventsUseCaseResponse {
  events: (Event & { collaborator: Collaborator; draw: Draw })[]
  total: number
  perPage: number
  currentPage: number
}

export class FetchEventsUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({
    page,
    resultsPerPage,
    query,
    sortColumn,
    sortDirection,
  }: FetchEventsUseCaseRequest): Promise<FetchEventsUseCaseResponse> {
    const { events, total, perPage, currentPage } =
      await this.eventsRepository.findMany(
        page,
        resultsPerPage,
        query,
        sortColumn,
        sortDirection,
      )

    return {
      events,
      total,
      perPage,
      currentPage,
    }
  }
}
