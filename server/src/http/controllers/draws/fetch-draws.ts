import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchDrawsUseCase } from '@/use-cases/factories/make-fetch-draws-use-case'

export async function fetchDraws(request: FastifyRequest, reply: FastifyReply) {
  const fetchDrawsQuerySchema = z.object({
    page: z.coerce.number().optional(),
    resultsPerPage: z.coerce.number().optional(),
    query: z.string().default(''),
    sortColumn: z.string().default('name'),
    sortDirection: z.string().default('asc'),
  })

  const { page, resultsPerPage, query, sortColumn, sortDirection } =
    fetchDrawsQuerySchema.parse(request.query)

  const fetchDrawsUseCase = makeFetchDrawsUseCase()

  const draws = await fetchDrawsUseCase.execute({
    page,
    resultsPerPage,
    query,
    sortColumn,
    sortDirection,
  })

  return reply.status(201).send({ draws })
}
