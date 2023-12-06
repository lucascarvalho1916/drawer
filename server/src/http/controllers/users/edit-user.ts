import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { TheUseOfCharactersInTheCollaboratorNameError } from '@/use-cases/errors/the-use-of-characters-in-the-collaborator-name'
import { ThereWereNoChangesError } from '@/use-cases/errors/there-were-no-changes-error'
import { OneOfTheFieldsIsRequiredError } from '@/use-cases/errors/one-of-the-fields-is-required-error'
import { makeEditUserUseCase } from '@/use-cases/factories/make-edit-user-use-case'
import { LoginAlreadyExistsError } from '@/use-cases/errors/login-already-exists-error'
import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function editUser(request: FastifyRequest, reply: FastifyReply) {
  const editUserBodySchema = z.object({
    name: z.string().optional(),
    login: z.string().optional(),
    email: z.string().optional(),
    endAt: z.string().optional().nullable(),
  })

  const editUserParamsSchema = z.object({
    userId: z.string().uuid(),
  })

  const { name, login, email, endAt } = editUserBodySchema.parse(request.body)

  const { userId } = editUserParamsSchema.parse(request.params)

  const updatedEndAt =
    endAt !== null && endAt !== undefined && endAt !== ''
      ? new Date(endAt)
      : null

  try {
    const editUserUseCase = makeEditUserUseCase()

    await editUserUseCase.execute({
      userId,
      name,
      login,
      email,
      endAt: updatedEndAt,
    })
  } catch (err) {
    if (err instanceof OneOfTheFieldsIsRequiredError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof ThereWereNoChangesError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof TheUseOfCharactersInTheCollaboratorNameError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof LoginAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
  }

  return reply.status(200).send()
}
