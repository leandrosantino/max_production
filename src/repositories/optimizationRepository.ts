import { PythonShell } from 'python-shell'
import { StockCountingRepository } from './stockCountingRepository';
import { ProductRepository } from './productRepository';
import { ElogCountingRepository } from './elogCountingRepository';

export class OptimizationRepository {

  repository: { sapCode: string, value: number }[] = []

  constructor(
    private readonly productRepository: ProductRepository
  ) { }

  async init(days: number, stockCountingRepository: StockCountingRepository, elogCountingRepository: ElogCountingRepository,) {

    type ScriptProps = {
      sapCode: string
      description: string
      line: string
      stock: number
      demand: number
    }

    const optimizationData: ScriptProps[] = []

    const products = await this.productRepository.findMany()

    products.forEach(product => {
      optimizationData.push({
        description: product.description,
        sapCode: product.sapCode,
        line: (product as any).line as string,
        demand: elogCountingRepository.findByPartNumber(product.partNumber, days).total,
        stock: stockCountingRepository.findBySapCode(product.sapCode).amount
      })
    })

    const optimizationDataStr = JSON.stringify(optimizationData)

    const resp = await PythonShell.run('optimization.py', {
      mode: 'text',
      pythonPath: process.env.PYTHON_PATH,
      pythonOptions: ['-u'], // get print results in real-time
      scriptPath: process.env.SCRIPT_PATH,
      args: [optimizationDataStr, '1']
    })

    this.repository = JSON.parse(resp.join('\n'))

  }

  findBySapCode(sapCode: string) {
    const findItem = this.repository.find(entry => entry.sapCode === sapCode)
    if (!findItem) {
      return null
    }
    return findItem
  }

}
