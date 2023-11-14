import styled from "styled-components";
import SidebarElement from "./SidebarElement";
import {
  IconAccountSidebar,
  IconFinanceSidebar,
  IconHomeSidebar,
  IconWalletSidebar,
} from "../Icons";

const SectionContainer = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  gap: 0.5rem;
  margin: 0;
  padding: 0.5rem;
`;

interface TopSectionProps {
  isHovered: boolean;
  hoveredElement: string;
  setHoveredElement: React.Dispatch<React.SetStateAction<string>>;
}

const TopSection: React.FC<TopSectionProps> = ({
  isHovered,
  hoveredElement,
  setHoveredElement,
}) => {
  return (
    <SectionContainer>
      <SidebarElement
        isDefaultHovered={hoveredElement === "HOME"}
        isHovered={isHovered}
        icon={<IconHomeSidebar />}
        text="HOME"
        onMouseEnter={() => setHoveredElement("HOME")}
        setHoveredElement={setHoveredElement}
      />
      <SidebarElement
        isDefaultHovered={hoveredElement === "WALLET"}
        isHovered={isHovered}
        icon={<IconWalletSidebar />}
        text="WALLET"
        onMouseEnter={() => setHoveredElement("WALLET")}
        setHoveredElement={setHoveredElement}
      />
      <SidebarElement
        isDefaultHovered={hoveredElement === "FINANCE"}
        isHovered={isHovered}
        icon={<IconFinanceSidebar />}
        text="FINANCE"
        onMouseEnter={() => setHoveredElement("FINANCE")}
        setHoveredElement={setHoveredElement}
      />
      <SidebarElement
        isDefaultHovered={hoveredElement === "ACCOUNT"}
        isHovered={isHovered}
        icon={<IconAccountSidebar />}
        text="ACCOUNT"
        onMouseEnter={() => setHoveredElement("ACCOUNT")}
        setHoveredElement={setHoveredElement}
      />
    </SectionContainer>
  );
};

export default TopSection;
