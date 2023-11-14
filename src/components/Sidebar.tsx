import { useState } from "react";
import styled from "styled-components";
import TopSection from "./sidebarComponents/TopSection";
import BottomSection from "./sidebarComponents/BottomSection";

const SidebarContainer = styled.div`
  position: absolute;
  background-color: white;
  width: 10%;
  height: 88%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  gap: 0.5rem;
  margin: 0;
  padding: 0.2rem 0.1rem 0.1rem 0.2rem;
  left: 0;
  top: 12%;
  z-index: 1;

  &:hover {
    width: 15%;
    transition: all 300ms ease-in-out;
  }
`;

const SidebarIconContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  gap: 0.5rem;
  margin: 0;
  padding: 2rem 0;
`;

const SidebarHr = styled.hr`
  width: 0.5rem;
  height: 90%;
  background-color: var(--c-primary);
  border: none;
  margin: 0;
  padding: 0;
  border-radius: 0.5rem;
`;

function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredElement, setHoveredElement] = useState("HOME");

  return (
    <SidebarContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SidebarIconContainer>
        <TopSection
          isHovered={isHovered}
          hoveredElement={hoveredElement}
          setHoveredElement={setHoveredElement}
        />
        <BottomSection
          isHovered={isHovered}
          hoveredElement={hoveredElement}
          setHoveredElement={setHoveredElement}
        />
      </SidebarIconContainer>
      <SidebarHr />
    </SidebarContainer>
  );
}

export default Sidebar;
