import { ProductionCountData } from '@/domain/entities/ProductionCountData';
import { repositories } from '@/infra/repositories';

export class ProductionCountDataRepository {
  private repository: Record<string, ProductionCountData> = {};

  constructor() { }

  async init(starts: string, ends: string) {
    try {
      const [year, month, day] = this.formatDate(ends);

      const production = await repositories.production.createQueryBuilder('production')
        .select('production.sapcode')
        .addSelect('SUM(production.quantity)', 'quantity')
        .where('production.date BETWEEN :starts AND :ends', {
          starts: new Date(starts),
          ends: new Date(year, month - 1, day, 20, 59, 59, 999)
        })
        .groupBy('production.sapcode')
        .getRawMany();

      production.forEach(item => {
        this.repository[item.sapcode] = {
          quantity: item.quantity != null ? parseInt(item.quantity, 10) : 0
        };
      });
    } catch (e) {
      console.error(e);
    }
  }

  async getRecents() {
    const data = await repositories.production.find({
      order: {
        id: 'DESC'
      },
      take: 30
    });
    return data;
  }

  async create(params: {
    sapcode: string;
    quantity: number;
    description: string;
    packcode: string;
  }) {
    const data = repositories.production.create(params);
    await repositories.production.save(data);
    return data;
  }

  getAll() {
    return this.repository;
  }

  getBySapCode(sapCode: string) {
    const productionCount = this.repository[sapCode];
    if (!productionCount) {
      return null;
    }
    return productionCount;
  }

  formatDate(date: string) {
    return date.split('-').map(i => Number(i));
  }
}
