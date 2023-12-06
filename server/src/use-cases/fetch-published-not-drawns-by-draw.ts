import { CollaboratorsRepository } from '@/repositories/collaborators-repository'
import { Collaborator } from '@prisma/client'

interface FetchPublishedNotDrawnsByDrawUseCaseRequest {
  drawId: string
  query: string
}

interface FetchPublishedNotDrawnsByDrawUseCaseResponse {
  collaborators: Collaborator[]
  total: number
}

export class FetchPublishedNotDrawnsByDrawUseCase {
  constructor(private collaboratorsRepository: CollaboratorsRepository) {}

  async execute({
    drawId,
    query,
  }: FetchPublishedNotDrawnsByDrawUseCaseRequest): Promise<FetchPublishedNotDrawnsByDrawUseCaseResponse> {
    const { collaborators, total } =
      await this.collaboratorsRepository.findPublishedNotDrawnByDraw(
        drawId,
        query,
      )

    return {
      collaborators,
      total,
    }
  }
}
