import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const configSchema = z.object({
  databaseUrl: z.string(),
  prodDatabaseUrl: z.string(),
  elogFileDir: z.string(),
  xlsxFileDir: z.string(),
  pythonPath: z.string(),
  scriptPath: z.string(),
  log: z.boolean()
});

type ConfigType = z.infer<typeof configSchema>

export class ConfigRepository {
  private schema = configSchema;
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  public getConfig(): ConfigType | null {
    try {
      const jsonData = fs.readFileSync(this.filePath, 'utf-8');

      const data = JSON.parse(jsonData);

      const parsedData = this.schema.parse(data);

      return parsedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Erro de validação:', error.errors);
      } else {
        console.error('Erro ao ler ou parsear o JSON:', error);
      }
      return null;
    }
  }
}

const filePath = MAIN_WINDOW_VITE_DEV_SERVER_URL
  ? "D:\\dev\\max_production\\config.json"
  : path.join(path.dirname(process.execPath), 'config.json');

export const configRepository = new ConfigRepository(filePath);
