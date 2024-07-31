export interface ProductionScript {
  ute: string
  processId: number
  processDecription: string
  products: Array<{
    id: number
    partNumber?: string
    sapCode: string,
    description: string

    weekleyDemand: number
    initialStock: number
    consumed: number
    produced: number

    currentStock: number
    dailyDemand: number
    currentStockInDays: number
    coverage: number
    minLot: number,

    productionTime: number
    setupTime: number
    machineSlug?: string
  }>
}
