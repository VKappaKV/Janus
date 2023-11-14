import { useEffect, useState } from "react";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import "./assets/stylesSolana.css";
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

export default function App() {
  const provider = getProvider();
  const [logs, setLogs] = useState<string[]>([]);
  const addLog = (log: string) => setLogs([...logs, log]);
  const connection = new Connection(NETWORK);
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
  if (!provider) {
    return <h2>Could not find a provider</h2>;
  }

  const initLsig = async (pk: string | undefined) => {
    const lsig = await createLogicSignatureEd25519(pk);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setLsig((v) => (v = lsig.address()));
    console.log(lsig);
    console.log(lsig.address());
    const smartSigTxn = await initOperation(lsig);
    const { signature_uint8, uint8array_encoded } = await signMessage(
      smartSigTxn.rawTxID()
    );
    await sendLsigTxn(lsig, signature_uint8, uint8array_encoded, smartSigTxn);
  };

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

  //requires Uint8Array parameters
  const verifyEd25519Signature = (
    message: Uint8Array,
    signature: string,
    publicKey: string | undefined
  ) => {
    const signatureData = hexToUint8Array(signature) ?? new Uint8Array();
    const publicKeyData = hexToUint8Array(publicKey) ?? new Uint8Array();
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

    const { signature } = await provider.signMessage(
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
    <div className="App">
      <h1>Solana Signer Sandbox</h1>
      <main>
        {provider && provider.publicKey ? (
          <>
            <div>Wallet address: {provider.publicKey?.toBase58()}.</div>
            <div>isConnected: {provider.isConnected ? "true" : "false"}.</div>
            <div>autoApprove: {provider.autoApprove ? "true" : "false"}. </div>
            <button onClick={() => initLsig(hexKey)}>Crea Lsig</button>
            <button>Firma Txn</button>
            <button
              onClick={async () => {
                try {
                  const res = await provider.disconnect();
                  addLog(JSON.stringify(res));
                } catch (err) {
                  console.warn(err);
                  addLog("Error: " + JSON.stringify(err));
                }
              }}
            >
              Disconnect
            </button>
          </>
        ) : (
          <>
            <button
              onClick={async () => {
                try {
                  const res = await provider.connect();
                  addLog(JSON.stringify(res));
                } catch (err) {
                  console.warn(err);
                  addLog("Error: " + JSON.stringify(err));
                }
              }}
            >
              Connect to Phantom
            </button>
          </>
        )}
        <hr />
        <div className="logs">
          {logs.map((log, i) => (
            <div className="log" key={i}>
              {log}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
