import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeEditCollaboratorUseCase } from '@/use-cases/factories/make-edit-collaborator-use-case'
import { CPFAlreadyExistsError } from '@/use-cases/errors/cpf-already-exists-error'
import { TheUseOfCharactersInTheCollaboratorNameError } from '@/use-cases/errors/the-use-of-characters-in-the-collaborator-name'
import { ThereWereNoChangesError } from '@/use-cases/errors/there-were-no-changes-error'
import { OneOfTheFieldsIsRequiredError } from '@/use-cases/errors/one-of-the-fields-is-required-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function edit(request: FastifyRequest, reply: FastifyReply) {
  const editCollaboratorBodySchema = z.object({
    name: z.string().optional(),
    cpf: z.string().optional(),
    endAt: z.string().optional().nullable(),
  })

  const editCollaboratorParamsSchema = z.object({
    collaboratorId: z.string().uuid(),
  })

  const { name, cpf, endAt } = editCollaboratorBodySchema.parse(request.body)

  const { collaboratorId } = editCollaboratorParamsSchema.parse(request.params)

  const updatedEndAt =
    endAt !== null && endAt !== undefined && endAt !== ''
      ? new Date(endAt)
      : null

  try {
    const editCollaboratorUseCase = makeEditCollaboratorUseCase()

    await editCollaboratorUseCase.execute({
      collaboratorId,
      name,
      cpf,
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
    if (err instanceof CPFAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
  }

  return reply.status(200).send()
}
