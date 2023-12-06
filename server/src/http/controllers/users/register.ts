import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { EmailAlreadyExistsError } from '../../../use-cases/errors/email-already-exists-error'
import { makeRegisterUserUseCase } from '@/use-cases/factories/make-register-user-use-case'
import { LoginAlreadyExistsError } from '@/use-cases/errors/login-already-exists-error'

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    login: z.string(),
    password: z.string().min(6),
    startAt: z.string(),
  })

  const { name, email, login, password, startAt } =
    registerUserBodySchema.parse(request.body)

  try {
    const registerUserUseCase = makeRegisterUserUseCase()

    await registerUserUseCase.execute({
      name,
      email,
      login,
      password,
      startAt: new Date(startAt),
    })
  } catch (err) {
    if (err instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof LoginAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
