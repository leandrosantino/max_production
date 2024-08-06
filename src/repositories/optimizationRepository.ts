import { PythonShell } from 'python-shell'
import { z } from 'zod'
import { ProductionScript } from '@/domain/entities/ProductionScript';

type ScriptProps = {
  sapCode: string
  description: string
  line: string
  stock: number
  demand: number
}

export class OptimizationRepository {

  responseSchema = z.object({
    desc: z.string(),
    sapCode: z.string(),
    value: z.number()
  }).array()

  optimizationData: ScriptProps[] = []

  async execute(products: ProductionScript['products']) {

    for (const product of products) {

      if (product.dailyDemand == 0) {
        continue
      }

      this.optimizationData.push({
        description: product.description,
        sapCode: product.sapCode,
        line: product.line,
        demand: product.dailyDemand,
        stock: product.currentStock
      })
    }

    const optimizationDataStr = JSON.stringify(this.optimizationData)

    const row = await PythonShell.run('optimization.py', {
      mode: 'text',
      pythonPath: process.env.PYTHON_PATH,
      pythonOptions: ['-u'],
      scriptPath: process.env.SCRIPT_PATH,
      args: [optimizationDataStr, '1']
    })

    const response = this.responseSchema.parse(JSON.parse(row.join('\n')))

    return response
  }

}
