import { FastifyReply, FastifyRequest } from 'fastify'
import { makeFetchCollaboratorsUseCase } from '@/use-cases/factories/make-fetch-collaborators-use-case'
import { z } from 'zod'

export async function fetchCollaborators(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchCollaboratorsQuerySchema = z.object({
    page: z.coerce.number().optional(),
    resultsPerPage: z.coerce.number().optional(),
    query: z.string().default(''),
    sortColumn: z.string().default('name'),
    sortDirection: z.string().default('asc'),
  })

  const { page, resultsPerPage, query, sortColumn, sortDirection } =
    fetchCollaboratorsQuerySchema.parse(request.query)

  const fetchCollaboratorsUseCase = makeFetchCollaboratorsUseCase()

  const collaborators = await fetchCollaboratorsUseCase.execute({
    page,
    resultsPerPage,
    query,
    sortColumn,
    sortDirection,
  })

  return reply.status(201).send({ collaborators })
}
