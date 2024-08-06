import { repositories } from "@/infra/repositories";
import { Product } from "@/domain/entities/Product";


export class ProductRepository {


  async create({ processId, wipSapCode, ...data }: Omit<Product, 'process' | 'id' | 'wip' | 'finisheds'>) {
    const product = repositories.product.create({
      ...data,
      process: processId ? await repositories.process.findOneBy({ id: processId }) : undefined,
      wip: wipSapCode ? await repositories.product.findOneBy({ sapCode: wipSapCode }) : undefined,
    });
    await repositories.product.save(product);
    return product;
  }

  async findMany(where?: { type: 'finished' | 'wip' }) {
    const products = await repositories.product.find({
      where: where ? { type: where.type } : {},
      relations: ['finisheds', 'process', 'wip'],
    });
    return products;
  }

  async findBySapCode(sapCode: string) {
    const product = await repositories.product.findOne({ where: { sapCode } });
    return product || null;
  }

  async findById(id: number) {
    const product = await repositories.product.findOne({
      where: { id },
      relations: ['finisheds', 'process', 'wip'],
    });
    return product;
  }

  async updateComponentsConnectionsOrCreate(sapCode: string) {
    const product = await repositories.product.findOne({ where: { sapCode } });
    if (product) {
      // Atualizar conexões dos componentes aqui, se necessário.
      await repositories.product.save(product);
    }
    return product;
  }

  async connectToMachineBySlug(sapCode: string, slug: string) {
    const product = await repositories.product.findOne({ where: { sapCode }, relations: ['productionMachine'] });
    if (product) {
      const machine = await repositories.machine.findOne({ where: { slug } });
      if (machine) {
        product.productionMachine = product.productionMachine ? [...product.productionMachine, machine] : [machine];
        await repositories.product.save(product);
      }
    }
    return product;
  }
}
