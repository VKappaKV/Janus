import algosdk from "algosdk";
import { Buffer } from "buffer";
import { ed25519 } from "@noble/curves/ed25519";
import sha3 from "js-sha3";
import {
  fundLsig,
  createLsigTrx,
  sendTrx,
  createLogicSignatureEd25519,
  createAccount,
} from "./Algorand";
import Web3 from "web3";
import {
  ConnectionToast,
  TransactionToast,
} from "./components/navComponents/WalletMenu";
import { truncateAndDotify } from "./components/utility";

async function createAlice() {
  console.log(">> POPULATING LOCAL NET WITH ACCOUNT ALICE (JUST FOR LOCALNET)");
  const alice = await createAccount(10);

  return alice;
}

async function connectToMetamask() {
  try {
    if (!window.ethereum) throw new Error(">> No window.etehrum");

    console.log(">> CONNCTING METAMASK");
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

async function getBalanceEth (){
  if (!window.ethereum) throw new Error(">> No window.etehrum");

  const account = await (connectToMetamask());
  if (account === undefined) throw new Error(">> Undefined account value");

  const web3 = new Web3(window.ethereum);

  // Get the balance using PromiEvent
  const balancePromise = await web3.eth.getBalance(account);
  const balanceEth = web3.utils.fromWei(balancePromise, 'ether');
  const balance=parseInt(balanceEth.replace('.',''))
  console.log(balance)
  return balance
}

async function createLogicSign() {
  try {
    const account = await connectToMetamask();
    if (account === undefined) throw new Error(">> Undefined account value");

    console.log(">> GENERATING KEYPAIR");
    const message =
      "!! WARNING !! : singning this message you allow this dapp to use your LogicSignature on Algorand";
    const privateKey = sha3.keccak256(await signMessage(account, message));
    const publicKey = ed25519.getPublicKey(privateKey);

    console.log(">> CREATING LOGIC SIGNATURE");
    const logicSign = await createLogicSignatureEd25519(
      Buffer.from(publicKey).toString("hex")
    );
    if (logicSign === undefined)
      throw new Error(">> logic Signature is undefined");

    ConnectionToast.fire({
      icon: "success",
      title: `Created Logic Signature ${truncateAndDotify(
        logicSign.address()
      )}`,
    });

    return { logicSign, privateKey, account };
  } catch (error) {
    throw new Error(">> Error creation logic Signature : " + error);
  }
}

async function signMessage(account: string, message: string) {
  try {
    if (!window.ethereum) throw new Error(">> No window.etehrum");
    const web3 = new Web3(window.ethereum);

    let signature: string | undefined = await web3.eth.personal.sign(
      message,
      account,
      ""
    );
    console.log(">> The signature hex value without 0x is : " + signature);

    if (signature.includes("0x")) signature = signature.replace("0x", "");

    if (signature === undefined) throw new Error(">> Undefined signature");

    return signature;
  } catch (error) {
    throw new Error(">> Error signing the message : " + error);
  }
}

async function giveFoundLogicSign(logicSign: algosdk.LogicSig) {
  try {
    const from = await createAlice();

    console.log(
      ">> BRINGING FUNDS FROM ALICE TO THE LOGIC SIGNATURE (JUST FOR LOCALNET)"
    );
    const information = await fundLsig(from, logicSign, 1e6);

    TransactionToast.fire({
      icon: "success",
      title: `Account ${truncateAndDotify(
        logicSign.address()
      )} Funded: ${JSON.stringify(
        information
      )} \n CHECK TRANSACTION ON DAPPFLOW`,
    });

    return from;
  } catch (error) {
    throw new Error(">> Error give found to logic Signature : " + error);
  }
}

async function create_sign_transaction(
  from: algosdk.Account,
  logicSign: algosdk.LogicSig,
  privateKey: string
) {
  try {
    console.log(
      ">> CREATING A TRANSACTION FROM LOGIC SIGNATURE TO ALICE MOVING 100000 MICROALGOs"
    );
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

    TransactionToast.fire({
      icon: "success",
      title: `Account ${truncateAndDotify(
        logicSign.address()
      )} Funded: ${JSON.stringify(trx)} \n CHECK TRANSACTION ON DAPPFLOW`,
    });

    return trx;
  } catch (error) {
    throw new Error(">> Error creating and signing the transaction : " + error);
  }
}

export {
  createAlice,
  connectToMetamask,
  getBalanceEth,
  createLogicSign,
  giveFoundLogicSign,
  create_sign_transaction,
};
