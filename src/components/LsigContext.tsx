import React, { createContext, useState, ReactNode } from "react";

interface LsigContextProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}

export const LsigContext = createContext<LsigContextProps | undefined>(
  undefined
);

interface LsigContextProviderProps {
  children: ReactNode;
}

export const LsigContextProvider: React.FC<LsigContextProviderProps> = ({
  children,
}) => {
  const [address, setAddress] = useState("");

  return (
    <LsigContext.Provider value={{ address, setAddress }}>
      {children}
    </LsigContext.Provider>
  );
};
