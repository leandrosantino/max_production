import { JisDataRepository } from "@/repositories/JisDataRepository";
import { MachineRepository } from "@/repositories/machineRepository";
import { OptimizationRepository } from "@/repositories/optimizationRepository";
import { ProcessRepository } from "@/repositories/processRepository";
import { ProductRepository } from "@/repositories/productRepository";
import { ProductionCountDataRepository } from "@/repositories/productionCountData";
import { ProductionScriptRepository } from "@/repositories/productionScriptRepository";
import { ObjectUtils } from "@/utils/ObjectUtils";

export const productionScriptRepository = new ProductionScriptRepository()
export const analyticsService = new ObjectUtils()
export const jisDataRepository = new JisDataRepository()
export const productionCountDataRepository = new ProductionCountDataRepository()
export const processRepository = new ProcessRepository()
export const machineRepository = new MachineRepository()
export const productRepository = new ProductRepository()
