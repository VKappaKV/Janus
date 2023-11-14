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
} from "../Algorand";

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

function Home() {
  const provider = getProvider();
  const [logs, setLogs] = useState<string[]>([]);
  const addLog = (log: string) => setLogs([...logs, log]);
  const [, setConnected] = useState<boolean>(false);
  const [hexKey, setHexKey] = useState<string>();
  const [lsig, setLsig] = useState<string>();
  useEffect(() => {
    if (provider) {
      provider.on("connect", () => {
        setConnected(true);
        addLog("Connected to wallet " + provider.publicKey?.toBase58());
        console.log(provider.publicKey?.toBytes());
        const hexValue = getPKeyHexFromUint8Array(
          provider.publicKey?.toBytes()
        );
        setHexKey((v) => (v = hexValue));
        console.log(hexValue);
      });
      provider.on("disconnect", () => {
        setConnected(false);
        addLog("Disconnected from wallet");
      });
      // try to eagerly connect
      provider.connect({ onlyIfTrusted: true });
      return () => {
        provider.disconnect();
      };
    }
  }, [provider]);

  return (
    <MainPageContainer>
      {provider && provider.publicKey ? (
        <div>Wallet address: {provider.publicKey?.toBase58()}.</div>
      ) : null}
      <MButton
        text="Connect Wallet"
        onClick={async () => {
          try {
            const res = await provider?.connect();
            addLog(JSON.stringify(res));
          } catch (err) {
            console.warn(err);
            addLog("Error: " + JSON.stringify(err));
          }
        }}
      />
      <MButton
        text="Create Logic Signature"
        onClick={async () => {
          const lsig = await createLogicSignatureEd25519(hexKey);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          setLsig((v) => (v = lsig.address()));
          console.log(lsig);
          console.log(lsig.address());
        }}
      />
      <MButton
        text="Fund Account"
        onClick={async () => {
          const sST = await initOperation(lsig).catch((err) =>
            console.log(err)
          );
        }}
      />
      <MButton text="Make Transaction" />
    </MainPageContainer>
  );
}

export default Home;
