import { DrawsRepository } from '@/repositories/draws-repository'
import { Draw } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { DisclosureOfTwoDrawsError } from './errors/disclosure-of-two-draws-error'
import { DrawNotActiveError } from './errors/draw-not-active-error'

interface ToPublicizeDrawUseCaseRequest {
  drawId: string
}

interface ToPublicizeDrawUseCaseResponse {
  draw: Draw
}

export class ToPublicizeDrawUseCase {
  constructor(private drawsRepository: DrawsRepository) {}

  async execute({
    drawId,
  }: ToPublicizeDrawUseCaseRequest): Promise<ToPublicizeDrawUseCaseResponse> {
    const drawExists = await this.drawsRepository.findById(drawId)

    if (!drawExists) {
      throw new ResourceNotFoundError()
    }

    const currentDateTime = new Date()
    const endDateTime = drawExists?.end_at ? new Date(drawExists.end_at) : null

    if (endDateTime && endDateTime < currentDateTime) {
      throw new DrawNotActiveError()
    }

    const publishedDraw = await this.drawsRepository.fetchPublished()

    if (
      Object.keys(publishedDraw).length !== 0 &&
      publishedDraw[0].id !== drawId
    ) {
      throw new DisclosureOfTwoDrawsError()
    }

    const newParamPublicize = drawExists.publicize !== true

    const draw = await this.drawsRepository.toPublicize(
      drawId,
      newParamPublicize,
    )

    return {
      draw,
    }
  }
}
