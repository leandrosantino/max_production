import { PythonShell } from 'python-shell'
import { StockCountingRepository } from './stockCountingRepository';
import { ProductRepository } from './productRepository';
import { ElogCountingRepository } from './elogCountingRepository';


export class OptimizationRepository {

  repository: { desc: string, sapCode: string, value: number }[] = []

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly stockCountingRepository: StockCountingRepository,
    private readonly elogCountingRepository: ElogCountingRepository,

  ) { }

  async init(days: number) {

    type ScriptProps = {
      sapCode: string
      description: string
      line: string
      stock: number
      demand: number
    }

    const optimizationData: ScriptProps[] = []

    const products = await this.productRepository.findMany({
      type: 'finished'
    })

    for (const product of products) {

      let demand = this.elogCountingRepository.findByPartNumber(product.partNumber, days)?.total
      const stock = this.stockCountingRepository.findBySapCode(product.sapCode)?.amount

      if (!demand || !stock) {
        continue
      }

      demand = Math.floor(demand / days)

      if (demand == 0) {
        continue
      }

      optimizationData.push({
        description: product.description,
        sapCode: product.sapCode,
        line: product.line,
        demand,
        stock
      })
    }

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
