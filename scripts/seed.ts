import { Machine } from "@/domain/entities/Machine";
import { Product } from "@/domain/entities/Product";
import { MachineRepository } from "@/repositories/machineRepository";
import { ProductRepository } from "@/repositories/productRepository";
import { ProcessRepository } from "@/repositories/processRepository";
import { XlsxProvider } from "@/providers/xlsxProvider";

import { database } from '../src/infra/database';

const machineRepository = new MachineRepository()
const productRepository = new ProductRepository()
const processRepository = new ProcessRepository()
const xlsxService = new XlsxProvider('D:/dev/max_production/prisma/products.xlsx')

const machines: Omit<Machine, 'processId' | 'id'>[] = [
  { slug: 'M01', ute: 'UTE-1' },
  { slug: 'M04', ute: 'UTE-1' },
  { slug: 'M15', ute: 'UTE-3' },
  { slug: 'M52', ute: 'UTE-3' },
  { slug: 'M19', ute: 'UTE-3' },
  { slug: 'M20', ute: 'UTE-3' },
  { slug: 'M21', ute: 'UTE-3' },
  { slug: 'M22A', ute: 'UTE-3' },
  { slug: 'M22B', ute: 'UTE-3' }
]

const products: Omit<Product, 'process' | 'id' | 'wip' | 'finisheds'>[] = []

const processes: Array<{
  description: string,
  type: 'wip' | 'finished',
  ute: string,
  machines: string[]
}> = [
    {
      description: 'Liberação do teto',
      type: 'finished',
      ute: 'UTE-3',
      machines: ['M22A', 'M22B', 'M21']
    },
    {
      description: 'Acoplagem do teto',
      type: 'wip',
      ute: 'UTE-3',
      machines: ['M19', 'M20']
    },
    {
      description: 'Substrato HEADLINER',
      type: 'wip',
      ute: 'UTE-3',
      machines: ['M15', 'M52']
    },
    {
      description: 'Placa de espuma HEADLINER',
      type: 'wip',
      ute: 'UTE-1',
      machines: ['M04']
    },
    {
      description: 'Bloco de espuma HEADLINER',
      type: 'wip',
      ute: 'UTE-1',
      machines: ['M01']
    },
  ]

  ; (async () => {
    await database.initialize()

    for (const machine of machines) {
      const createdMachine = await machineRepository.create(machine)
      console.log(createdMachine.slug)
    }

    const processIds: number[] = []
    let oldId = 0
    for (const process of processes) {
      const { machines, ...rest } = process
      const createdProcess = await processRepository.create({
        ...rest,
        parentId: oldId === 0 ? undefined : oldId
      }, machines)
      processIds.unshift(createdProcess.id)
      oldId = createdProcess.id
      console.log(createdProcess.description)
    }

    const sheetsData = xlsxService.read({ sheetName: 'products' })
    sheetsData.forEach(data => {
      products.push({
        description: data[0].toString(),
        project: data[2].toString(),
        cicleTime: Number(data[1]),
        partNumber: !data[4] ? undefined : data[4].toString(),
        sapCode: data[3].toString(),
        type: data[5] as 'wip' | 'finished',
        wipSapCode: !data[6] ? undefined : data[6].toString(),
        multiple: Number(data[7]),
        setupDurationInMinutes: Number(data[8]),
        quantityPerPackage: Number(data[9]),
        processId: processIds[Number(data[10]) - 1],
        line: data[11].toString()
        // initialStock: Number(data[11])
      })
    })


    for (const product of products) {
      const createdProduct = await productRepository.create(product)
      console.log(createdProduct.description)
    }

    const productsToMachinesConnetions = xlsxService.read({ sheetName: 'machines' })
    for (const connection of productsToMachinesConnetions) {
      console.log(connection[0], ' - ', connection[2])
      await productRepository.connectToMachineBySlug(connection[1].toString(), connection[2].toString())
    }

  })()

