import React, { createContext, useState, ReactNode } from "react";

interface WalletContextProps {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WalletContext = createContext<WalletContextProps | undefined>(
  undefined
);

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: React.FC<WalletContextProviderProps> = ({
  children,
}) => {
  const [value, setValue] = useState(false);

  return (
    <WalletContext.Provider value={{ value, setValue }}>
      {children}
    </WalletContext.Provider>
  );
};
