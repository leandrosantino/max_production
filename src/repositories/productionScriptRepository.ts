import { ProductionScript } from "@/domain/entities/ProductionScript";

export class ProductionScriptRepository {

  private repository: ProductionScript[] = []

  clear() {
    this.repository = []
  }

  create(data: ProductionScript) {
    if (this.repository.find(script => script.processId === data.processId)?.processId !== undefined) {
      throw new Error('production script already exists')
    }
    this.repository.push(data)
  }

  getAll(ute?: string) {
    if (ute) {
      return this.repository.filter(script => script.ute === ute)
    }
    return this.repository
  }

  findByProcessId(processId: number) {
    const script = this.repository.find(script => script.processId === processId)
    if (!script) {
      return null
    }
    return script
  }

}
