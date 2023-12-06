import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: boolean) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { is_admin } = request.user

    if (is_admin !== roleToVerify) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}
