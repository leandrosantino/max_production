import xlsx from 'node-xlsx'
import path from 'path'
import fs from 'fs'

export interface XlsxServiceReadResponse {
  name: string
  data: Array<Array<string | number>>
}

export class XlsxProvider {

  constructor(private readonly filepath: string) { }

  read({ sheetName, sheetIndex }: { sheetName?: string, sheetIndex?: number }) {
    if (!fs.existsSync(this.filepath)) {
      throw new Error('file not found')
    }
    const sheets = xlsx.parse(this.filepath)

    if (sheetName == undefined && sheetIndex == undefined) {
      throw new Error('sheet name or sheet index not found')
    }

    let sheet: XlsxServiceReadResponse | undefined

    if (sheetName) {
      sheet = sheets.find(({ name }) => name === sheetName)
    }

    if (!sheetName) {
      sheet = sheets[sheetIndex as number]
    }

    if (!sheet) {
      throw new Error('sheet not found' + this.filepath)
    }

    return sheet.data.filter((entry, index) => entry.length !== 0 && index > 0)
  }


}
