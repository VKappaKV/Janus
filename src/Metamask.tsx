import algosdk from "algosdk";
import { stripHexPrefix } from "ethereumjs-util";
import { Buffer } from "buffer";
import { ed25519 } from "@noble/curves/ed25519";
import sha3 from "js-sha3";
import {
  fundLsig,
  createLsigTrx,
  sendTrx,
  createLogicSignatureEd25519,
} from "./Algorand";

/* DEFINISCO I TIPI PER LO STATO */

/*interface IInputFields {
  verify: boolean | undefined;
  message: string;
}*/

/* 
const [inputFields, setInputFields] = useState<IInputFields>({
  verify: false,
  message: "Il tuo messaggio da firmare",
});

useEffect(() => {
  window.process = { ...window.process };
}, []); */

/* SET A NEW VALUE TO THE STATE */
/* const setValue = (key: string, value: any) => {
  setInputFields((prevState) => ({
    ...prevState,
    [key]: value,
  }));
}; */


async function signMessage(ethereum: any, account: string, message: string) {
  try {
    const signature: string | undefined = stripHexPrefix(
      await ethereum.personal.sign(message, account, "")
    );
    console.log(">> The signature hex value without 0x is : " + signature);

    if (signature === undefined) throw new Error(">> Undefined signature");

    return signature;
  } catch (error) {
    throw new Error(">> Error signing the message : " + error);
  }
}

async function connectToMetamask( ethereum: any ) {
  try {
    console.log(">> CONNCTING METAMASK");
    if (!ethereum) throw new Error(">> No window.etehrum");

    let accounts: string | any;
    // eslint-disable-next-line prefer-const
    accounts = await ethereum.request({
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

async function createLogicSign( ethereum: any, account: string ) {
  try {
    console.log(">> GENERATING KEYPAIR");
    const message = "!! WARNING !! : singning this message you allow this dapp to use your LogicSignature on Algorand";
    const privateKey = sha3.keccak256(await signMessage(ethereum, account, message));
    const publicKey = ed25519.getPublicKey(privateKey);

    console.log(">> CREATING LOGIC SIGNATURE");
    const logicSign = await createLogicSignatureEd25519(
      Buffer.from(publicKey).toString("hex")
    );
    if (logicSign === undefined)
      throw new Error(">> logic Signature is undefined");

    return logicSign
  } catch (error) {
    throw new Error(">> Error creation logic Signature : " + error);
  }
}

async function giveFoundLogicSign(from: algosdk.Account, logicSign: algosdk.LogicSig) {
  try{
    console.log( ">> BRINGING FUNDS FROM ALICE TO THE LOGIC SIGNATURE (JUST FOR LOCALNET)" );
    await fundLsig(from, logicSign, 1e6)
  } catch (error) {
    throw new Error(">> Error give found to logic Signature : " + error);
  }
  
}

async function create_sign_transaction(from: algosdk.Account, logicSign: algosdk.LogicSig, privateKey: string) {
  try {
    console.log( ">> CREATING A TRANSACTION FROM LOGIC SIGNATURE TO ALICE MOVING 100000 MICROALGOs");
    const trxDetails: { idToSign: string; smartSigTnx: algosdk.Transaction } =
      await createLsigTrx(from, logicSign, 1e5);
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
    const trx = await sendTrx(txIdSignature, trxDetails.smartSigTnx, logicSign);
    
    return trx
  } catch (error) {
    throw new Error(">> Error creating and signing the transaction : " + error);
  }
}

export { 
  connectToMetamask,
  createLogicSign,
  giveFoundLogicSign,
  create_sign_transaction
};
