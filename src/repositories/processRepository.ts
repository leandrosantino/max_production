import { Process } from "@/domain/entities/Process";
import { repositories } from "@/infra/repositories";

export class ProcessRepository {

  async create({ parentId, ...data }: Omit<Process, 'childrens' | 'parent' | 'id' | 'machines' | 'products'>, machinesSlugs?: string[]) {
    const process = repositories.process.create({
      ...data,
      parentId,
      machines: machinesSlugs.map(slug => ({ slug }))
    })
    await repositories.process.save(process)
    return process
  }

  async findMany(includeProductsPartsNumbers?: string[]) {

    const queryBuilder = repositories.process.createQueryBuilder('process')
      .leftJoinAndSelect('process.machines', 'machines')
      .leftJoinAndSelect('process.products', 'products')
      .leftJoinAndSelect('products.finisheds', 'finisheds')
      .orderBy('process.type', 'ASC');

    if (includeProductsPartsNumbers && includeProductsPartsNumbers.length > 0) {
      queryBuilder.andWhere('products.partNumber IN (:...partNumbers)', { partNumbers: includeProductsPartsNumbers });
    }

    const processes = await queryBuilder.getMany();

    return processes
  }

  async findById(id: Process['id'], includeProductsIds?: number[]) {
    const queryBuilder = repositories.process.createQueryBuilder('process')
      .leftJoinAndSelect('process.machines', 'machines')
      .leftJoinAndSelect('process.products', 'products')
      .leftJoinAndSelect('products.finisheds', 'finisheds')
      .where('process.id = :id', { id });

    if (includeProductsIds && includeProductsIds.length > 0) {
      queryBuilder.andWhere('products.id IN (:...productIds)', { productIds: includeProductsIds });
    }

    const process = await queryBuilder.getOne();
    return process;
  }

}
