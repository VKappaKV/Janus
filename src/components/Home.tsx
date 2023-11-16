import { useEffect, useState } from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Section from "./Section";
import Navbar from "./Navbar";
import WalletMenu from "./navComponents/WalletMenu";
import { WalletContextProvider } from "./WalletContext";
import { LsigContextProvider } from "./LsigContext";
import { WalletConnectionContextProvider } from "./WalletConnectionContext";

const MainPageContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const BodyContainer = styled.div`
    height: 100%;
    width: 100%;
    grow: 1;
    display: flex;
    margin: 0 0 0 0.25rem;
    padding 0;
`;

function Home() {
  // State hook to manage the open/close state of the menu.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu.
  const handleMenuToggle = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    window.process = { ...window.process };
  }, []);

  return (
    <WalletConnectionContextProvider>
      <WalletContextProvider>
        <LsigContextProvider>
          <MainPageContainer>
            <Navbar handleMenuToggle={handleMenuToggle} isMenuOpen={isMenuOpen} />{" "}
            {/* This function will run when the button is clicked. */}
            {isMenuOpen && <WalletMenu setIsMenuOpen={setIsMenuOpen} />}{" "}
            {/* This function will only run if isMenuOpen is true. */}
            <BodyContainer>
              <Sidebar />
              <Section />
            </BodyContainer>
          </MainPageContainer>
        </LsigContextProvider>
      </WalletContextProvider>
    </WalletConnectionContextProvider>
  );
}

export default Home;
