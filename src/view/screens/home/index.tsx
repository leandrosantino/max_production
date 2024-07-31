import React from "react";
import { ScreenContainer } from "@/view/components/containers/ScreenContainer";
import { api } from "@/view/query";

export function Home(){

  const {data, isSuccess} = api.productionPlanService.runProductionPlan.query({
    weekStartDate: '2024-07-31',
    date: '2024-07-31',
    highRunner: 3,
    lowRunner: 6,
    minLotCutoffPoint: 30,
    productiveDays: 6,
    startProductionHour: 6.15,
  })

  return (
    <ScreenContainer>

      <h2>DashBoard</h2>
      {isSuccess && data[0].products?.map(item => (<>
        <div key={item.id} >{item.description} - {item.consumed}</div>
      </>))}

    </ScreenContainer>
  )
}
