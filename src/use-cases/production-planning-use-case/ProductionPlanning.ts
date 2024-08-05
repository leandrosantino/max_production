import { Process } from "@/domain/entities/Process";
import { ProductionScript } from "@/use-cases/production-planning-use-case/ProductionScript";
import { JisDataRepository } from "@/repositories/JisDataRepository";
import { ElogCountingRepository } from "@/repositories/elogCountingRepository";
import { ProcessRepository } from "@/repositories/processRepository";
import { ProductionCountDataRepository } from "@/repositories/productionCountData";
import { ProductionScriptRepository } from "@/repositories/productionScriptRepository";
import { StockCountingRepository } from "@/repositories/stockCountingRepository";
import { ProcessedProduct, ProductionPlanningOptions, CalculateIndicatorsProps, GetFinishedExternalInfoProps, ExternalInfo, CalculatedValues, GetWipExternalInfoProps } from "./DataObjects";
import { MachineRepository } from "@/repositories/machineRepository";
import { ObjectUtils } from "@/utils/ObjectUtils";
import { OptimizationRepository } from "@/repositories/optimizationRepository";


const SECONDS_IN_ONE_HOUR = 3600

export class ProductionPlanning {

  constructor(
    private productionScriptRepository: ProductionScriptRepository,
    private readonly processRepository: ProcessRepository,
    private readonly elogCountingRepository: ElogCountingRepository,
    private readonly stockCountingRepository: StockCountingRepository,
    private readonly optimizationRepository: OptimizationRepository,
    private readonly productionCountDataRepository: ProductionCountDataRepository,
    private readonly jisDataRepository: JisDataRepository,
    private readonly machineRepository: MachineRepository,
    private readonly objectUtils: ObjectUtils,
    private readonly options: ProductionPlanningOptions
  ) { }

  async execute() {

    await this.jisDataRepository.init(this.options.weekStartDate, this.options.date, this.options.startProductionHour)
    await this.productionCountDataRepository.init(this.options.weekStartDate, this.options.date)
    await this.optimizationRepository.init(this.options.productiveDays)

    this.productionScriptRepository.clear()

    const processes = await this.processRepository.findMany()
    for (const process of processes) {
      await this.createScript(process)
    }
    return this.productionScriptRepository.getAll(this.options.ute)
  }

  private async createScript(process: Process) {

    const products: ProcessedProduct[] = []

    let parentProcessScriptProducts: GetWipExternalInfoProps['parentProcessScriptProducts'] = []
    if (process.type === 'wip') {
      const parentProcess = this.productionScriptRepository.findByProcessId(process.parentId as number)
      if (parentProcess === null) {
        throw new Error('')
      }
      parentProcessScriptProducts = parentProcess.products
    }

    for (const product of process.products) {

      let externalInfo: ExternalInfo | null = null
      let minLot = undefined

      if (process.type === 'wip') {
        externalInfo = this.getExternalInfoWip({ ...product, parentProcessScriptProducts })
      }
      if (process.type === 'finished') {
        minLot = this.optimizationRepository.findBySapCode(product.sapCode)?.value
        if (!minLot) minLot = 0
        externalInfo = this.getExternalInfoFinished(product)
      }

      if (externalInfo === null) {
        continue
      }

      const indicators: CalculatedValues = this.calculateIndicators({
        minLot,
        ...externalInfo,
        ...product
      })

      products.push({
        ...externalInfo,
        ...indicators,
        ...product,
      })

    }

    if (!process.machines) {
      throw new Error('')
    }

    const ordedProducts: ProductionScript['products'] = await this
      .calculateProductionSequence(products, process.machines.map(({ slug }) => slug))

    this.productionScriptRepository.create({
      processDecription: process.description,
      processId: process.id,
      products: ordedProducts,
      ute: process.ute
    })

  }

  private getExternalInfoFinished({ partNumber, sapCode, multiple }: GetFinishedExternalInfoProps): ExternalInfo | null {

    const elogCounting = this.elogCountingRepository.findByPartNumber(partNumber as string, this.options.productiveDays)
    const initialStock = this.stockCountingRepository.findBySapCode(sapCode)
    const consumed = this.jisDataRepository.getByPartNumber(partNumber as string)
    const produced = this.productionCountDataRepository.getBySapCode(sapCode)

    if (!elogCounting || !initialStock) {
      return null
    }

    const demand = Math.ceil(elogCounting.total / multiple)

    return {
      weekleyDemand: demand,
      initialStock: initialStock.amount,
      consumed: consumed?.count ? consumed?.count : 0,
      produced: produced?.quantity ? produced?.quantity : 0
    }
  }

  private getExternalInfoWip({ sapCode, partNumber, multiple, ...props }: GetWipExternalInfoProps): ExternalInfo | null {

    const initialStock = this.stockCountingRepository.findBySapCode(sapCode)

    let demand: number = 0
    let consumed = 0

    for (const finishedProduct of props.finisheds) {
      const findFinishedProduct = props.parentProcessScriptProducts
        .find(entry => entry.sapCode === finishedProduct.sapCode)

      if (findFinishedProduct) {
        demand += findFinishedProduct.weekleyDemand
        consumed += findFinishedProduct.consumed
      }
    }

    let produced = this.productionCountDataRepository.getBySapCode(sapCode)

    if (consumed > 0) {
      consumed = Math.ceil(consumed / multiple)
    }

    if (demand <= 0 || !initialStock) {
      return null
    }

    demand = Math.ceil(demand / multiple)

    return {
      weekleyDemand: demand,
      initialStock: initialStock.amount,
      consumed: consumed,
      produced: produced?.quantity ? produced?.quantity : 0
    }
  }

  private calculateIndicators({ initialStock, consumed, produced, minLot, ...props }: CalculateIndicatorsProps): CalculatedValues {
    const currentStock = initialStock + produced - consumed
    const dailyDemand = Math.round(props.weekleyDemand / this.options.productiveDays)
    const currentStockInDays = currentStock / dailyDemand
    const coverage = (currentStock - dailyDemand) / dailyDemand
    let calcMinLot = minLot

    if (minLot == undefined) {
      calcMinLot = dailyDemand * (
        dailyDemand >= this.options.minLotCutoffPoint ?
          this.options.lowRunner :
          this.options.highRunner
      );
    }

    // minLot = this.roundDemandByQuantityPerPackage(minLot, props.quantityPerPackage)

    const piecesPerHour = SECONDS_IN_ONE_HOUR / props.cicleTime
    const setupDurationInHours = props.setupDurationInMinutes / 60
    const productionTime = (calcMinLot / piecesPerHour) + setupDurationInHours


    return { currentStock, dailyDemand, currentStockInDays, coverage, minLot: calcMinLot, productionTime }
  }

  private roundDemandByQuantityPerPackage(demand: number, quantityPerPackage: number) {
    let roundedDemand = demand / quantityPerPackage
    roundedDemand = Math.ceil(roundedDemand)
    roundedDemand = roundedDemand * quantityPerPackage
    return roundedDemand
  }

  private async calculateProductionSequence(products: ProcessedProduct[], machinesSlugs: string[]) {
    this.objectUtils.orderArrayOfObjects(products, 'coverage', 'asc')
    const ordedProduct: ProductionScript['products'] = []

    const machines = machinesSlugs.map(slug => ({
      slug, accumulatedProductionTime: 0
    }))

    for (const entry of products) {
      let machine = {} as { slug: string, accumulatedProductionTime: number }

      for (const m of machines) {
        const machineData = await this.machineRepository.findBySlug(m.slug)
        if (machineData) {
          const searchMachine = machineData.acceptedProducts.find((e: { sapCode: any; }) => e.sapCode === entry.sapCode)
          if (searchMachine) {
            machine = m
            break
          }
        }
      }

      if (machine.accumulatedProductionTime === 0) {
        machine.accumulatedProductionTime += this.options.startProductionHour
      }
      ordedProduct.push({
        ...entry,
        setupTime: machine.accumulatedProductionTime,
        machineSlug: machine.slug
      })
      machine.accumulatedProductionTime += entry.productionTime
      this.objectUtils.orderArrayOfObjects(machines, 'accumulatedProductionTime', 'asc')

    }

    return ordedProduct
  }

}
