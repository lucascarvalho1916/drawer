import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchEventsUseCase } from '@/use-cases/factories/make-fetch-events-use-case'

export async function fetchEvents(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchEventsQuerySchema = z.object({
    page: z.coerce.number().optional(),
    resultsPerPage: z.coerce.number().optional(),
    query: z.string().default(''),
    sortColumn: z.string().default('name'),
    sortDirection: z.string().default('asc'),
  })

  const { page, resultsPerPage, query, sortColumn, sortDirection } =
    fetchEventsQuerySchema.parse(request.query)

  const fetchEventsUseCase = makeFetchEventsUseCase()

  const events = await fetchEventsUseCase.execute({
    page,
    resultsPerPage,
    query,
    sortColumn,
    sortDirection,
  })

  return reply.status(201).send({ events })
}
