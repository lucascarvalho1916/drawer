import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetDrawnsByDrawUseCase } from '@/use-cases/factories/make-get-drawns-by-draw-use-case'

export async function getDrawnsByDraw(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getDrawnsByDrawParamsSchema = z.object({
    drawId: z.string().uuid(),
  })

  const { drawId } = getDrawnsByDrawParamsSchema.parse(request.params)

  const getDrawnsByDrawUseCase = makeGetDrawnsByDrawUseCase()

  const { eventsCount } = await getDrawnsByDrawUseCase.execute({
    drawId,
  })

  return reply.status(201).send({ eventsCount })
}
