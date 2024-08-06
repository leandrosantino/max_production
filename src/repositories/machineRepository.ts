import { Machine } from "@/domain/entities/Machine";
import { repositories } from "@/infra/repositories";


export class MachineRepository {
  async create({ processId, ...data }: Omit<Machine, 'process' | 'id'>) {
    const machine = repositories.machine.create({ processId, ...data })
    await repositories.machine.save(machine)
    return machine
  }

  async findMany() {
    const machines = await repositories.machine.find()
    return machines
  }

  async findById(id: Machine['id']) {
    const machine = await repositories.machine.findOneBy({
      id
    })
    return machine
  }

  async findBySlug(slug: Machine['slug']) {
    const machine = await repositories.machine.findOne({
      where: { slug },
      relations: {
        acceptedProducts: true
      }
    })
    return machine
  }
}
