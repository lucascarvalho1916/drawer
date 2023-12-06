import { EventsRepository } from '@/repositories/events-repository'

interface GetDrawnsByDrawUseCaseRequest {
  drawId: string
}

interface GetDrawnsByDrawUseCaseResponse {
  eventsCount: number
}

export class GetDrawnsByDrawUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({
    drawId,
  }: GetDrawnsByDrawUseCaseRequest): Promise<GetDrawnsByDrawUseCaseResponse> {
    const eventsCount = await this.eventsRepository.countByDrawId(drawId)

    return {
      eventsCount,
    }
  }
}
