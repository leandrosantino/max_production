import { IpcQuery } from '@/utils/decorators'
import { productionPlanning } from '@/factories/useCasesFactory'
import { ProductionPlanningOptions } from '@/use-cases/production-planning-use-case/DataObjects'

import { elogCountingRepository } from '@/factories/useCasesFactory'

export class ProductionPlanService {

  @IpcQuery()
  async runProductionPlan(options: ProductionPlanningOptions) {
    const script = await productionPlanning(options)
    return script
  }

  @IpcQuery()
  async getElogData(partNumber: string) {
    return elogCountingRepository.findByPartNumber(partNumber)
  }

}
