import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchPublishedNotDrawnsByDrawUseCase } from '@/use-cases/factories/make-fetch-published-not-drawns-by-draw-use-case'

export async function fetchPublishedNotDrawnsByDraw(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchPublishedNotDrawnsByDrawQuerySchema = z.object({
    query: z.string().default(''),
  })

  const fetchPublishedNotDrawnsByDrawParamsSchema = z.object({
    drawId: z.string().uuid(),
  })

  const { query } = fetchPublishedNotDrawnsByDrawQuerySchema.parse(
    request.query,
  )
  const { drawId } = fetchPublishedNotDrawnsByDrawParamsSchema.parse(
    request.params,
  )

  const fetchPublishedNotDrawnsByDrawUseCase =
    makeFetchPublishedNotDrawnsByDrawUseCase()

  const collaborators = await fetchPublishedNotDrawnsByDrawUseCase.execute({
    drawId,
    query,
  })

  return reply.status(201).send({ collaborators })
}
