import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetNotDrawnsByDrawUseCase } from '@/use-cases/factories/make-get-not-drawns-by-draw-use-case'

export async function getNotDrawnsByDraw(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getNotDrawnsByDrawParamsSchema = z.object({
    drawId: z.string().uuid(),
  })

  const { drawId } = getNotDrawnsByDrawParamsSchema.parse(request.params)

  const getNotDrawnsByDrawUseCase = makeGetNotDrawnsByDrawUseCase()

  const { collaboratorsCount } = await getNotDrawnsByDrawUseCase.execute({
    drawId,
  })

  return reply.status(201).send({ collaboratorsCount })
}
