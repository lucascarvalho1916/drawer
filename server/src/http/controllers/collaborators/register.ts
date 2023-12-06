import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeRegisterCollaboratorUseCase } from '@/use-cases/factories/make-register-collaborator-use-case'
import { CPFAlreadyExistsError } from '@/use-cases/errors/cpf-already-exists-error'
import { TheUseOfCharactersInTheCollaboratorNameError } from '@/use-cases/errors/the-use-of-characters-in-the-collaborator-name'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerCollaboratorBodySchema = z.object({
    name: z.string(),
    cpf: z.string(),
    startAt: z.string(),
  })

  const { name, cpf, startAt } = registerCollaboratorBodySchema.parse(
    request.body,
  )

  try {
    const registerCollaboratorUseCase = makeRegisterCollaboratorUseCase()

    await registerCollaboratorUseCase.execute({
      name,
      cpf,
      startAt: new Date(startAt),
      userId: request.user.sub,
    })
  } catch (err) {
    if (err instanceof TheUseOfCharactersInTheCollaboratorNameError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof CPFAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
  }

  return reply.status(201).send()
}
