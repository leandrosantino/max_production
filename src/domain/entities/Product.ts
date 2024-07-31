import { Process } from "@/domain/entities/Process"

export interface Product {
  id: number
  description: string
  cicleTime: number
  sapCode: string
  partNumber?: string
  processId: Process['id']
  process?: Process
  wipSapCode?: Product['sapCode']
  wip: Product
  type: 'wip' | 'finished'
  project: string
  finisheds: Product[]
  multiple: number
  quantityPerPackage: number
  setupDurationInMinutes: number
  // initialStock: number
}
