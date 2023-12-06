import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeChangeUserToAdminUseCase } from '@/use-cases/factories/make-change-user-to-admin-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function changeToAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const changeToAdminParamsSchema = z.object({
    userId: z.string().uuid(),
  })

  const { userId } = changeToAdminParamsSchema.parse(request.params)

  try {
    const changeToAdminUseCase = makeChangeUserToAdminUseCase()

    await changeToAdminUseCase.execute({
      userId,
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }
  }

  return reply.status(200).send()
}
