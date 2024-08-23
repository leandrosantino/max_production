import { api } from "@/view/query";
import React from "react";
import { useParams } from "react-router-dom";


export function ElogData() {

  const { id: partNumber, days } = useParams();

  const {data, isLoading} = api.productionPlanService.getElogData.query(partNumber, Number(days))

  console.log(data)

  return (
    <div>
      <h1>Detalhes do Item</h1>
        <p>param1: {days}</p>
        <p>param1: {partNumber}</p>
      {!isLoading&&<>
        <p>partNumber: {data.partNumber}</p>
        <p>Descrição: {data.description}</p>
        <p>Demanda Total: {data.total}</p>
        {data.demands?.map(({date, qunatity}) => (
          <p>{date.toLocaleDateString()} : {qunatity}</p>
        ))}
      </>}
    </div>
  );
}
