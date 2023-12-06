import { CollaboratorsRepository } from '@/repositories/collaborators-repository'
import { EventsRepository } from '@/repositories/events-repository'
import { Event } from '@prisma/client'
import { ThereAreNoCollaboratorsToBeDrawnError } from './errors/there-are-no-collaborators-to-be-drawn-error'
import { DrawsRepository } from '@/repositories/draws-repository'
import { DrawNotActiveError } from './errors/draw-not-active-error'

interface EventToDrawUseCaseRequest {
  value: number
  quantity: number
  releaseDate: string
  drawId: string
  userId: string
}

interface EventToDrawUseCaseResponse {
  events: Event[]
}

export class EventToDrawUseCase {
  constructor(
    private eventsRepository: EventsRepository,
    private collaboratorsRepository: CollaboratorsRepository,
    private drawsRepository: DrawsRepository,
  ) {}

  async execute({
    value,
    quantity,
    releaseDate,
    drawId,
    userId,
  }: EventToDrawUseCaseRequest): Promise<EventToDrawUseCaseResponse> {
    const draw = await this.drawsRepository.findById(drawId)

    const currentDateTime = new Date()
    const endDateTime = draw?.end_at ? new Date(draw.end_at) : null

    if (endDateTime && endDateTime < currentDateTime) {
      throw new DrawNotActiveError()
    }

    const countAllCollaboratorsNotDrawn =
      await this.collaboratorsRepository.countNotDrawnsByDrawId(drawId)

    if (countAllCollaboratorsNotDrawn < quantity) {
      throw new ThereAreNoCollaboratorsToBeDrawnError()
    }

    const events = []

    for (let i = 0; i < quantity; i++) {
      const allCollaboratorsNotDrawn =
        await this.collaboratorsRepository.findAllNotDrawnByDraw(drawId)

      const collaboratorDrawn =
        allCollaboratorsNotDrawn[
          Math.floor(Math.random() * allCollaboratorsNotDrawn.length)
        ]

      const event = await this.eventsRepository.create({
        value,
        collaborator_id: collaboratorDrawn.id,
        release_date: new Date(releaseDate),
        draw_id: drawId,
        user_id: userId,
      })

      events.push(event)
    }

    return {
      events,
    }
  }
}
