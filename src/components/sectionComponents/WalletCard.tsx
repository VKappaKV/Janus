import React, { useState } from "react";
import styled from "styled-components";
import { IconBxsDownArrow } from "../Icons";
import CardButton from "./CardButton";

const CardContainer = styled.div`
  height: 80%;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: var(--c-primary);
  border-radius: 1rem;
  margin: 0;
  padding: 1rem;
  gap: 1rem;
`;

const CardTxt = styled.p`
  font-family: var(--f-montserrat);
  font-size: 1rem;
  font-weight: 700;
  color: black;
`;

const CardTopSection = styled.div`
  height: 20%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 1.5rem;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`;

const CardMiddleSectionContainer = styled.div`
  background-color: #e1f3ff;
  height: 80%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  border-radius: 1rem;
  gap: 1rem;
  margin: 0;
  padding: 0.5rem 0 0.5rem 0;
  overflow: auto;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: visible;
  }
`;

const CardMiddleSection = styled.div`
  height: 4rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10rem;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`;

const CardMiddleLeft = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  & > h1 {
    font-family: var(--f-montserrat);
    font-size: 1.5rem;
    font-weight: 700;
    color: black;
  }
`;

const CardMiddleRight = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  & > h1 {
    font-family: var(--f-montserrat);
    font-size: 1.5rem;
    font-weight: 700;
    color: black;
    margin: 0;
    padding: 0;
  }

  & > h2 {
    font-family: var(--f-montserrat);
    font-size: 1rem;
    font-weight: 600;
    color: black;
    margin: 0;
    padding: 0;
  }
`;

const CardBottomSection = styled.div`
  height: 20%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`;

function WalletCard({ assets }) {
  return (
    <CardContainer>
      <CardMiddleSectionContainer>
        {assets &&
          assets.map((asset, index) => (
            <CardMiddleSection key={index}>
              <CardMiddleLeft>
                <h1>{asset.icon}</h1>
                <h1>{asset.name}</h1>
              </CardMiddleLeft>
              <CardMiddleRight>
                <h1>{asset.balance}</h1>
                <h2>${(asset.balance * asset.dollarValue).toFixed(2)}</h2>
              </CardMiddleRight>
            </CardMiddleSection>
          ))}
      </CardMiddleSectionContainer>
    </CardContainer>
  );
}

export default WalletCard;
