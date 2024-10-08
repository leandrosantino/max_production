import { JisData } from "@/domain/entities/JisData";
import sql from 'mssql'
import { DateTime } from '@/utils/DateTime'

type ApiResponse = Record<string, JisData>

export class JisDataRepository {

  private repository: ApiResponse = {}

  async init(starts: string, ends: string, startHour: number) {
    this.repository = {}
    await sql.connect({
      server: '192.168.116.232',
      authentication: {
        type: 'default',
        options: {
          userName: 'sa',//'gatejis',
          password: 'jis@2015'//'apg@202050'
        }
      },
      options: {
        instanceName: 'sqljis',
        database: 'JIS',
        encrypt: false,
      }
    })
    return await new Promise<void>((resolve, reject) => {
      try {
        const result = new sql.Request()
        const [year, month, day] = ends.split('-').map(i => Number(i))
        // const startHour = 6
        result.input('Param1', this.formatDate(starts.split('T')[0]))
        result.input('Param2', this.formatDate(ends.split('T')[0]))

        // console.log(starts, ends)

        result.execute<{
          CODFIAT: string,
          DTE_IMPORT: string,
          PNDESC: string,
          HORA: string,
          IMPRESSO: "I" | "N",
          ID: number
        }>(`Moncis`, (err, result) => {
          result?.recordset.forEach((item, index) => {
            const date = new DateTime(item.DTE_IMPORT)
            const startsDate = DateTime.strDateToDateObj(starts).minusHours(3)
            const endsDate = DateTime.strDateToDateObj(ends).minusHours(3)

            if (date.isBefore(startsDate) || date.isAfter(endsDate)) {
              return
            }

            // console.log(date, ' - ', startsDate, ' - ', endsDate)

            if (this.repository[this.normalizePartNumber(item.CODFIAT)] === undefined) {
              this.repository[this.normalizePartNumber(item.CODFIAT)] = {
                count: 1,
                date: item.DTE_IMPORT,
                description: item.PNDESC,
                hour: item.HORA,
                id: item.ID,
                status: item.IMPRESSO
              }
              return
            }
            this.repository[item.CODFIAT].count += 1
          })
          resolve()
        });
      } catch (e) {
        reject((e as Error).message)
      }
    })
  }

  getByPartNumber(partNumber: string) {
    try {
      const jisData = this.repository[this.normalizePartNumber(partNumber)]
      if (!jisData) {
        return null
      }
      return jisData
    } catch {
      console.log('test try')
      return null
    }
  }

  getAll() {
    return this.repository
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

  formatDate(date: string) {
    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year}`
  }


}
