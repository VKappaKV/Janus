import styled from "styled-components";
import JanusTxt from "../../images/Janus.svg";

function NavbarLogo() {
  const NavbarLogoContainer = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0 12px;
  `;

  return (
    <NavbarLogoContainer>
      <img src={JanusTxt} alt="Janus" />
    </NavbarLogoContainer>
  );
}

export default NavbarLogo;
