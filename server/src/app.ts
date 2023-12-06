import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import { ZodError } from 'zod'
import fastifyJwt from '@fastify/jwt'
import { env } from './env'
import { drawRoutes } from './http/controllers/draws/routes'
import { collaboratorRoutes } from './http/controllers/collaborators/routes'
import { eventsRoutes } from './http/controllers/events/routes'
import { userRoutes } from './http/controllers/users/routes'

export const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(userRoutes)
app.register(drawRoutes)
app.register(collaboratorRoutes)
app.register(eventsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO Here we should log to an external toal like Datalog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
