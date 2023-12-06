import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchDrawnsByDrawUseCase } from '@/use-cases/factories/make-fetch-drawns-by-draw-use-case'

export async function fetchDrawnsByDraw(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchDrawnsByDrawQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })
  const fetchDrawnsByDrawParamsSchema = z.object({
    drawId: z.string().uuid(),
  })

  const { page } = fetchDrawnsByDrawQuerySchema.parse(request.query)
  const { drawId } = fetchDrawnsByDrawParamsSchema.parse(request.params)

  const fetchDrawnsByDrawUseCase = makeFetchDrawnsByDrawUseCase()

  const { events } = await fetchDrawnsByDrawUseCase.execute({
    page,
    drawId,
  })

  return reply.status(201).send({ events })
}
