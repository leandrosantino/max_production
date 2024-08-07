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
      const endDateEpoch = this.dateToEpoch(ends, true);

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

  private dateToEpoch(date: string, endOfDay: boolean = false): number {
    const [year, month, day] = this.formatDate(date);
    const dateObj = endOfDay ? new Date(year, month - 1, day, 23, 59, 59, 999) : new Date(year, month - 1, day);
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

  formatDate(date: string) {
    return date.split('-').map(i => Number(i));
  }
}
