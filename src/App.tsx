import "./App.css";
import Home from "./components/Home";
import { WalletContextProvider } from "./components/WalletContext";
import Provider from "./components/Provider";
import { MetaMaskProvider } from "@metamask/sdk-react";

function App() {
  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        logging: {
          developerMode: false,
        },
        checkInstallationImmediately: false, // This will automatically connect to MetaMask on page load
        dappMetadata: {
          name: "Demo React App",
          url: window.location.host,
        },
      }}
    >
      <Home />
    </MetaMaskProvider>
  );
}

export default App;
