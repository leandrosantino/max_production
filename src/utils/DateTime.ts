import { getWeek } from 'date-fns'

export class DateTime extends Date {

  weekOfYearPattern = new RegExp(/\d{4}-W\d{2}/)

  constructor(...args: Array<number | string>) {
    super(...args as [])
  }

  // fromDateObject(date: Date){
  //   Object.assign(this, date)
  //   return this
  // }

  fromWeekOfYearString(weekOfYearString: string) {
    if (!this.weekOfYearPattern.test(weekOfYearString)) {
      throw new Error('String week not compatible with the pattern!')
    }
    const week = Number(weekOfYearString.split('-W')[1])
    const year = Number(weekOfYearString.split('-W')[0])
    const day = (1 + (week - 2) * 7) + 6
    return new DateTime(year, 0, day, 0, 0, 0, 0)
  }

  getWeekOfYear() {
    return getWeek(this)
  }

  toWeekOfYearString() {
    let weekNumber = String(getWeek(this))
    weekNumber = weekNumber.length == 1 ? `0${weekNumber}` : weekNumber
    return `${this.getFullYear()}-W${weekNumber}`
  }

  plusDay(days: number) {
    this.setDate(this.getDate() + days)
    return this
  }

  plusHours(hours: number) {
    this.setHours(this.getHours() + hours)
    return this
  }

  plusMinutes(minutes: number) {
    this.setMinutes(this.getMinutes() + minutes)
    return this
  }

  minusDay(days: number) {
    this.setDate(this.getDate() - days)
    return this
  }

  plusMonth(months: number) {
    this.setMonth(this.getMonth() + months)
    return this
  }

  plusYear(years: number) {
    this.setFullYear(this.getFullYear() + years)
    return this
  }

  isBefore(date: Date) {
    return this.valueOf() < date.valueOf()
  }

  isAfter(date: Date) {
    return this.valueOf() > date.valueOf()
  }

  toDateNumber() {
    return this.valueOf()
  }

  toFormatedTime() {
    let str = this.toLocaleTimeString()
    str = str.split(':').slice(0, 2).join(':')
    return str
  }

  fromDateNumber(dateNumber: number) {
    return new DateTime(dateNumber)
  }

  plusWeek(weeks: number) {
    this.setDate(this.getDate() + (7 * weeks))
    return this
  }

  getStartOfDay() {
    const day = this.getDate()
    const month = this.getMonth()
    const year = this.getFullYear()
    return new DateTime(year, month, day, 0, 0, 0, 0)
  }

  getEndOfDay() {
    const day = this.getDate()
    const month = this.getMonth()
    const year = this.getFullYear()
    return new DateTime(year, month, day, 23, 59, 59, 999)
  }

  static fractionalTimeToDate(time: number, now: Date) {
    const hours = Math.floor(time)
    const minutes = (time - hours) * 60
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 59, 900)
  }

  static strDateToDateObj(strDate: string) {
    const [year, month, day] = strDate.split('-').map(e => Number(e))
    return new Date(year, month - 1, day)
  }

  static dateObjToStrDate(date: Date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  static getTurnBtDate(date: Date) {
    const y = date.getFullYear()
    const m = date.getMonth()
    const d = date.getDate()

    const h1 = new Date(y, m, d, 6, 10, 0)
    const h2 = new Date(y, m, d, 15, 48, 0)
    const h3 = new Date(y, m, d, 23, 59, 59, 999)
    const h4 = new Date(y, m, d, 0, 0, 0)
    const h5 = new Date(y, m, d, 1, 9, 0)

    if (date >= h1 && date < h2) { return '1º' }
    if (date >= h2 && date < h3) { return '2º' }
    if (date >= h4 && date < h5) { return '2º' }
    if (date >= h5 && date < h1) { return '3º' }

    return ''
  }

  static timeStringToFractional(time: string) {
    const [hours, minutes] = time.split(':').map(e => Number(e))
    if (minutes === 0) {
      return hours
    }
    return hours + minutes / 60
  }

}
