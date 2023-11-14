import styled from "styled-components";
import MButton from "./MButton";

const MainPageContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

import { useEffect, useState } from "react";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import nacl from "tweetnacl";
import { Buffer } from "buffer";
import {
  createLogicSignatureEd25519,
  getPKeyHexFromUint8Array,
  initOperation,
  sendLsigTxn,
} from "./Algorand";

type DisplayEncoding = "utf8" | "hex";
type PhantomEvent = "disconnect" | "connect";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  autoApprove: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (
    opts?: Partial<ConnectOpts>
  ) => Promise<{ publicKey: PublicKey; autoApprove: boolean }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

const getProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  window.open("https://phantom.app/", "_blank");
};

const NETWORK = clusterApiUrl("mainnet-beta");

function Home() {
  return (
    <MainPageContainer>
      <MButton text="Connect Wallet" />
      <MButton text="Create Logic Signature" />
      <MButton text="Fund Account" />
      <MButton text="Make Transaction" />
    </MainPageContainer>
  );
}

export default Home;
