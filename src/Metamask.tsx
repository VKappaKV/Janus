import algosdk from "algosdk";
import { useEffect, useState } from "react";

import { Web3 } from "web3";
import { stripHexPrefix } from "ethereumjs-util";
import { Buffer } from "buffer";
import { ed25519 } from "@noble/curves/ed25519";
import sha3 from "js-sha3";

import {
  createAccount,
  createLogicSignatureSecp256k1,
  fundLsig,
  createLsigTrx,
  sendTrx,
  createLogicSignatureEd25519,
} from "./Algorand";

const web3 = new Web3(window.ethereum);

export default function App() {
  /* DEFINISCO I TIPI PER LO STATO */

  interface IInputFields {
    verify: boolean | undefined;
    message: string;
  }

  const [inputFields, setInputFields] = useState<IInputFields>({
    verify: false,
    message: "Il tuo messaggio da firmare",
  });

  useEffect(() => {
    window.process = { ...window.process };
  }, []);

  /* SET A NEW VALUE TO THE STATE */
  const setValue = (key: string, value: any) => {
    setInputFields((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const message =
    "!! WARNING !! : singning this message you allow this dapp to use your LogicSignature on Algorand";

  async function Todo() {
    try {
      console.log(
        ">> POPULATING LOCAL NET WITH ACCOUNT ALICE (JUST FOR LOCALNET)"
      );
      const alice = await createAccount(10);

      console.log(">> CONNCTING METAMASK");
      const account: string = await connectToMetamask();
      if (account === undefined) throw new Error(">> account is undefined");

      console.log(">> GENERATING KEYPAIR");
      const privateKey = sha3.keccak256(await signMessage(account, message));
      const publicKey = ed25519.getPublicKey(privateKey);

      console.log(">> CREATING LOGIC SIGNATURE");
      const logicSign = await createLogicSignatureEd25519(
        Buffer.from(publicKey).toString("hex")
      );
      if (logicSign === undefined)
        throw new Error(">> logic Signature is undefined");

      console.log(
        ">> BRINGING FUNDS FROM ALICE TO THE LOGIC SIGNATURE (JUST FOR LOCALNET)"
      );
      await fundLsig(alice, logicSign, 1e6);

      console.log(
        ">> CREATING A TRANSACTION FROM LOGIC SIGNATURE TO ALICE MOVING 100000 MICROALGOs"
      );
      const trxDetails: { idToSign: string; smartSigTnx: algosdk.Transaction } =
        await createLsigTrx(alice, logicSign, 1e5);
      if (trxDetails === undefined)
        throw new Error(">> idToSign and smartSigTnx undefined");

      console.log(">> SIGNING THE TRANSACTION ID");
      const txIdSignature: Uint8Array = ed25519.sign(
        trxDetails.idToSign,
        privateKey
      );
      if (txIdSignature === undefined)
        throw new Error(">> signature is undefined");

      console.log(">> PERFORMING THE TRANSACTION");
      await sendTrx(txIdSignature, trxDetails.smartSigTnx, logicSign).then(
        () => setValue("verify", "true"),
        () => setValue("verify", "false")
      );
    } catch (error) {
      console.error(">> Error in the TODO : ", error);
    }
  }

  async function connectToMetamask() {
    try {
      if (!window.ethereum) throw new Error(">> No window.etehrum");

      let accounts: string | any;
      // eslint-disable-next-line prefer-const
      accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts === undefined || accounts === null)
        //if the value is udefined it throws an exception
        throw new Error(">> Undefined account value");

      console.log(">> The conncected account is : " + accounts[0]);
      return accounts[0];
    } catch (error) {
      throw new Error(">> Error connceting to metamask : " + error);
    }
  }

  async function signMessage(account: string, message: string) {
    try {
      const signature: string | undefined = stripHexPrefix(
        await web3.eth.personal.sign(message, account, "")
      );
      console.log(">> The signature hex value without 0x is : " + signature);

      if (signature === undefined) throw new Error(">> Undefined signature");

      return signature;
    } catch (error) {
      throw new Error(">> Error signing the message : " + error);
    }
  }
}
