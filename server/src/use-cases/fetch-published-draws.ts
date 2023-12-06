import { DrawsRepository } from '@/repositories/draws-repository'
import { Draw } from '@prisma/client'

interface FetchPublishedDrawsUseCaseResponse {
  draws: Draw[]
}

export class FetchPublishedDrawsUseCase {
  constructor(private drawsRepository: DrawsRepository) {}

  async execute(): Promise<FetchPublishedDrawsUseCaseResponse> {
    const draws = await this.drawsRepository.fetchPublished()

    return {
      draws,
    }
  }
}
