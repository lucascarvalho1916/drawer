import { EventsRepository } from '@/repositories/events-repository'
import { Collaborator, Draw, Event } from '@prisma/client'

interface FetchPublishedEventsUseCaseRequest {
  query: string
}

interface FetchPublishedEventsUseCaseResponse {
  events: (Event & { collaborator: Collaborator; draw: Draw })[]
  total: number
}

export class FetchPublishedEventsUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({
    query,
  }: FetchPublishedEventsUseCaseRequest): Promise<FetchPublishedEventsUseCaseResponse> {
    const { events, total } = await this.eventsRepository.fetchPublished(query)

    events.sort((a, b) => {
      const monthYearA = {
        month: a.drawn_at.getMonth(),
        year: a.drawn_at.getFullYear(),
      }
      const monthYearB = {
        month: b.drawn_at.getMonth(),
        year: b.drawn_at.getFullYear(),
      }

      if (monthYearA.year !== monthYearB.year) {
        return monthYearA.year - monthYearB.year
      }
      if (monthYearA.month !== monthYearB.month) {
        return monthYearA.month - monthYearB.month
      }

      if (a.value !== b.value) {
        return b.value - a.value
      }

      return a.collaborator.name.localeCompare(b.collaborator.name)
    })

    return {
      events,
      total,
    }
  }
}
