import { FastifyReply, FastifyRequest } from 'fastify'
import { makeFetchPublishedDrawsUseCase } from '@/use-cases/factories/make-fetch-published-draws-use-case'

export async function fetchPublishedDraws(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchPublishedDrawsUseCase = makeFetchPublishedDrawsUseCase()

  const draws = await fetchPublishedDrawsUseCase.execute()

  return reply.status(201).send({ draws })
}
