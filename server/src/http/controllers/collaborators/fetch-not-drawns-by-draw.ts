import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchNotDrawnsByDrawUseCase } from '@/use-cases/factories/make-fetch-not-drawns-by-draw-use-case'

export async function fetchNotDrawnsByDraw(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchNotDrawnsByDrawQuerySchema = z.object({
    page: z.coerce.number().optional(),
    resultsPerPage: z.coerce.number().optional(),
    query: z.string().default(''),
    sortColumn: z.string().default('name'),
    sortDirection: z.string().default('asc'),
  })

  const fetchNotDrawnsByDrawParamsSchema = z.object({
    drawId: z.string().uuid(),
  })

  const { page, resultsPerPage, query, sortColumn, sortDirection } =
    fetchNotDrawnsByDrawQuerySchema.parse(request.query)
  const { drawId } = fetchNotDrawnsByDrawParamsSchema.parse(request.params)

  const fetchNotDrawnsByDrawUseCase = makeFetchNotDrawnsByDrawUseCase()

  const collaborators = await fetchNotDrawnsByDrawUseCase.execute({
    page,
    resultsPerPage,
    query,
    sortColumn,
    sortDirection,
    drawId,
  })

  return reply.status(201).send({ collaborators })
}
