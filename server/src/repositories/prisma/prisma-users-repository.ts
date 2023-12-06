import { prisma } from '../../lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UpdateUser, UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findMany(
    page: number | undefined,
    resultsPerPage: number | undefined,
    query: string,
    sortColumn: string,
    sortDirection: string,
  ): Promise<{
    users: User[]
    total: number
    perPage: number
    currentPage: number
  }> {
    let orderBy: Prisma.UserOrderByWithRelationInput = {}

    if (sortColumn === 'name') {
      orderBy = {
        name: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    } else if (sortColumn === 'login') {
      orderBy = {
        login: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    } else if (sortColumn === 'email') {
      orderBy = {
        email: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    } else if (sortColumn === 'start_at') {
      orderBy = {
        email: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    } else if (sortColumn === 'start_at') {
      orderBy = {
        is_admin: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    }

    const total = await prisma.user.count({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            login: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
          // {
          //   drawn_at: {
          //     contains: query, // Utiliza contains para buscar por parte do texto
          //     mode: 'insensitive',
          //   },
          // },
        ],
      },
    })

    resultsPerPage =
      resultsPerPage === undefined || resultsPerPage === 0
        ? total
        : resultsPerPage
    page = page === undefined || page === 0 ? 1 : page

    const users = await prisma.user.findMany({
      orderBy,
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            login: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
          // {
          //   drawn_at: {
          //     contains: query, // Utiliza contains para buscar por parte do texto
          //     mode: 'insensitive',
          //   },
          // },
        ],
      },
      take: resultsPerPage,
      skip: (page - 1) * resultsPerPage,
    })

    return {
      users,
      total,
      perPage: resultsPerPage,
      currentPage: page,
    }
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async findByLogin(login: string) {
    const user = await prisma.user.findUnique({
      where: {
        login,
      },
    })

    return user
  }

  async changeToAdmin(id: string, newParamIsAdmin: boolean): Promise<User> {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        is_admin: newParamIsAdmin,
      },
    })

    return user
  }

  async changePassword(id: string, password_hash: string): Promise<User> {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        password_hash,
      },
    })

    return user
  }

  async edit(id: string, data: UpdateUser): Promise<User> {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        login: data.login,
        email: data.email,
        end_at: data.endAt,
      },
    })

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
