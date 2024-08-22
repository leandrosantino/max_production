import { ProductionScript } from "@/domain/entities/ProductionScript";
import { DateTime } from "@/utils/DateTime";
import * as Collapsible from "@radix-ui/react-collapsible";
import { DoubleArrowRightIcon, DropdownMenuIcon } from "@radix-ui/react-icons";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';

interface PlanViewCollapsibleProps {
  data: ProductionScript;
  productionDate: string;
  sep: boolean
}

const CollapsibleRoot = styled(Collapsible.Root)`
  width: 100%;
`;

const CollapsibleTrigger = styled(Collapsible.Trigger)`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #a1a1a1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.4rem;
`;

const TriggerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 500;
  font-size: 1.4rem;
`;

const TriggerIcons = styled.span`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;
`;

const Table = styled.table`
  width: 100%;
  background-color: #f9fafb;
  border-radius: 0.4rem;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
`;

const TableHeader = styled.tr`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  gap: 0.4rem;
  align-items: center;
`;

const TableCell = styled.td<{ width?: string, state?: 'red'|'green'|'yellow' }>`
  width: ${(props) => props.width || 'auto'};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: .8rem;
  font-size: 1.4rem;
  ${p => p.state?'font-weight: 600;':''}
  &>div{
    width: 10px;
    height: 10px;
    border-radius: 100%;

    background-color: ${p => {
      switch(p.state){
        case('green'):
          return p.theme.colors.dark.green9
        case('yellow'):
          return p.theme.colors.dark.yellow9
        case('red'):
          return p.theme.colors.light.red11
        default:
          return ''
      }
    }};
  }
`;

const TableRow = styled.tr`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  gap: 0.4rem;
  align-items: center;
  &:hover {
    background-color: #e4e4e4;
    cursor: pointer;
  }
`;

export function PlanViewCollapsible({ data, productionDate, sep }: PlanViewCollapsibleProps) {
  const [open, setOpen] = useState(false);
  const now = DateTime.strDateToDateObj(productionDate);
  const navigate = useNavigate()

  const formatSetupTime = useCallback(
    (setupTime: number) => {
      return DateTime.fractionalTimeToDate(setupTime, now).toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    [now]
  );

  const getDayBySetupTime = useCallback(
    (setupTime: number) => {
      return DateTime.fractionalTimeToDate(setupTime, now).toLocaleString([], {
        day: '2-digit',
        month: '2-digit',
      });
    },
    [now]
  );

  const getTurnBySetupTime = useCallback(
    (setupTime: number) => {
      const setupTimeInDate = DateTime.fractionalTimeToDate(Number(setupTime.toFixed(2)), now);
      return DateTime.getTurnBtDate(setupTimeInDate);
    },
    [now]
  );

  function getCoverageState(value: number){
    if(value < 1) return 'red'
    if(value >= 1 && value <=2) return 'yellow'
    if(value > 2) return 'green'
  }

  function getByLines(products: typeof data.products){
    const lines:Record<string, typeof data.products> = {}
    products.forEach(product => {
      const line = ((product as any).line as string).split('-')[0]
      if(!lines[line]){
        lines[line] = []
      }
      lines[line].push(product)
    })
    console.log('sep')

    return Object.keys(lines).map(key => (
      <>
        <div style={ {marginTop: ".4rem", fontWeight: "500", fontSize: "1.4rem"} } >Linha: {key}</div>
        <hr style={ {marginBottom: ".8rem"} } />
        {lines[key].map((product, index) => product.coverage < 7 && dataRow(product, index))}
      </>
    ))
  }

  function dataRow(product: (typeof data.products)[number], index: number){
    return (
      <TableRow key={index} onClick={() => navigate('item/leandro')} >
      {/* <TableCell style={ {width: "4.5rem"} }>{getDayBySetupTime(product.setupTime)}</TableCell>
      <TableCell style={ {width: "4.5rem"} }>{getTurnBySetupTime(product.setupTime)}</TableCell>
      <TableCell style={ {width: "4.5rem"} }>{product.machineSlug}</TableCell>
      <TableCell style={ {flex: "1"} }>{formatSetupTime(product.setupTime)}</TableCell> */}
      <TableCell style={ {width: "40%", justifyContent: 'start'} }>{product.sapCode} -  {product.description}</TableCell>
      <TableCell state={getCoverageState(product.currentStockInDays)} style={ {flex: "1"} }>
        <div></div>
        {product.currentStockInDays?.toFixed(2)} d
      </TableCell>
      <TableCell style={ {flex: "1"} }>{product.currentStock} p</TableCell>
      <TableCell style={ {flex: "1"} }>{product.produced.toFixed(0)} p</TableCell>
      <TableCell style={ {flex: "1"} }>{product.consumed.toFixed(0)} p</TableCell>
      <TableCell style={ {flex: "1"} }>{product.initialStock} p</TableCell>
      <TableCell style={ {flex: "1", fontWeight: 600 } }>{product.dailyDemand.toFixed(0)} p</TableCell>
      <TableCell style={ {flex: "1"} }>{product.weekleyDemand} p</TableCell>
      <TableCell style={ {flex: "1", fontWeight: 600} }>{sep?product.opt:product.minLot} p</TableCell>
    </TableRow>
    )
  }

  return (
    <CollapsibleRoot open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        <TriggerContent>
          <DropdownMenuIcon width={20} height={20} className="text-blue-900" />
          <span>{data.ute}</span>
          {data.processDecription}
        </TriggerContent>
        <TriggerIcons>
          {/* {data.products[0]?.machineSlug}
          <DoubleArrowRightIcon width={20} height={20} className="text-blue-900" />
          {data.products[0]?.description}
          {data.products[0]?.minLot.toFixed(0)} p */}
          <DoubleArrowRightIcon width={20} height={20} className="text-blue-900" />
        </TriggerIcons>
      </CollapsibleTrigger>
      <Collapsible.Content>
        <Table style={ {gap: sep?"0":"0.4rem"} } >
          <thead>
            <TableHeader>
              {/* <th style={ {width: "4.5rem"} }>Dia</th>
              <th style={ {width: "4.5rem"} }>Turno</th>
              <th style={ {width: "4.5rem"} }>Máquina</th>
              <th style={ {flex: "1"} }>Setup</th> */}
              <th style={ {width: "40%", textAlign: 'start'} }>Descrição</th>
              <th style={ {flex: "1"} }>Cobertura</th>
              <th style={ {flex: "1"} }>Estoque Atual</th>
              <th style={ {flex: "1"} }>Produzido</th>
              <th style={ {flex: "1"} }>Consumido</th>
              <th style={ {flex: "1"} }>Estoque inicial</th>
              <th style={ {flex: "1"} }>Demanda Diária</th>
              <th style={ {flex: "1"} }>Demanda Total</th>
              <th style={ {flex: "1"} }>Sugestão de Planejamento</th>
            </TableHeader>
          </thead>
          <tbody>
            {
              sep
                ?getByLines(data.products)
                :data.products.map((product, index) => ( product.coverage < 7 && dataRow(product, index)))
            }
          </tbody>
        </Table>
      </Collapsible.Content>
    </CollapsibleRoot>
  );
};
//{product?.partNumber ? product.partNumber + ' -' : ''}
