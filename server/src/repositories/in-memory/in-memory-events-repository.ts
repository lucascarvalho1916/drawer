import { Prisma, Event } from '@prisma/client'
import { EventsRepository } from '../events-repository'

export class InMemoryEventsRepository implements EventsRepository {
  public items: Event[] = []

  async findManyByDrawId(drawId: string, page: number): Promise<Event[]> {
    return this.items
      .filter((item) => item.draw_id === drawId)
      .slice((page - 1) * 20, page * 20)
  }

  async countByDrawId(drawId: string): Promise<number> {
    return this.items.filter((item) => item.draw_id === drawId).length
  }

  async create(data: Prisma.EventUncheckedCreateInput): Promise<Event> {
    throw new Error('Method not implemented.')
  }
}
