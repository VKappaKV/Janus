import styled from "styled-components";

const Button = styled.button`
  height: 2rem;
  width: 9rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-sizing: border-box;
  background-color: white;
  border-radius: 0.5rem;
  border: none;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin: 0;
  padding: 0;
  font-family: var(--f-montserrat);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--c-secondary);
  cursor: pointer;

  &:hover {
    background-color: var(--c-secondary);
    color: var(--c-primary);
  }

  &:hover > svg > path {
    fill: var(--c-primary);
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
`;

interface CardButtonProps {
  text: string;
  onClick: () => void; // Specify the type of the onClick prop function
}

const CardButton: React.FC<CardButtonProps> = ({ text, onClick }) => {
  return <Button onClick={onClick}>{text}</Button>;
};

export default CardButton;
