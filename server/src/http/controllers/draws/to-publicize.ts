import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeToPublicizeDrawUseCase } from '@/use-cases/factories/make-to-publicize-draw-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { DisclosureOfTwoDrawsError } from '@/use-cases/errors/disclosure-of-two-draws-error'
import { DrawNotActiveError } from '@/use-cases/errors/draw-not-active-error'

export async function toPublicize(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const toPublicizeParamsSchema = z.object({
    drawId: z.string().uuid(),
  })

  const { drawId } = toPublicizeParamsSchema.parse(request.params)

  try {
    const toPublicizeDrawUseCase = makeToPublicizeDrawUseCase()

    const draw = await toPublicizeDrawUseCase.execute({
      drawId,
    })

    return reply.status(200).send({ draw })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof DrawNotActiveError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof DisclosureOfTwoDrawsError) {
      return reply.status(409).send({ message: err.message })
    }
  }
}
