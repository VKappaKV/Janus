import React, { createContext, useState, ReactNode } from "react";

interface WalletConnectionContextProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WalletConnectionContext = createContext<WalletConnectionContextProps | undefined>(
  undefined
);

interface WalletConnectionContextProviderProps {
  children: ReactNode;
}

export const WalletConnectionContextProvider: React.FC<WalletConnectionContextProviderProps> = ({
  children,
}) => {
  const [value, setValue] = useState(false);

  return (
    <WalletConnectionContext.Provider value={{ value, setValue }}>
      {children}
    </WalletConnectionContext.Provider>
  );
};
