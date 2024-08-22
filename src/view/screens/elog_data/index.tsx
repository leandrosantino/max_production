import React from "react";
import { useParams } from "react-router-dom";


export function ElogData() {

  const { id } = useParams();

  return (
    <div>
      <h1>Detalhes do Item</h1>
      <p>ID do Item: {id}</p>
    </div>
  );
}
