import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchPublishedEventsUseCase } from '@/use-cases/factories/make-fetch-published-events-use-case'

export async function fetchPublishedEvents(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchPublishedEventsQuerySchema = z.object({
    query: z.string().default(''),
  })

  const { query } = fetchPublishedEventsQuerySchema.parse(request.query)

  const fetchPublishedEventsUseCase = makeFetchPublishedEventsUseCase()

  const events = await fetchPublishedEventsUseCase.execute({
    query,
  })

  return reply.status(201).send({ events })
}
