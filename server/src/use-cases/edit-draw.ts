import { ThereWereNoChangesError } from './errors/there-were-no-changes-error'
import { OneOfTheFieldsIsRequiredError } from './errors/one-of-the-fields-is-required-error'
import { DrawsRepository } from '@/repositories/draws-repository'
import { Draw } from '@prisma/client'
import { formatDescription } from './utils/formatDescription'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditDrawUseCaseRequest {
  drawId: string
  description: string | null | undefined
  endAt: Date | null | undefined
}

interface EditDrawUseCaseResponse {
  draw: Draw
}

export class EditDrawUseCase {
  constructor(private drawsRepository: DrawsRepository) {}

  async execute({
    drawId,
    description,
    endAt,
  }: EditDrawUseCaseRequest): Promise<EditDrawUseCaseResponse> {
    if (description === '' && endAt === null) {
      throw new OneOfTheFieldsIsRequiredError()
    }

    const drawExists = await this.drawsRepository.findById(drawId)

    if (!drawExists) {
      throw new ResourceNotFoundError()
    }

    if (drawExists?.description === description && endAt === null) {
      throw new ThereWereNoChangesError()
    }

    if (
      description === '' &&
      drawExists?.end_at?.toString() === endAt?.toString()
    ) {
      throw new ThereWereNoChangesError()
    }

    if (
      drawExists?.description === description &&
      drawExists?.end_at?.toString() === endAt?.toString()
    ) {
      throw new ThereWereNoChangesError()
    }

    const updatedData: { description?: string; endAt?: Date } = {}

    if (
      description !== undefined &&
      description !== null &&
      description !== ''
    ) {
      const formattedDescription = formatDescription(description)

      updatedData.description = formattedDescription
    }

    if (endAt !== undefined && endAt !== null) {
      updatedData.endAt = endAt
    }

    const draw = await this.drawsRepository.edit(drawId, updatedData)

    return {
      draw,
    }
  }
}
