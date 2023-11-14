import React from "react";
import styled from "styled-components";
import SidebarElement from "./SidebarElement";
import { IconCustomerSidebar, IconSettingsSidebar } from "../Icons";

const SectionContainer = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  gap: 0.5rem;
  margin: 0;
  padding: 0.5rem;
`;

interface BottomSectionProps {
  isHovered: boolean;
  hoveredElement: string;
  setHoveredElement: React.Dispatch<React.SetStateAction<string>>;
}

const BottomSection: React.FC<BottomSectionProps> = ({
  isHovered,
  hoveredElement,
  setHoveredElement,
}) => {
  return (
    <SectionContainer>
      <SidebarElement
        isDefaultHovered={hoveredElement === "SERVICE"}
        isHovered={isHovered}
        icon={<IconCustomerSidebar />}
        text="SERVICE"
        onMouseEnter={() => setHoveredElement("SERVICE")}
        setHoveredElement={setHoveredElement}
      />
      <SidebarElement
        isDefaultHovered={hoveredElement === "SETTINGS"}
        isHovered={isHovered}
        icon={<IconSettingsSidebar />}
        text="SETTINGS"
        onMouseEnter={() => setHoveredElement("SETTINGS")}
        setHoveredElement={setHoveredElement}
      />
    </SectionContainer>
  );
};

export default BottomSection;
