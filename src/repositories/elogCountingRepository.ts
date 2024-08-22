import { ElogCounting } from "@/domain/entities/ElogCounting"
import { XlsxProvider } from "@/providers/xlsxProvider"

export class ElogCountingRepository {

  repository: ElogCounting[] = []

  startDate: Date

  constructor(
    private readonly xlsxProvider: XlsxProvider,
    private readonly productiveDays: number
  ) {
    const sheet = this.xlsxProvider.read({ sheetIndex: 0 })
    try {
      this.startDate = this.excelDateToJSDate(Number(sheet[3][6]))
      this.repository = sheet
        .filter(item => !isNaN(Number(item[0])))
        .filter(item => item[5].toString().startsWith('ADLER'))
        .map((item) => ({
          date: this.startDate,
          partNumber: item[0].toString(),
          description: item[1].toString(),
          demands: item.slice(6, 13).map((item, index) => ({
            date: this.excelDateToJSDate(Number(sheet[3][index + 6])),
            qunatity: Number(item)
          })),
          total: (item.slice(6, 6 + this.productiveDays) as number[]).reduce((acc, value) => acc + value, 0)
        }))
    } catch { }
  }

  getStartDate() {
    return this.startDate
  }

  findMany() {
    return this.repository
  }

  findByPartNumber(partNumber: string) {
    const findItem = this.repository.find(entry => {
      return this.normalizePartNumber(String(entry.partNumber)) === this.normalizePartNumber(partNumber)
    })
    if (!findItem) {
      return null
    }

    if (this.productiveDays <= 0) {
      throw new Error(`invalid days of production. receve: ${this.productiveDays}, required:  1-${findItem.demands.length}`)
      // return null
    }

    findItem.total = findItem.demands
      .splice(0, this.productiveDays)
      .map(item => item.qunatity)
      .reduce((acc, value) => acc + value, 0)

    return findItem
  }

  private excelDateToJSDate(excelDate: number) {
    const baseDate = new Date(1899, 11, 30);
    const days = Math.floor(excelDate);
    const milliseconds = (excelDate - days) * 24 * 60 * 60 * 1000;
    const jsDate = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000 + milliseconds);
    return jsDate;
  }

  private normalizePartNumber(partNumber: string) {
    const pattern = /(\d{11})(E)/
    if (pattern.test(partNumber)) {
      return partNumber
    }
    const formattedPartNumber = partNumber.padStart(11, '0') + 'E'
    if (!pattern.test(formattedPartNumber)) {
      throw new Error('fail to normalize part number')
    }
    return formattedPartNumber
  }
}
