import { FastifyInstance } from 'fastify'
import { eventToDraw } from './to-draw'
import { fetchDrawnsByDraw } from './fetch-drawns-by-draw'
import { getDrawnsByDraw } from './get-drawns-by-draw'
import { fetchEvents } from './fetch-events'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { fetchPublishedEvents } from './fetch-published-events'

export async function eventsRoutes(app: FastifyInstance) {
  app.get('/published-events', fetchPublishedEvents)

  app.get(
    '/events',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    fetchEvents,
  )

  app.post(
    '/events/:drawId/to-draw',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    eventToDraw,
  )
  app.get(
    '/events/:drawId/drawns',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    fetchDrawnsByDraw,
  )
  app.get(
    '/events/:drawId/countDrawns',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    getDrawnsByDraw,
  )
}
