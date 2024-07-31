import { Machine } from "@/domain/entities/Machine"
import { Product } from "@/domain/entities/Product"

export interface Process {
  id: number
  description: string
  type: 'wip' | 'finished'
  ute: string
  childrens?: Process
  machines?: Machine[]
  parentId?: number
  parent?: Process
  products: Product[]
}
