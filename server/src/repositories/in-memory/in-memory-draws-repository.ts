import { Prisma, Draw } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { DrawsRepository } from '../draws-repository'

export class InMemoryDrawsRepository implements DrawsRepository {
  public items: Draw[] = []

  async findMany(page: number) {
    return this.items.slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.DrawUncheckedCreateInput) {
    const draw = {
      id: randomUUID(),
      description: data.description,
      start_at: new Date() ?? data.start_at,
      end_at: new Date() ?? null,
      created_at: new Date(),
    }

    this.items.push(draw)

    return draw
  }
}
