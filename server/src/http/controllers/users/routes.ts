import { FastifyInstance } from 'fastify'
import { registerUser } from './register'
import { fetchUsers } from './fetch-users'
import { changeToAdmin } from './change-to-admin'
import { editUser } from './edit-user'
import { authenticate } from './authenticate'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { changePassword } from './change-password'
import { changeOwnPassword } from './change-own-password'

export async function userRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate)

  app.patch(
    '/users/change-own-password',
    { onRequest: [verifyJWT] },
    changeOwnPassword,
  )
  app.post(
    '/users',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    registerUser,
  )
  app.get(
    '/users',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    fetchUsers,
  )
  app.patch(
    '/users/:userId/change-password',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    changePassword,
  )
  app.patch(
    '/users/:userId/to-admin',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    changeToAdmin,
  )
  app.patch(
    '/users/:userId/edit',
    { onRequest: [verifyJWT, verifyUserRole(true)] },
    editUser,
  )
}
