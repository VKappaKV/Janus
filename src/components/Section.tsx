import styled from "styled-components";
import MainTitle from "./sectionComponents/MainTitle";
import MainSection from "./sectionComponents/MainSection";
import MainButtons from "./sectionComponents/MainButtons";
import React, { useContext, useEffect, useState } from "react";
import { WalletConnectionContext } from "./WalletConnectionContext";
import MainButtonsPhantom from "./sectionComponents/MainButtonPhantom";

const MainContainer = styled.div`
  position: relative;
  height: 100%;
  width: 90%;
  top: 12%;
  left: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  margin: 0;
  padding: 0.2rem;
`;

function Section() {
  const { value, setValue } = useContext(WalletConnectionContext);
  const [typeConnection, setConnection] = useState<string>(''); 

  const [ address, setAddress ] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      setConnection(value);
    };
    fetchBalance();
  }, [value]);

  return (
    <MainContainer>
    <MainTitle WalletName="Wallet Name" Address={address} />
      <MainSection/>
      {typeConnection == 'METAMASK' && <MainButtons setAddress={setAddress}/>}
      {typeConnection == 'PHANTOM' && <MainButtonsPhantom setAddress={setAddress}/>}
    </MainContainer>
  );
}

export default Section;


