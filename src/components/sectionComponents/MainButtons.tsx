import styled from "styled-components";
import { IconCoins, IconBankTransfer, IconSwapWallet } from "../Icons";
import MButton from "./MButton";

const MainButtonsContainer = styled.div`
  height: 30%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 8rem;
  box-sizing: border-box;
  margin: 0;
  padding: 2rem;
`;

function MainButtons() {
  return (
    <MainButtonsContainer>
      <MButton icon={<IconCoins />} text="Add Funds" />
      <MButton icon={<IconBankTransfer />} text="Send/Receive" />
      <MButton icon={<IconSwapWallet />} text="Bridge to Algorand" />
    </MainButtonsContainer>
  );
}

export default MainButtons;
