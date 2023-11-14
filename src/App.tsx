import "./App.css";
import { MetaMaskProvider } from "@metamask/sdk-react";
import MButton from "./components/MButton";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    window.process = { ...window.process };
  }, []);
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          height: "100px",
        }}
      >
        <MButton text="Create Lsig" />
        <MButton text="Fund Lsig" />
        <MButton text="Sign Txn" />
      </div>
    </MetaMaskProvider>
  );
}

export default App;
