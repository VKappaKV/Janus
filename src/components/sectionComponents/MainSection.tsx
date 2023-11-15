import styled from "styled-components";
import WalletCard from "./WalletCard";
import { defaultAssets, defaultAlgorandAssets } from "../Defaults";
import AlgorandCard from "./AlgorandCard";
import { useState } from "react";
import MButton from "./MButton";

const MainSectionContainer = styled.div`
  height: 55%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 0;
  padding: 0.2rem;
`;

const SectionDiagram = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`;

const SectionCard = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`;

defaultAssets;

function MainSection() {
  const [showWalletAlgorand, SetShowWalletAlgorand] = useState(false);
  return (
    <MainSectionContainer>
      {/* <SectionCard>
        {showWalletAlgorand ? (
          <WalletCard assets={defaultAlgorandAssets} /> //getBilance() della logicSign o di phantom
        ) : (
          <WalletCard assets={defaultAssets} /> //getBilance() del mio wallet
        )}<WalletCard assets={defaultAssets} />
      </SectionCard>
      <SectionDiagram>
        
      </SectionDiagram> */}
      <AlgorandCard />
    </MainSectionContainer>
  );
}

export default MainSection;
