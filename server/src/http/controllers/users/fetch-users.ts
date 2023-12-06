import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchUsersUseCase } from '@/use-cases/factories/make-fetch-users-use-case'

export async function fetchUsers(request: FastifyRequest, reply: FastifyReply) {
  const fetchUsersQuerySchema = z.object({
    page: z.coerce.number().optional(),
    resultsPerPage: z.coerce.number().optional(),
    query: z.string().default(''),
    sortColumn: z.string().default('name'),
    sortDirection: z.string().default('asc'),
  })

  const { page, resultsPerPage, query, sortColumn, sortDirection } =
    fetchUsersQuerySchema.parse(request.query)

  const fetchUsersUseCase = makeFetchUsersUseCase()

  const users = await fetchUsersUseCase.execute({
    page,
    resultsPerPage,
    query,
    sortColumn,
    sortDirection,
  })

  return reply.status(201).send({ users })
}
