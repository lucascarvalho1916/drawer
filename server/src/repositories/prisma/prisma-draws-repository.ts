import { Prisma, Draw } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { DrawsRepository, UpdateDraw } from '../draws-repository'

export class PrismaDrawsRepository implements DrawsRepository {
  async findById(id: string): Promise<Draw | null> {
    const draw = await prisma.draw.findUnique({
      where: {
        id,
      },
    })

    return draw
  }

  async fetchPublished(): Promise<Draw[]> {
    const draws = await prisma.draw.findMany({
      where: {
        publicize: true,
      },
    })

    return draws
  }

  async toPublicize(id: string, newParamPublicize: boolean): Promise<Draw> {
    const draw = await prisma.draw.update({
      where: {
        id,
      },
      data: {
        publicize: newParamPublicize,
      },
    })

    return draw
  }

  async findMany(
    page: number | undefined,
    resultsPerPage: number | undefined,
    query: string,
    sortColumn: string,
    sortDirection: string,
  ): Promise<{
    draws: Draw[]
    total: number
    perPage: number
    currentPage: number
  }> {
    let orderBy: Prisma.DrawOrderByWithRelationInput = {}

    if (sortColumn === 'description') {
      orderBy = {
        description: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    } else if (sortColumn === 'start_at') {
      orderBy = {
        start_at: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    } else if (sortColumn === 'end_at') {
      orderBy = {
        end_at: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    }

    const total = await prisma.draw.count({
      where: {
        OR: [
          {
            description: {
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

    const draws = await prisma.draw.findMany({
      orderBy,
      where: {
        OR: [
          {
            description: {
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
      draws,
      total,
      perPage: resultsPerPage,
      currentPage: page,
    }
  }

  async findManyActive(date: Date): Promise<Draw[]> {
    const draws = await prisma.draw.findMany({
      where: {
        OR: [
          {
            end_at: null,
          },
          {
            end_at: {
              gt: date,
            },
          },
        ],
      },
    })

    return draws
  }

  async edit(id: string, data: UpdateDraw): Promise<Draw> {
    const draw = await prisma.draw.update({
      where: {
        id,
      },
      data: {
        description: data.description,
        end_at: data.endAt,
      },
    })

    return draw
  }

  async create(data: Prisma.DrawUncheckedCreateInput): Promise<Draw> {
    const draw = await prisma.draw.create({
      data,
    })

    return draw
  }
}
