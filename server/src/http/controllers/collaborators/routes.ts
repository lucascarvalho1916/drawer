import { FastifyInstance } from 'fastify'
import { register } from './register'
import { fetchNotDrawnsByDraw } from './fetch-not-drawns-by-draw'
import { getNotDrawnsByDraw } from './get-not-drawns-by-draw'
import { fetchCollaborators } from './fetch-collaborators'
import { edit } from './edit'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { fetchPublishedNotDrawnsByDraw } from './fetch-published-not-drawns-by-draw'

export async function collaboratorRoutes(app: FastifyInstance) {
  app.get(
    '/collaborators/:drawId/publishedNotDrawns',
    fetchPublishedNotDrawnsByDraw,
  )

  app.post(
    '/collaborators',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    register,
  )
  app.patch(
    '/collaborators/:collaboratorId/edit',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    edit,
  )
  app.get(
    '/collaborators',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    fetchCollaborators,
  )
  app.get(
    '/collaborators/:drawId/notDrawns',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    fetchNotDrawnsByDraw,
  )
  app.get(
    '/collaborators/:drawId/countNotDrawns',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    getNotDrawnsByDraw,
  )
}
