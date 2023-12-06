import { CollaboratorsRepository } from '@/repositories/collaborators-repository'

interface GetNotDrawnsByDrawUseCaseRequest {
  drawId: string
}

interface GetNotDrawnsByDrawUseCaseResponse {
  collaboratorsCount: number
}

export class GetNotDrawnsByDrawUseCase {
  constructor(private collaboratorsRepository: CollaboratorsRepository) {}

  async execute({
    drawId,
  }: GetNotDrawnsByDrawUseCaseRequest): Promise<GetNotDrawnsByDrawUseCaseResponse> {
    const collaboratorsCount =
      await this.collaboratorsRepository.countNotDrawnsByDrawId(drawId)

    return {
      collaboratorsCount,
    }
  }
}
