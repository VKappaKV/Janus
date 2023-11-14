import styled from "styled-components";

const NavbarBtnContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0 24px;
  box-sizing: border-box;
`;

const StyledNavbarBtn = styled.button`
  background-color: var(--c-secondary);
  border: none;
  border-radius: 8px;
  color: var(--c-white);
  font-family: var(--f-montserrat);
  font-size: 1.25rem;
  font-weight: 800;
  height: auto;
  width: auto;
  margin: 0;
  padding: 8px 16px;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;

  &:hover {
    background-color: white;
    color: var(--c-secondary);
  }

  &:active {
    transform: translateY(4px);
  }
`;

interface NavbarBtnProps {
  handleMenuToggle: /* React.Dispatch<React.SetStateAction<boolean>> */ () => void;
}

// This component is a button that will open the wallet menu when clicked.
const NavbarBtn: React.FC<NavbarBtnProps> = ({ handleMenuToggle }) => {
  function menuInteraction() {
    handleMenuToggle();
  }
  return (
    <NavbarBtnContainer>
      <StyledNavbarBtn onClick={menuInteraction}>
        Sync your Wallet
      </StyledNavbarBtn>
    </NavbarBtnContainer>
  );
};

export default NavbarBtn;
