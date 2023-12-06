import { FastifyInstance } from 'fastify'
import { register } from './register'
import { fetchDraws } from './fetch-draws'
import { fetchActiveDraws } from './fetch-active-draws'
import { toPublicize } from './to-publicize'
import { fetchPublishedDraws } from './fetch-published-draws'
import { edit } from './edit'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function drawRoutes(app: FastifyInstance) {
  app.get('/draws/published-draws', fetchPublishedDraws)

  app.post('/draws', { onRequest: [verifyJWT, verifyUserRole(true)] }, register)
  app.patch(
    '/draws/:drawId/edit',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    edit,
  )
  app.get(
    '/draws',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    fetchDraws,
  )
  app.get(
    '/draws/:date/active',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    fetchActiveDraws,
  )
  app.patch(
    '/draws/:drawId/to-publicize',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    toPublicize,
  )
}
