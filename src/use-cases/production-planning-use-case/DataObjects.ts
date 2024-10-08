import { Product } from "@/domain/entities/Product"
import { ProductionScript } from "@/domain/entities/ProductionScript"

export type ProductInfo =
  Pick<Product, 'id' | 'description' | 'partNumber' | 'sapCode' | 'cicleTime' | 'setupDurationInMinutes' | 'quantityPerPackage' | 'line'>

export interface ExternalInfo {
  weekleyDemand: number
  initialStock: number
  consumed: number
  produced: number,
}

export interface CalculatedValues {
  currentStock: number
  dailyDemand: number
  currentStockInDays: number
  coverage: number
  minLot: number
  opt: number
  productionTime: number
}

export interface ProductionSequenceInfo {
  setupTime: number
  machineSlug: string
}

export interface ProductionPlanningOptions {
  productiveDays: number,
  lowRunner: number,
  highRunner: number,
  minLotCutoffPoint: number
  ute?: string,
  endsDate: string
  startDate: string,
  startProductionHour: number
}

export type ProcessedProduct = ProductInfo & ExternalInfo & CalculatedValues

export type CalculateIndicatorsProps =
  Pick<ProductInfo, 'cicleTime' | 'setupDurationInMinutes' | 'quantityPerPackage'> &
  ExternalInfo & { minLot: number | undefined }

export type GetFinishedExternalInfoProps = Pick<Product, 'partNumber' | 'sapCode'> & {
  multiple: Product['multiple']
}

export type GetWipExternalInfoProps = GetFinishedExternalInfoProps & {
  finisheds: Product[],
  parentProcessScriptProducts: Array<Pick<ProductionScript['products'][number], 'sapCode' | 'weekleyDemand' | 'consumed' | 'produced'>>
}
