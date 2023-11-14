import styled from "styled-components";

const SidebarElementContainer = styled.div<{ isDefaultHovered: boolean }>`
  width: 100%;
  height: 3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  cursor: pointer;

  background-color: ${(props) =>
    props.isDefaultHovered ? "var(--c-primary)" : "transparent"};
  border-radius: ${(props) => (props.isDefaultHovered ? "0.5rem" : "0")};
  transition: all 300ms ease-in-out;

  &:hover {
    background-color: var(--c-primary);
    border-radius: 0.5rem;
    transition: all 300ms ease-in-out;
  }
`;

interface SidebarElementProps {
  icon: JSX.Element;
  text: string;
  isHovered: boolean;
  isDefaultHovered: boolean;
  onMouseEnter: React.SetStateAction<string>;
  setHoveredElement: React.Dispatch<React.SetStateAction<string>>;
}

const SidebarElement: React.FC<SidebarElementProps> = ({
  icon,
  text,
  isHovered,
  isDefaultHovered,
  onMouseEnter,
  setHoveredElement,
}) => {
  return (
    <SidebarElementContainer
      isDefaultHovered={isDefaultHovered}
      onMouseEnter={() => onMouseEnter}
      onMouseLeave={() => setHoveredElement("HOME")}
    >
      {icon}
      {isHovered && <p>{text}</p>}
    </SidebarElementContainer>
  );
};

export default SidebarElement;
