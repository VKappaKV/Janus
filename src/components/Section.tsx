import styled from "styled-components";
import MainTitle from "./sectionComponents/MainTitle";
import MainSection from "./sectionComponents/MainSection";
import MainButtons from "./sectionComponents/MainButtons";

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

function Main() {
  return (
    <MainContainer>
      <MainTitle WalletName="Wallet Name" />
      <MainSection/>
      <MainButtons />
    </MainContainer>
  );
}

export default Main;
