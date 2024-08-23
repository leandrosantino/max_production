import { useQuery, useMutation } from "@tanstack/react-query"

export const api = {
    productionPlanService:{
        runProductionPlan: {
            query: (options: import("@/use-cases/production-planning-use-case/DataObjects").ProductionPlanningOptions) => {
                return useQuery({
                    queryKey: ['runProductionPlan', { options }] as const,
                    queryFn: ({queryKey}):Promise<{ script: import("@/domain/entities/ProductionScript").ProductionScript[]; elogDate: Date; }> => {
                        const [_, { options }] = queryKey
                        return window.app.invoke('runProductionPlan', options)
                    }
                })
            },
            invoke: async (options: import("@/use-cases/production-planning-use-case/DataObjects").ProductionPlanningOptions):Promise<{ script: import("@/domain/entities/ProductionScript").ProductionScript[]; elogDate: Date; }> => await window.app.invoke('runProductionPlan', options)
        },
                
        getElogData: {
            query: (partNumber: string, productiveDays: number) => {
                return useQuery({
                    queryKey: ['getElogData', { partNumber, productiveDays }] as const,
                    queryFn: ({queryKey}):Promise<import("@/domain/entities/ElogCounting").ElogCounting & { sapCode?: string; }> => {
                        const [_, { partNumber, productiveDays }] = queryKey
                        return window.app.invoke('getElogData', partNumber, productiveDays)
                    }
                })
            },
            invoke: async (partNumber: string, productiveDays: number):Promise<import("@/domain/entities/ElogCounting").ElogCounting & { sapCode?: string; }> => await window.app.invoke('getElogData', partNumber, productiveDays)
        },
                
    },

}