import { useQuery, useMutation } from "@tanstack/react-query"

export const api = {
    productionPlanService:{
        runProductionPlan: {
            query: (options: import("@/use-cases/production-planning-use-case/DataObjects").ProductionPlanningOptions) => {
                return useQuery({
                    queryKey: ['runProductionPlan', { options }] as const,
                    queryFn: ({queryKey}):Promise<import("@/domain/entities/ProductionScript").ProductionScript[]> => {
                        const [_, { options }] = queryKey
                        return window.app.invoke('runProductionPlan', options)
                    }
                })
            },
            invoke: async (options: import("@/use-cases/production-planning-use-case/DataObjects").ProductionPlanningOptions):Promise<import("@/domain/entities/ProductionScript").ProductionScript[]> => await window.app.invoke('runProductionPlan', options)
        },
                
    },

}