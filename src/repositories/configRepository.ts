import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// Defina o esquema Zod
const configSchema = z.object({
  databaseUrl: z.string(),
  elogFileDir: z.string(),
  xlsxFileDir: z.string(),
  pythonPath: z.string(),
  scriptPath: z.string()
});

// Defina a interface para o tipo de configuração
type ConfigType = z.infer<typeof configSchema>

// Classe ConfigRepository
export class ConfigRepository {
  private schema = configSchema;
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  public getConfig(): ConfigType | null {
    try {
      // Leia o arquivo JSON
      const jsonData = fs.readFileSync(this.filePath, 'utf-8');

      // Faça o parsing do JSON
      const data = JSON.parse(jsonData);

      // Valide com o esquema Zod
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

// Exemplo de uso
const filePath = path.join(process.execPath, 'config.json');
// const filePath = "D:\\dev\\max_production\\config.json"
export const configRepository = new ConfigRepository(filePath);
console.log(configRepository.getConfig(), '\n', filePath)
