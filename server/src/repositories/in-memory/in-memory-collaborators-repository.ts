import { Collaborator, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CollaboratorsRepository } from '../collaborators-repository'

export class InMemoryCollaboratorsRepository
  implements CollaboratorsRepository
{
  public items: Collaborator[] = []

  async findMany(page: number) {
    return this.items.slice((page - 1) * 20, page * 20)
  }

  async findAllActives(): Promise<Collaborator[]> {
    throw new Error('Method not implemented.')
  }

  async findAllNotDrawnByDraw(drawId: string): Promise<Collaborator[]> {
    throw new Error('Method not implemented.')
  }

  async findNotDrawnByDraw(
    drawId: string,
    page: number,
  ): Promise<Collaborator[]> {
    throw new Error('Method not implemented.')
  }

  async create(data: Prisma.CollaboratorUncheckedCreateInput) {
    const collaborator = {
      id: randomUUID(),
      name: data.name,
      cpf: data.cpf,
      start_at: new Date() ?? data.start_at,
      end_at: new Date() ?? null,
      created_at: new Date(),
    }

    this.items.push(collaborator)

    return collaborator
  }
}
