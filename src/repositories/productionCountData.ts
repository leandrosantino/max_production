import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { ProductionCountData } from '@/domain/entities/ProductionCountData';
import { configRepository } from './configRepository';

export class ProductionCountDataRepository {
  private repository: Record<string, ProductionCountData> = {};
  private db: Database<sqlite3.Database, sqlite3.Statement>

  constructor() { }

  async init(starts: string, ends: string) {
    this.repository = {}
    try {
      this.db = await open({
        filename: configRepository.getConfig().prodDatabaseUrl,
        driver: sqlite3.Database
      });

      const startDateEpoch = this.dateToEpoch(starts);
      const endDateEpoch = this.dateToEpoch(ends);

      const production = await this.db.all(`
        SELECT production.sapcode, SUM(production.quantity) as quantity
        FROM production
        WHERE production.date BETWEEN ? AND ?
        GROUP BY production.sapcode
      `, [startDateEpoch, endDateEpoch]);

      production.forEach(item => {
        this.repository[item.sapcode] = {
          quantity: item.quantity != null ? parseInt(item.quantity, 10) : 0
        };
      });
    } catch (e) {
      console.error(e);
    } finally {
      if (this.db) {
        await this.db.close();
      }
    }
  }

  private dateToEpoch(strDate: string): number {
    const { date: [year, month, day], time: [hour, minutes] } = this.formatDate(strDate)
    const dateObj = new Date(year, month - 1, day, hour, minutes);
    return dateObj.getTime();
  }


  getAll() {
    return this.repository;
  }

  getBySapCode(sapCode: string) {
    const productionCount = this.repository[sapCode];
    if (!productionCount) {
      return null;
    }
    return productionCount;
  }

  formatDate(strDate: string) {
    const [date, time] = strDate.split('T')
    return { date: date.split('-').map(i => Number(i)), time: time.split(':').map(i => Number(i)) };
  }
}
