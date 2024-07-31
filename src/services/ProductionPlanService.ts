import { IpcQuery } from '@/utils/decorators'
import { productionPlanning } from '@/factories/useCasesFactory'
import { ProductionPlanningOptions } from '@/use-cases/production-planning-use-case/DataObjects'

export class ProductionPlanService {

  @IpcQuery()
  async runProductionPlan(options: ProductionPlanningOptions) {
    return productionPlanning(options)
  }

}
