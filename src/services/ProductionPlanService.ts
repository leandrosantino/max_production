import { IpcQuery } from '@/utils/decorators'
import { productionPlanning } from '@/factories/useCasesFactory'
import { ProductionPlanningOptions } from '@/use-cases/production-planning-use-case/DataObjects'
import { XlsxProvider } from '@/providers/xlsxProvider'
import { configRepository } from '@/repositories/configRepository'
import { ElogCountingRepository } from '@/repositories/elogCountingRepository'
import { productRepository } from '@/factories/repositoriesFactory'

export class ProductionPlanService {

  @IpcQuery()
  async runProductionPlan(options: ProductionPlanningOptions) {
    const script = await productionPlanning(options)
    return script
  }

  @IpcQuery()
  async getElogData(partNumber: string, productiveDays: number) {
    const config = configRepository.getConfig()
    const xlsxServiceElog = new XlsxProvider(config.elogFileDir || '')
    const elogCountingRepository = new ElogCountingRepository(xlsxServiceElog, productiveDays)

    const elogData = elogCountingRepository.findByPartNumber(partNumber)

    const product = await productRepository.findByPartNumber(partNumber)
    elogData.description = product.description

    return elogData
  }

}
