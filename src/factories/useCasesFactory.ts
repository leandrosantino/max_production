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
  productRepository
} from './repositoriesFactory'
import { OptimizationRepository } from '@/repositories/optimizationRepository'


export const productionPlanning = (options: ProductionPlanningOptions) => {
  const xlsxService = new XlsxProvider(process.env.XLSX_FILE_DIR || '')
  const xlsxServiceElog = new XlsxProvider(process.env.ELOG_FILE_DIR || '')

  const stockCountingRepository = new StockCountingRepository(xlsxService)
  const elogCountingRepository = new ElogCountingRepository(xlsxServiceElog)

  const stockCountingRepository2 = new StockCountingRepository(xlsxService)
  const elogCountingRepository2 = new ElogCountingRepository(xlsxServiceElog)

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

  return productionPlanning.execute()
}

