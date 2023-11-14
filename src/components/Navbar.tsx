import styled from "styled-components";
import NavbarLogo from "./navComponents/NavbarLogo";
import NavbarBtn from "./navComponents/NavbarBtn";

const NavbarContainer = styled.div`
  position: absolute;
  background-color: var(--c-primary);
  width: 100%;
  height: 12%;
  top: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  gap: 0.5rem;
  margin: 0;
  padding: 0.2rem 0.5rem;
`;

const NavbarElementLogo = styled.div`
  background-color: transparent;
  width: 25%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const NavbarElement2 = styled.div`
  background-color: transparent;
  height: 90%;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const NavbarElementBtn = styled.div<{ isMenuOpen: boolean }>`
  background-color: transparent;
  width: ${(props) => (props.isMenuOpen ? "30%" : "25%")};
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

interface NavbarProps {
  handleMenuToggle: () => void;
  isMenuOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ handleMenuToggle, isMenuOpen }) => {
  return (
    <NavbarContainer>
      <NavbarElementLogo>
        <NavbarLogo />
      </NavbarElementLogo>
      <NavbarElement2 />
      <NavbarElementBtn isMenuOpen={isMenuOpen}>
        <NavbarBtn handleMenuToggle={handleMenuToggle} />
      </NavbarElementBtn>
    </NavbarContainer>
  );
};

export default Navbar;
