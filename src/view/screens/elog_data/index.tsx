import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { api } from "@/view/query";
import { ScreenContainer } from "@/view/components/containers/ScreenContainer";
import {ChevronLeft} from 'lucide-react'

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const Info = styled.p`
  font-size: 18px;
  margin: 5px 0;
`;

const DemandList = styled.div`
  margin-top: 15px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
`;

const DemandItem = styled.p`
  font-size: 16px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid #f0f0f0;

  &:nth-child(odd) {
    background-color: #f9f9f9;
  }
`;

const TotalDemand = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-top: 15px;
  color: #e74c3c;
`;

const BackButton = styled.button`
  width: 30px;
  height: 30px;
  font-size: 16px;
  color: #fff;
  background-color: #3498db;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  inset: 0;
  top: 1.4rem;
  left: 1.4rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #2980b9;
  }
`;

export function ElogData() {
  const { id: partNumber, days } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = api.productionPlanService.getElogData.query(partNumber, Number(days));

  return (
    <ScreenContainer>
      <Container>
        <BackButton onClick={() => navigate(-1)}>
          <ChevronLeft/>
        </BackButton>
        <Title>E-LOG</Title>
        {!isLoading && (
          <>
            <Info>{data.description}</Info>
            <Info>partnumber: {data.partNumber}</Info>
            <Info>Código SAP: {data.sapCode}</Info>
            <DemandList>
              {data.demands?.map(({ date, qunatity }, id) => (
                <DemandItem key={id}>
                  <span>{new Date(date).toLocaleDateString()}</span>
                  <span>{qunatity}</span>
                </DemandItem>
              ))}
            </DemandList>
            <TotalDemand>Demanda Total: {data.total}</TotalDemand>
          </>
        )}
      </Container>
    </ScreenContainer>
  );
}
