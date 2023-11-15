import "./App.css";
import Home from "./components/Home";
import { MetaMaskProvider } from "@metamask/sdk-react";

function App() {  
  return (  
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        checkInstallationImmediately: false, // This will automatically connect to MetaMask on page load
        dappMetadata: {
          name: "Demo React App",
          url: window.location.host,
        },
      }}>
        <Home />;
    </MetaMaskProvider>
  )
}

export default App;
