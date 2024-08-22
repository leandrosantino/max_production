import { XlsxProvider } from '@/providers/xlsxProvider'
import { ElogCountingRepository } from '@/repositories/elogCountingRepository'
import { StockCountingRepository } from '@/repositories/stockCountingRepository'
import { ProductionPlanningOptions } from '@/use-cases/production-planning-use-case/DataObjects'
import { ProductionPlanning } from '@/use-cases/production-planning-use-case/ProductionPlanning'
import {
  productionScriptRepository,
  processRepository,
  productionCountDataRepository,
  jisDataRepository,
  machineRepository,
  analyticsService,
} from './repositoriesFactory'
import { OptimizationRepository } from '@/repositories/optimizationRepository'
import { configRepository } from '@/repositories/configRepository'


export let elogCountingRepository = {} as ElogCountingRepository

export const productionPlanning = async (options: ProductionPlanningOptions) => {

  const config = configRepository.getConfig()

  const xlsxService = new XlsxProvider(config.xlsxFileDir || '')
  const xlsxServiceElog = new XlsxProvider(config.elogFileDir || '')

  const stockCountingRepository = new StockCountingRepository(xlsxService)
  elogCountingRepository = new ElogCountingRepository(xlsxServiceElog, options.productiveDays)

  const optimizationRepository = new OptimizationRepository()

  const productionPlanning = new ProductionPlanning(
    productionScriptRepository,
    processRepository,
    elogCountingRepository,
    stockCountingRepository,
    optimizationRepository,
    productionCountDataRepository,
    jisDataRepository,
    machineRepository,
    analyticsService,
    options
  )

  return { script: await productionPlanning.execute(), elogDate: elogCountingRepository.getStartDate() }
}

