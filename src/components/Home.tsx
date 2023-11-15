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
  forgeTxn,
  sendLsigTxn,
} from "../Algorand";
import { LogicSig } from "algosdk";

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
  const [lsig, setLsig] = useState<LogicSig>();
  const [algorandAddress, setAlgorandAddress] = useState<string>();

  useEffect(() => {
    window.process = { ...window.process };
  }, []);

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
  function hexToUint8Array(hex_data: string): Uint8Array | null {
    // Check if the hexadecimal string has an even length
    if (hex_data.length % 2 !== 0) {
      console.error("Invalid hexadecimal string length");
      return null;
    }

    try {
      // Use a regular expression to split the string into pairs of two characters
      const pairs = hex_data.match(/.{1,2}/g);

      // Check if pairs is not null
      if (pairs === null) {
        console.error("Error splitting the hexadecimal string");
        return null;
      }

      // Convert each pair to a byte and create a Uint8Array
      const uint8Array = new Uint8Array(
        pairs.map((byte) => parseInt(byte, 16))
      );

      return uint8Array;
    } catch (error) {
      console.error("Error converting hexadecimal string to Uint8Array", error);
      return null;
    }
  }

  const verifyEd25519Signature = (
    message: Uint8Array,
    signature: string,
    publicKey: string | undefined
  ) => {
    const signatureData = hexToUint8Array(signature) ?? new Uint8Array();
    const publicKeyData = hexToUint8Array(publicKey!) ?? new Uint8Array();
    return nacl.sign.detached.verify(message, signatureData, publicKeyData);
  };

  const signMessage = async (dataInput: Uint8Array) => {
    const data_uint8array = new Uint8Array(dataInput); // or with input
    console.log("Original txid in uint8array: " + data_uint8array);

    const data_uint8array_to_hex = Buffer.from(data_uint8array).toString("hex");
    console.log("Txid in hex: " + data_uint8array_to_hex);

    const uint8array_encoded = new TextEncoder().encode(data_uint8array_to_hex);
    console.log(
      "Txid encoded in uint8array with TextEncoder().encode : " +
        uint8array_encoded
    );

    const { signature } = await provider!.signMessage(
      uint8array_encoded,
      "utf8"
    );
    const signature_hex = Buffer.from(signature).toString("hex");
    console.log("Signature in hex: " + signature_hex);

    const result = verifyEd25519Signature(
      uint8array_encoded,
      signature_hex,
      hexKey
    );
    console.log("verifyEd25519Signature: " + result);

    const signature_uint8 = hexToUint8Array(signature_hex);

    return { signature_uint8, uint8array_encoded };
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {provider && provider.publicKey ? (
        <div>Wallet address: {provider.publicKey?.toBase58()}.</div>
      ) : null}
      <MainPageContainer>
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
            console.log(hexKey);
            const lsig = await createLogicSignatureEd25519(hexKey);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setLsig((v) => (v = lsig));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setAlgorandAddress((v) => (v = lsig.address()));
            console.log(lsig);
            console.log(lsig.address());
          }}
        />
        <MButton
          text="Fund Account"
          onClick={async () => {
            console.log(lsig);
            await initOperation(lsig).catch((err) => console.log(err));
          }}
        />
        <MButton
          text="Make Transaction"
          onClick={async () => {
            console.log(lsig);
            const smartSigTxn = await forgeTxn(lsig!);
            const { signature_uint8, uint8array_encoded } = await signMessage(
              smartSigTxn.rawTxID()
            );
            console.log(
              await sendLsigTxn(
                lsig!,
                signature_uint8!,
                uint8array_encoded,
                smartSigTxn
              )
            );
          }}
        />
      </MainPageContainer>
    </div>
  );
}

export default Home;
