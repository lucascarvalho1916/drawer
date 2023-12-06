import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeEventToDrawUseCase } from '@/use-cases/factories/make-event-to-draw-use-case'
import { ThereAreNoCollaboratorsToBeDrawnError } from '@/use-cases/errors/there-are-no-collaborators-to-be-drawn-error'
import { DrawNotActiveError } from '@/use-cases/errors/draw-not-active-error'

export async function eventToDraw(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const eventToDrawParamsSchema = z.object({
    drawId: z.string().uuid(),
  })
  const eventToDrawBodySchema = z.object({
    value: z.coerce.number(),
    quantity: z.coerce.number(),
    releaseDate: z.string(),
  })

  const { drawId } = eventToDrawParamsSchema.parse(request.params)
  const { value, quantity, releaseDate } = eventToDrawBodySchema.parse(
    request.body,
  )

  try {
    const eventToDrawUseCase = makeEventToDrawUseCase()

    const events = await eventToDrawUseCase.execute({
      value,
      quantity,
      releaseDate,
      drawId,
      userId: request.user.sub,
    })

    return reply.status(201).send({ events })
  } catch (err) {
    if (err instanceof ThereAreNoCollaboratorsToBeDrawnError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof DrawNotActiveError) {
      return reply.status(409).send({ message: err.message })
    }
  }
}
