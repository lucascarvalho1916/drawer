import { Prisma, Collaborator } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import {
  CollaboratorsRepository,
  UpdateCollaborator,
} from '../collaborators-repository'

export class PrismaCollaboratorsRepository implements CollaboratorsRepository {
  async findNotDrawnByDraw(
    page: number | undefined,
    resultsPerPage: number | undefined,
    query: string,
    sortColumn: string,
    sortDirection: string,
    drawId: string,
  ): Promise<{
    collaborators: Collaborator[]
    total: number
    perPage: number
    currentPage: number
  }> {
    const allIdDrawnsByDraw = await prisma.event.findMany({
      select: {
        collaborator_id: true,
      },
      where: {
        draw_id: drawId,
      },
    })

    const modifiedResult = allIdDrawnsByDraw.map(
      ({ collaborator_id }) => collaborator_id,
    )

    // const parsedQuery = parseInt(query)
    // const valueFilter = isNaN(parsedQuery) ? null : parsedQuery

    let orderBy: Prisma.CollaboratorOrderByWithRelationInput = {}

    if (sortColumn === 'name') {
      orderBy = {
        name: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    } else if (sortColumn === 'cpf') {
      orderBy = {
        cpf: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    } else if (sortColumn === 'start_at') {
      orderBy = {
        start_at: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    } else if (sortColumn === 'created_at') {
      orderBy = {
        created_at: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    }

    const total = await prisma.collaborator.count({
      where: {
        id: {
          notIn: modifiedResult,
        },
        OR: [
          {
            end_at: null,
          },
          {
            end_at: {
              gt: new Date(),
            },
          },
        ],
        AND: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              cpf: {
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
      },
    })

    resultsPerPage =
      resultsPerPage === undefined || resultsPerPage === 0
        ? total
        : resultsPerPage
    page = page === undefined || page === 0 ? 1 : page

    const collaborators = await prisma.collaborator.findMany({
      orderBy,
      where: {
        id: {
          notIn: modifiedResult,
        },
        OR: [
          {
            end_at: null,
          },
          {
            end_at: {
              gt: new Date(),
            },
          },
        ],
        AND: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              cpf: {
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
      },
      take: resultsPerPage,
      skip: (page - 1) * resultsPerPage,
    })

    return {
      collaborators,
      total,
      perPage: resultsPerPage,
      currentPage: page,
    }
  }

  async findPublishedNotDrawnByDraw(
    drawId: string,
    query: string,
  ): Promise<{
    collaborators: Collaborator[]
    total: number
  }> {
    const allIdPublishedDrawnsByDraw = await prisma.event.findMany({
      select: {
        collaborator_id: true,
      },
      where: {
        draw_id: drawId,
        release_date: {
          lte: new Date(),
        },
      },
    })

    const modifiedResult = allIdPublishedDrawnsByDraw.map(
      ({ collaborator_id }) => collaborator_id,
    )

    const total = await prisma.collaborator.count({
      where: {
        id: {
          notIn: modifiedResult,
        },
        OR: [
          {
            end_at: null,
          },
          {
            end_at: {
              gt: new Date(),
            },
          },
        ],
        AND: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              cpf: {
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
      },
    })

    const collaborators = await prisma.collaborator.findMany({
      orderBy: {
        name: 'asc',
      },
      where: {
        id: {
          notIn: modifiedResult,
        },
        OR: [
          {
            end_at: null,
          },
          {
            end_at: {
              gt: new Date(),
            },
          },
        ],
        AND: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              cpf: {
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
      },
    })

    return {
      collaborators,
      total,
    }
  }

  async findMany(
    page: number | undefined,
    resultsPerPage: number | undefined,
    query: string,
    sortColumn: string,
    sortDirection: string,
  ): Promise<{
    collaborators: Collaborator[]
    total: number
    perPage: number
    currentPage: number
  }> {
    let orderBy: Prisma.CollaboratorOrderByWithRelationInput = {}

    if (sortColumn === 'name') {
      orderBy = {
        name: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    } else if (sortColumn === 'cpf') {
      orderBy = {
        cpf: sortDirection === 'asc' ? 'asc' : 'desc',
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

    const total = await prisma.collaborator.count({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            cpf: {
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

    const collaborators = await prisma.collaborator.findMany({
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
            cpf: {
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
      collaborators,
      total,
      perPage: resultsPerPage,
      currentPage: page,
    }
  }

  async findById(id: string): Promise<Collaborator | null> {
    const collaborator = await prisma.collaborator.findUnique({
      where: {
        id,
      },
    })

    return collaborator
  }

  async findByCPF(cpf: string): Promise<Collaborator | null> {
    const collaborator = await prisma.collaborator.findUnique({
      where: {
        cpf,
      },
    })

    return collaborator
  }

  async findAllActives(): Promise<Collaborator[]> {
    const collaborators = await prisma.collaborator.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return collaborators
  }

  async findAllNotDrawnByDraw(drawId: string): Promise<Collaborator[]> {
    const allIdDrawnsByDraw = await prisma.event.findMany({
      select: {
        collaborator_id: true,
      },
      where: {
        draw_id: drawId,
      },
    })

    const modifiedResult = allIdDrawnsByDraw.map(
      ({ collaborator_id }) => collaborator_id,
    )

    const allCollaboratorsNotDrawn = await prisma.collaborator.findMany({
      orderBy: {
        name: 'asc',
      },
      where: {
        id: {
          notIn: modifiedResult,
        },
        OR: [
          {
            end_at: null,
          },
          {
            end_at: {
              gt: new Date(),
            },
          },
        ],
      },
    })

    return allCollaboratorsNotDrawn
  }

  async countNotDrawnsByDrawId(drawId: string): Promise<number> {
    const allIdDrawnsByDraw = await prisma.event.findMany({
      select: {
        collaborator_id: true,
      },
      where: {
        draw_id: drawId,
      },
    })

    const modifiedResult = allIdDrawnsByDraw.map(
      ({ collaborator_id }) => collaborator_id,
    )

    const count = await prisma.collaborator.count({
      where: {
        id: {
          notIn: modifiedResult,
        },
        OR: [
          {
            end_at: null,
          },
          {
            end_at: {
              gt: new Date(),
            },
          },
        ],
      },
    })

    return count
  }

  async edit(id: string, data: UpdateCollaborator): Promise<Collaborator> {
    const collaborator = await prisma.collaborator.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        cpf: data.cpf,
        end_at: data.endAt,
      },
    })

    return collaborator
  }

  async create(
    data: Prisma.CollaboratorUncheckedCreateInput,
  ): Promise<Collaborator> {
    const collaborator = await prisma.collaborator.create({
      data,
    })

    return collaborator
  }
}
