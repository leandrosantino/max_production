import { Process } from "@/domain/entities/Process"


export interface Machine {
  id: number
  slug: string
  ute: string
  processId?: number
  process?: Process
}
