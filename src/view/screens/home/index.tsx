import { PlanViewCollapsible } from '@/view/screens/home/PlanViewCollapsible'
import { DateTime } from '@/utils/DateTime'
import React, { useState, startTransition, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { api } from '@/view/query'
import { ScreenContainer } from '@/view/components/containers/ScreenContainer'
import { ProductionScript } from '@/domain/entities/ProductionScript'
import {ResetIcon} from '@radix-ui/react-icons'

const Form = styled.form`
  width: 100%;
  max-width: 900px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: .8rem;
  font-size: 1.4rem;
  margin-bottom: 1.2rem;
`;

const FormField = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  width: 100%;
  min-height: fit-content;
  /* height: 6rem; */
`;

const Label = styled.label`
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: .4rem;
  border: 1px solid ${p => p.theme.colors.dark.gray5};;
  border-radius: .4rem;
  font-size: 1.4rem;
`;

const Select = styled.select`
  width: 100%;
  padding: .4rem;
  border: 1px solid ${p => p.theme.colors.dark.gray5};;
  border-radius: .4rem;
  font-size: 1.4rem;
`;

const Button = styled.button<{color?: 'reset'}>`
  padding: 0.4rem;
  border-radius: 0.4rem;
  font-weight: 500;
  font-size: 1.4rem;
  background-color: transparent;
  color: #1d4ed8;
  ${p => p.color === 'reset'?``:`
    border: 2px solid #1d4ed8;
    &:hover {
      background-color: #1d4ed8;
      color: white;
    }
  `}
`;

const Container = styled.div`
  width: 100%;
  /* max-width: 1400px; */
  height: calc(100vh - 200px);
  gap: 0.8rem;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
`;

const Spinner = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #d1d5db;
  border-top-color: #4b5563;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export function Home() {
  const now = new Date();
  const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const endsDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

  const [scripts, setScripts] = useState<ProductionScript[]>([]);
  const [productiveDays, setProductiveDays] = useState<number>(7);
  const [highRunner, setHighRunner] = useState<number>(productiveDays);
  const [lowRunner, setLowRunner] = useState<number>(productiveDays / 2);
  const [startProductionHour, setStartProductionHour] = useState<string>('06:10');

  const [startDate, setStartDate] = useState<string>(DateTime.dateObjToStrDate(startDay));
  const [endsDate, setEndsDate] = useState<string>(DateTime.dateObjToStrDate(endsDay));

  const [ute, setUte] = useState<string>('');

  const [isLoading, setLoading] = useState(false);

  const [elogDate, setElogDate] = useState('')

  useEffect(() => {
    // getProductionScript();
  }, []);

  const getProductionScript = useCallback(async () => {
    setLoading(true);

    const data = await api.productionPlanService.runProductionPlan.invoke({
      highRunner,
      lowRunner,
      productiveDays,
      startProductionHour: DateTime.timeStringToFractional(startProductionHour),
      ute,
      endsDate: endsDate,
      startDate: startDate,
      minLotCutoffPoint: 30
    });

    console.clear();
    setScripts(data.script);
    setElogDate(new Date(String(data.elogDate)).toLocaleDateString())
    setLoading(false);

  }, [highRunner, lowRunner, productiveDays, startProductionHour, endsDate, ute, startDate]);

  return (
    <ScreenContainer>
      <Form>
        <FormField>
          <Label>Data E-log</Label>
          <Input
            type="text"
            value={elogDate}
            disabled
          />
        </FormField>
        <FormField>
          <Label>Dias de Produção:</Label>
          <Input
            type="number"
            value={productiveDays}
            onChange={(e) => startTransition(() =>  setProductiveDays(Number(e.target.value)))}
          />
        </FormField>
        <FormField>
          <Label>De:</Label>
          <Input
            type="datetime-local"
            value={startDate}
            onChange={(e) => startTransition(() =>  setStartDate(e.target.value))}
          />
        </FormField>
        <FormField>
          <Label>Até:</Label>
          <Input
            type="datetime-local"
            value={endsDate}
            onChange={(e) => startTransition(() => setEndsDate(e.target.value))}
          />
        </FormField>
        <Button type="button" color='reset' onClick={() => {setStartDate(DateTime.dateObjToStrDate(startDay));setEndsDate(DateTime.dateObjToStrDate(endsDay))}}>
          <ResetIcon/>
        </Button>
        <Button type="button" onClick={() => getProductionScript()}>
          Atualizar
        </Button>
      </Form>
      <Container>
        {isLoading ? (
          <LoadingContainer>
            <span>Carregando...</span>
            <Spinner />
          </LoadingContainer>
        ) : (
          scripts.map((entry, index) => (
            <PlanViewCollapsible productionDate={endsDate} key={index} sep={index==0} data={entry} />
          ))
        )}
      </Container>
    </ScreenContainer>
  );
}
