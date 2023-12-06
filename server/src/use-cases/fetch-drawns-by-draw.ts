import { EventsRepository } from '@/repositories/events-repository'
import { Event } from '@prisma/client'

interface FetchDrawnsByDrawUseCaseRequest {
  drawId: string
  page: number
}

interface FetchDrawnsByDrawUseCaseResponse {
  events: Event[]
}

export class FetchDrawnsByDrawUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({
    drawId,
    page,
  }: FetchDrawnsByDrawUseCaseRequest): Promise<FetchDrawnsByDrawUseCaseResponse> {
    const events = await this.eventsRepository.findManyByDrawId(drawId, page)

    return {
      events,
    }
  }
}
