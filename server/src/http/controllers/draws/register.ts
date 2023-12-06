import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeRegisterDrawUseCase } from '@/use-cases/factories/make-register-draw-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerDrawBodySchema = z.object({
    description: z.string(),
    startAt: z.string(),
  })

  const { description, startAt } = registerDrawBodySchema.parse(request.body)

  const registerDrawUseCase = makeRegisterDrawUseCase()

  await registerDrawUseCase.execute({
    description,
    startAt: new Date(startAt),
    userId: request.user.sub,
  })

  return reply.status(201).send()
}
