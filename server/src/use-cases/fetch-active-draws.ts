import { DrawsRepository } from '@/repositories/draws-repository'
import { Draw } from '@prisma/client'

interface FetchActiveDrawsUseCaseRequest {
  date: Date
}

interface FetchActiveDrawsUseCaseResponse {
  draws: Draw[]
}

export class FetchActiveDrawsUseCase {
  constructor(private drawsRepository: DrawsRepository) {}

  async execute({
    date,
  }: FetchActiveDrawsUseCaseRequest): Promise<FetchActiveDrawsUseCaseResponse> {
    const draws = await this.drawsRepository.findManyActive(date)

    return {
      draws,
    }
  }
}
