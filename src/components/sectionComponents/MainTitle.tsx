import styled from "styled-components";

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
  font-size: 2rem;
  font-weight: 800;
  color: black;
`;

interface MainTitleProps {
  WalletName: string;
}
const MainTitle: React.FC<MainTitleProps> = ({ WalletName }) => {
  return (
    <MainTitleContainer>
      <MainTitleText> {WalletName} </MainTitleText>
    </MainTitleContainer>
  );
};

export default MainTitle;
