import { ProductionPlanService } from "@/services/ProductionPlanService";

export function servicesFactory() {

  return {
    productionPlanService: new ProductionPlanService()
  }
}
