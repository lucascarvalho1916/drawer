import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ThereWereNoChangesError } from '@/use-cases/errors/there-were-no-changes-error'
import { OneOfTheFieldsIsRequiredError } from '@/use-cases/errors/one-of-the-fields-is-required-error'
import { makeEditDrawUseCase } from '@/use-cases/factories/make-edit-draw-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function edit(request: FastifyRequest, reply: FastifyReply) {
  const editDrawBodySchema = z.object({
    description: z.string().optional(),
    endAt: z.string().optional().nullable(),
  })

  const editDrawParamsSchema = z.object({
    drawId: z.string().uuid(),
  })

  const { description, endAt } = editDrawBodySchema.parse(request.body)

  const { drawId } = editDrawParamsSchema.parse(request.params)

  const updatedEndAt =
    endAt !== null && endAt !== undefined && endAt !== ''
      ? new Date(endAt)
      : null

  try {
    const editDrawUseCase = makeEditDrawUseCase()

    await editDrawUseCase.execute({
      drawId,
      description,
      endAt: updatedEndAt,
    })
  } catch (err) {
    if (err instanceof OneOfTheFieldsIsRequiredError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof ThereWereNoChangesError) {
      return reply.status(409).send({ message: err.message })
    }
  }

  return reply.status(200).send()
}
