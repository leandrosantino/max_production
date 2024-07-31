import { StockCounting } from "@/domain/entities/StockCounting"
import { XlsxProvider } from "@/providers/xlsxProvider"

export class StockCountingRepository {

  repository: StockCounting[] = []

  constructor(
    private readonly xlsxProvider: XlsxProvider,
  ) {
    this.repository = []
    const sheetsData = this.xlsxProvider.read({ sheetName: 'stock' })
    sheetsData.forEach(data => {
      this.repository.push({
        sapCode: String(data[0]),
        amount: Number(data[2])
      })
    })

  }

  findMany() {
    return this.repository
  }

  findBySapCode(sapCode: string) {
    const findItem = this.repository.find(entry => entry.sapCode === sapCode)
    if (!findItem) {
      return null
    }
    return findItem
  }
}
