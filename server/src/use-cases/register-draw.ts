import { DrawsRepository } from '@/repositories/draws-repository'
import { Draw } from '@prisma/client'

interface RegisterDrawUseCaseRequest {
  description: string
  startAt: Date
  userId: string
}

interface RegisterDrawUseCaseResponse {
  draw: Draw
}

export class RegisterDrawUseCase {
  constructor(private drawsRepository: DrawsRepository) {}

  async execute({
    description,
    startAt,
    userId,
  }: RegisterDrawUseCaseRequest): Promise<RegisterDrawUseCaseResponse> {
    const draw = await this.drawsRepository.create({
      description,
      start_at: startAt,
      user_id: userId,
    })

    return {
      draw,
    }
  }
}
