import { prisma } from "@/prisma";
import { ProductionCountData } from "@/domain/entities/ProductionCountData";

export class ProductionCountDataRepository {

  private repository: Record<string, ProductionCountData> = {}

  constructor() { }

  async init(starts: string, ends: string) {
    try {

      const [year, month, day] = this.formatDate(ends)

      const production = await prisma.production.groupBy({
        where: {
          date: {
            gte: new Date(starts),
            lte: new Date(year, month - 1, day, 20, 59, 59, 999),
          }
        },
        by: "sapcode",
        _sum: {
          quantity: true
        }
      })
      production.forEach(item => {
        this.repository[item.sapcode] = {
          quantity: (item._sum.quantity != null ? item._sum.quantity : 0) as number
        }
      })
    } catch (e) { }
  }

  async getRecents() {
    const data = await prisma.production.findMany({
      orderBy: {
        id: 'desc'
      },
      take: 30
    })
    return data
  }

  async create(params: {
    sapcode: string
    quantity: number
    description: string
    packcode: string
  }) {
    const data = await prisma.production.create({
      data: params
    })
    return data
  }

  getAll() {
    return this.repository
  }

  getBySapCode(sapCode: string) {
    const productionCount = this.repository[sapCode]
    if (!productionCount) {
      return null
    }
    return productionCount
  }

  formatDate(date: string) {
    return date.split('-').map(i => Number(i))
  }

}
