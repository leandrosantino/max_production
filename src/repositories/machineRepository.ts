import { prisma } from "@/prisma";
import { Machine } from "@/domain/entities/Machine";


export class MachineRepository {
  async create({ processId, ...data }: Omit<Machine, 'process' | 'id'>) {
    const machine = await prisma.machine.create({
      data: {
        ...data,
        ...processId ? {
          process: {
            connect: { id: processId }
          }
        } : {}
      }
    })
    return machine
  }

  async findMany() {
    const machines = await prisma.machine.findMany()
    return machines
  }

  async findById(id: Machine['id']) {
    const machine = await prisma.machine.findUnique({
      where: { id }
    })
    return machine
  }

  async findBySlug(slug: Machine['slug']) {
    const machine = await prisma.machine.findUnique({
      where: { slug },
      include: {
        acceptedProducts: true
      }
    })
    return machine
  }
}
