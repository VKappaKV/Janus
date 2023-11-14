import React, { createContext, useState, ReactNode } from "react";

interface WalletContextProps {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
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
  const [value, setValue] = useState(0);

  return (
    <WalletContext.Provider value={{ value, setValue }}>
      {children}
    </WalletContext.Provider>
  );
};
