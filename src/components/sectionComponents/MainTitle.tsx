import React, { useContext } from "react";
import styled from "styled-components";
import { LsigContext } from "../LsigContext";

const MainTitleContainer = styled.div`
  height: 10%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 0;
  padding: 2rem 2rem 0 2rem;
`;

const MainTitleText = styled.p`
  font-family: var(--f-montserrat);
  font-size: 1.5rem;
  font-weight: 700;
  color: black;
`;

function MainTitle() {
  const { address } = useContext(LsigContext);

  return (
    <MainTitleContainer>
      <MainTitleText>
        {address
          ? 'Address: ' + address.substring(0, 8) + '...' + address.substring(address.length - 8)
          : 'Waiting for Logic Signature...'
        }
      </MainTitleText>
    </MainTitleContainer>
  );
};

export default MainTitle;
