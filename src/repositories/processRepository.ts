import { prisma } from "@/prisma";
import { Process } from "@/domain/entities/Process";

export class ProcessRepository {

  async create({ parentId, ...data }: Omit<Process, 'childrens' | 'parent' | 'id' | 'machines' | 'products'>, machinesSlugs?: string[]) {
    const process = await prisma.process.create({
      data: {
        ...data,
        ...parentId ? {
          parent: { connect: { id: parentId } },
        } : {},
        ...machinesSlugs ? {
          machines: {
            connect: machinesSlugs.map(slug => ({ slug }))
          }
        } : {}
      }
    })
    return process as Process
  }

  async findMany(includeProductsPartsNumbers?: string[]) {
    const processes = await prisma.process.findMany({
      orderBy: {
        type: 'asc'
      },
      include: {
        machines: true,
        ...includeProductsPartsNumbers ? {
          products: {
            where: {
              OR: includeProductsPartsNumbers.map(partNumber => ({ partNumber }))
            },
            include: {
              finisheds: true,
            }
          }
        } : {
          products: {
            include: {
              finisheds: true,
            }
          },
        },
      }
    })
    return processes as Process[]
  }

  async findById(id: Process['id'], includeProductsIds?: number[]) {
    const process = await prisma.process.findUnique({
      where: { id },
      include: {
        machines: true,
        ...includeProductsIds ? {
          products: {
            where: {
              OR: includeProductsIds.map(id => ({ id }))
            },
            include: {
              finisheds: true,
            }
          }
        } : {
          products: {
            include: {
              finisheds: true,
            }
          },
        },
      }
    })
    return process as Process
  }

}
