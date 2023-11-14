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

  const initLsig = async (pk) => {
    const lsig = await createLogicSignatureEd25519(pk);
    setLsig((v) => (v = lsig.address()));
    console.log(lsig);
    console.log(lsig.address());
    const smartSigTxn = await initOperation(lsig);
    const result = await signMessage(smartSigTxn.rawTxID());
    await sendLsigTxn(lsig, result[0], result[1], smartSigTxn);
  };

  function hexToUint8Array(hex_data) {
    return new Uint8Array(
      hex_data.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
  }

  //requires Uint8Array parameters
  const verifyEd25519Signature = (message, signature, publicKey) => {
    const signatureData = hexToUint8Array(signature);
    const publicKeyData = hexToUint8Array(publicKey);
    return nacl.sign.detached.verify(message, signatureData, publicKeyData);
  };

  const signMessage = async (dataInput) => {
    try {
      let data_uint8array = new Uint8Array([
        97, 54, 50, 57, 101, 101, 57, 99, 50, 50, 54, 98, 98, 101, 55, 51, 100,
        100, 99, 101, 101, 101, 101, 50, 49, 102, 54, 52, 98, 52, 51, 100, 102,
        55, 55, 55, 56, 56, 55, 55, 48, 54, 52, 48, 52, 54, 50, 99, 53, 55, 99,
        101, 53, 54, 57, 97, 56, 53, 56, 54, 54, 54, 56, 51,
      ]);
      data_uint8array = new Uint8Array(dataInput); // or with input
      console.log("Original txid in uint8array: " + data_uint8array);

      const data_uint8array_to_hex =
        Buffer.from(data_uint8array).toString("hex");
      console.log("Txid in hex: " + data_uint8array_to_hex);

      const uint8array_encoded = new TextEncoder().encode(
        data_uint8array_to_hex
      );
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

      return [hexToUint8Array(signature_hex), uint8array_encoded];
    } catch (err) {
      console.warn(err);
      addLog("Error: " + JSON.stringify(err));
    }
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
