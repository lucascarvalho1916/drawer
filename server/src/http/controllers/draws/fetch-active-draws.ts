import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchActiveDrawsUseCase } from '@/use-cases/factories/make-fetch-active-draws-use-case'

export async function fetchActiveDraws(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchActiveDrawsParamsSchema = z.object({
    date: z.string(),
  })

  const { date } = fetchActiveDrawsParamsSchema.parse(request.params)

  const fetchActiveDrawsUseCase = makeFetchActiveDrawsUseCase()

  const draws = await fetchActiveDrawsUseCase.execute({
    date: new Date(date),
  })

  return reply.status(201).send({ draws })
}
