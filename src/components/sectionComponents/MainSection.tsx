import styled from "styled-components";
import WalletCard from "./WalletCard";
import { defaultAssets } from "../Defaults";
import AlgorandCard from "./AlgorandCard";

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

function MainSection() {
  return (
    <MainSectionContainer>
      <SectionCard>
        <WalletCard assets={defaultAssets} />
      </SectionCard>
      <SectionDiagram>
        <AlgorandCard />
      </SectionDiagram>
    </MainSectionContainer>
  );
}

export default MainSection;
