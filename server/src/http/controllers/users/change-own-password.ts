import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeChangeOwnPasswordUserUseCase } from '@/use-cases/factories/make-change-password-user-use2-case'
import { CurrentPasswordDoesNotMatchError } from '@/use-cases/errors/current-password-does-not-match-error'

export async function changeOwnPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const changeOwnPasswordBodySchema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
  })

  const { currentPassword, newPassword } = changeOwnPasswordBodySchema.parse(
    request.body,
  )

  try {
    const changeOwnPasswordUseCase = makeChangeOwnPasswordUserUseCase()

    await changeOwnPasswordUseCase.execute({
      userId: request.user.sub,
      currentPassword,
      newPassword,
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof CurrentPasswordDoesNotMatchError) {
      return reply.status(409).send({ message: err.message })
    }
  }

  return reply.status(200).send()
}
