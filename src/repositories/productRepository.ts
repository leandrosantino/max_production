import { prisma } from "@/prisma";
import { Product } from "@/domain/entities/Product";
import { Machine } from "@prisma/client";

export class ProductRepository {
  async create({ processId, wipSapCode, ...data }: Omit<Product, 'process' | 'id' | 'wip' | 'finisheds'>) {
    const product = await prisma.product.create({
      data: {
        ...data,
        process: {
          connect: { id: processId }
        },
        ...wipSapCode ? {
          wip: {
            connect: { sapCode: wipSapCode }
          },
        } : {},
      }
    })
    return product
  }

  async findMany(where?: { type: 'finished' | 'wip' }) {
    const products = prisma.product.findMany({
      where: where ? {
        type: where.type
      } : {},
      include: {
        finisheds: true,
        process: true,
        wip: true,
      }
    })
    return products
  }

  async findBySapCode(sapCode: string) {
    const prodcut = await prisma.product.findUnique({
      where: { sapCode }
    })
    if (!prodcut) {
      return null
    }
    return prodcut
  }

  async findById(id: Product['id']) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        finisheds: true,
        process: true,
        wip: true,
      }
    })
    return product
  }

  async updateComponentsConnetionsOrCreate(sapCode: Product['sapCode']) {
    const product = await prisma.product.update({
      where: { sapCode },
      data: {
        // components: {
        //   connectOrCreate: components.map(component => ({
        //     where: { sapCode: component.sapCode },
        //     create: component
        //   }))
        // }
      },
    })
    return product
  }

  async connectToMachineBySlug(sapCode: Product['sapCode'], slug: Machine['slug']) {
    const updatedProduct = await prisma.product.update({
      where: { sapCode },
      data: {
        productionMachine: {
          connect: { slug }
        }
      }
    })
    return updatedProduct
  }

}
