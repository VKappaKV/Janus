import styled from "styled-components";

const MainButton = styled.button`
  height: 40%;
  width: 15%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  box-sizing: border-box;
  border: 3px solid var(--c-secondary);
  border-radius: 0.5rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin: 0;
  padding: 0 0.5rem 0 0.5rem;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    background-color: var(--c-secondary);
  }

  &:hover > svg > path {
    fill: var(--c-primary);
  }

  &:hover > p {
    color: var(--c-primary);
  }

  &:focus {
    outline: none;
  }

  &:active {
    transform: translateY(4px);
  }

  &:active > svg > path {
    fill: var(--c-primary);
  }

  &:active > p {
    color: var(--c-primary);
  }
`;

const ButtonTxt = styled.p`
  font-family: var(--f-montserrat);
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-secondary);
  margin: 0;
  padding: 0;
`;

interface MButtonProps {
  icon: JSX.Element | undefined;
  text: string;
  onClick?: () => void;
}

const MButton: React.FC<MButtonProps> = ({ icon, text, onClick }) => {
  return (
    <MainButton onClick={onClick}>
      {icon ? icon : null}
      <ButtonTxt>{text}</ButtonTxt>
    </MainButton>
  );
};
export default MButton;
