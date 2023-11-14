import React, { ReactNode, useState, useContext } from "react";
import { WalletContext } from "./WalletContext";

interface ProviderProps {
  children: ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
  const { value } = useContext(WalletContext);

  if (value === 0) return { children };
  if (value === 1)
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
        {children}
      </MetaMaskProvider>
    );
};

export default Provider;
