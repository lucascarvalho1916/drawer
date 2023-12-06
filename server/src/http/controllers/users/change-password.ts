import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeChangePasswordUserUseCase } from '@/use-cases/factories/make-change-password-user-use-case'
import { ThereWereNoChangesError } from '@/use-cases/errors/there-were-no-changes-error'

export async function changePassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const changePasswordParamsSchema = z.object({
    userId: z.string().uuid(),
  })

  const changePasswordBodySchema = z.object({
    password: z.string().min(6),
  })

  const { userId } = changePasswordParamsSchema.parse(request.params)
  const { password } = changePasswordBodySchema.parse(request.body)

  try {
    const changePasswordUseCase = makeChangePasswordUserUseCase()

    await changePasswordUseCase.execute({
      userId,
      password,
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof ThereWereNoChangesError) {
      return reply.status(409).send({ message: err.message })
    }
  }

  return reply.status(200).send()
}
