import { Collaborator, Draw, Event, Prisma } from '@prisma/client'
import { EventsRepository } from '../events-repository'
import { prisma } from '@/lib/prisma'

export class PrismaEventsRepository implements EventsRepository {
  async findMany(
    page: number | undefined,
    resultsPerPage: number | undefined,
    query: string,
    sortColumn: string,
    sortDirection: string,
  ): Promise<{
    events: (Event & { collaborator: Collaborator; draw: Draw })[]
    total: number
    perPage: number
    currentPage: number
  }> {
    const parsedQuery = parseFloat(query.replace(',', '.'))
    const valueFilter = isNaN(parsedQuery) ? null : parsedQuery

    let orderBy: Prisma.EventOrderByWithRelationInput = {}

    if (sortColumn === 'name') {
      orderBy.collaborator = {
        name: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    } else if (sortColumn === 'draw.description') {
      orderBy.draw = {
        description: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    } else if (sortColumn === 'value') {
      orderBy = {
        value: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    } else if (sortColumn === 'drawn_at') {
      orderBy = {
        drawn_at: sortDirection === 'asc' ? 'asc' : 'desc',
      }
    }

    const total = await prisma.event.count({
      where: {
        OR: [
          {
            collaborator: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            draw: {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            value: valueFilter !== null ? valueFilter : undefined,
          },
        ],
      },
    })

    resultsPerPage =
      resultsPerPage === undefined || resultsPerPage === 0
        ? total
        : resultsPerPage
    page = page === undefined || page === 0 ? 1 : page

    const events = await prisma.event.findMany({
      orderBy,
      where: {
        OR: [
          {
            collaborator: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            draw: {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            value: valueFilter !== null ? valueFilter : undefined,
          },
          // {
          //   drawn_at: {
          //     contains: 21,
          //     mode: 'insensitive',
          //     // toDate: true,
          //   },
          // },
        ],
      },
      take: resultsPerPage,
      skip: (page - 1) * resultsPerPage,
      include: {
        collaborator: true,
        draw: true,
      },
    })

    return {
      events,
      total,
      perPage: resultsPerPage,
      currentPage: page,
    }
  }

  async fetchPublished(query: string): Promise<{
    events: (Event & { collaborator: Collaborator; draw: Draw })[]
    total: number
  }> {
    const parsedQuery = parseFloat(query.replace(',', '.'))
    const valueFilter = isNaN(parsedQuery) ? null : parsedQuery

    const total = await prisma.event.count({
      where: {
        release_date: {
          lte: new Date(),
        },
        OR: [
          {
            collaborator: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            draw: {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            value: valueFilter !== null ? valueFilter : undefined,
          },
        ],
      },
    })

    const events = await prisma.event.findMany({
      where: {
        release_date: {
          lte: new Date(),
        },
        OR: [
          {
            collaborator: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            draw: {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            value: valueFilter !== null ? valueFilter : undefined,
          },
          // {
          //   drawn_at: {
          //     contains: 21,
          //     mode: 'insensitive',
          //     // toDate: true,
          //   },
          // },
        ],
      },
      include: {
        collaborator: true,
        draw: true,
      },
    })

    return {
      events,
      total,
    }
  }

  async findManyByDrawId(drawId: string, page: number): Promise<Event[]> {
    const events = await prisma.event.findMany({
      orderBy: {
        collaborator: {
          name: 'asc',
        },
      },
      where: {
        draw_id: drawId,
      },
      take: 15,
      skip: (page - 1) * 15,
      include: {
        collaborator: true,
      },
    })

    return events
  }

  async findAllByDrawId(drawId: string): Promise<Event[]> {
    const events = await prisma.event.findMany({
      orderBy: {
        collaborator: {
          name: 'asc',
        },
      },
      where: {
        draw_id: drawId,
      },
    })

    return events
  }

  async countByDrawId(drawId: string): Promise<number> {
    const count = await prisma.event.count({
      where: {
        draw_id: drawId,
      },
    })

    return count
  }

  async create(data: Prisma.EventUncheckedCreateInput): Promise<Event> {
    const event = await prisma.event.create({
      data,
      include: {
        collaborator: true,
      },
    })

    return event
  }
}
