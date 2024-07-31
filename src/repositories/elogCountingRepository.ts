import { ElogCounting } from "@/domain/entities/ElogCounting"
import { XlsxProvider } from "@/providers/xlsxProvider"

export class ElogCountingRepository {

  repository: ElogCounting[] = []

  constructor(
    private readonly xlsxProvider: XlsxProvider
  ) {
    const sheet = this.xlsxProvider.read({ sheetIndex: 0 })
    try {
      const date = this.excelDateToJSDate(Number(sheet[3][6]))
      this.repository = sheet
        .filter(item => !isNaN(Number(item[0])))
        .filter(item => item[5].toString().startsWith('ADLER'))
        .map((item) => ({
          date,
          partNumber: item[0].toString(),
          description: item[1].toString(),
          demands: item.slice(6, 13).map((item, index) => ({
            date: this.excelDateToJSDate(Number(sheet[3][index + 6])),
            qunatity: Number(item)
          })),
          total: (item.slice(6, 13) as number[]).reduce((acc, value) => acc + value, 0)
        }))
    } catch { }
  }


  findMany() {
    return this.repository
  }

  findByPartNumber(partNumber: string, days: number) {
    const findItem = this.repository.find(entry => {
      return this.normalizePartNumber(String(entry.partNumber)) === this.normalizePartNumber(partNumber)
    })
    if (!findItem) {
      return null
    }

    if (days > findItem.demands.length || days <= 0) {
      throw new Error('invalid days of production. required:  1-' + findItem.demands.length)
    }

    findItem.total = findItem.demands
      .splice(0, days)
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
