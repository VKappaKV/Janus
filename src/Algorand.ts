import * as algokit from "@algorandfoundation/algokit-utils";
import algosdk from "algosdk";
import { Buffer } from "buffer";

const algodToken = "a".repeat(64);
const algodServer = "http://localhost";
const algodPort = 4001;

//algokit localnet start, status, stop
const algod = new algosdk.Algodv2(algodToken, algodServer, algodPort);

const suggestedParams = async () => await algod.getTransactionParams().do();

const createAccount = async (amount: number) => {
  console.log(">> Creating account in localnet");
  const account = algosdk.generateAccount();
  const kmd = algokit.getAlgoKmdClient(algokit.getDefaultLocalNetConfig("kmd"));
  await algokit.ensureFunded(
    {
      accountToFund: account.addr,
      minSpendingBalance: algokit.algos(amount),
    },
    algod,
    kmd
  );
  console.log(">> Created acount, account address : " + account.addr);
  return account;
};

const createLogicSignatureSecp256k1 = async (pkX: string, pkY: string) => {
  console.log(">> Creating logic signature secp256k1");
  const hexAddressY = `0x${pkY}`;
  const hexAddressX = `0x${pkX}`;
  const smartSigSource = `#pragma version 9 \ntxn TxID \narg 0 \narg 1 \nbyte ${hexAddressX} \nbyte ${hexAddressY} \necdsa_verify Secp256k1`;
  console.log(smartSigSource);
  const result = await algod.compile(Buffer.from(smartSigSource)).do();
  const b64program = result.result;
  const smartSig = new algosdk.LogicSig(
    new Uint8Array(Buffer.from(b64program, "base64"))
  );
  console.log(
    ">> Created Logic Signature, the LogicSig is : " + JSON.stringify(smartSig)
  );
  return smartSig;
};

const createLogicSignatureEd25519 = async (pk: string) => {
  const hexAddress = `0x${pk}`;
  console.log(hexAddress);
  const smartSigSource = `#pragma version 9 \n txn TxID \narg 0 \n byte ${hexAddress} \n ed25519verify_bare`;
  const result = await algod.compile(Buffer.from(smartSigSource)).do();

  const b64program = result.result;

  const smartSig = new algosdk.LogicSig(
    new Uint8Array(Buffer.from(b64program, "base64"))
  );
  return smartSig;
};

const fundLsig = async (
  alice: algosdk.Account,
  lsig: algosdk.LogicSig,
  amount: number
) => {
  console.log(">> funding the Logic Signature");

  const fundSmartSigTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: alice.addr,
    to: lsig.address(),
    amount,
    suggestedParams: await suggestedParams(),
  });

  const { txId } = await algod
    .sendRawTransaction(fundSmartSigTxn.signTxn(alice.sk))
    .do();
  await algosdk.waitForConfirmation(
    algod,
    fundSmartSigTxn.txID().toString(),
    3
  );

  await algod.accountInformation(lsig.address()).do();
  console.log(">> Logic Signature is funded, the result is : " + { txId });
  return txId;
};

const createLsigTrx = async (
  alice: algosdk.Account,
  lsig: algosdk.LogicSig,
  amount: number
) => {
  console.log(">> Creating the transaction from Logic Signature");
  const smartSigTnx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: lsig.address(),
    to: alice.addr,
    amount,
    suggestedParams: await suggestedParams(),
  });

  const idToSign = smartSigTnx.rawTxID().toString("hex");

  console.log(
    ">> The transaction has been created values : ",
    Uint8Array.from(smartSigTnx.rawTxID()).length
  );
  console.log(">> TxID is : " + idToSign);
  console.log(">> The transaction object is : " + smartSigTnx);
  return { idToSign, smartSigTnx };
};

const sendTrx = async (
  signature: Uint8Array,
  smartSigTxn: algosdk.Transaction,
  lsig: algosdk.LogicSig
) => {
  console.log(
    ">> Signing the transaction with the Logic signature and sending it"
  );
  lsig.args = [Buffer.from(signature)]; //GUARDA QUI SE NON VA, ANCHE SE SAI CHE NON ANDRÀ

  console.log(">> The logic signature args are : ", lsig.args);
  console.log(smartSigTxn);

  const signedSmartSigTxn = algosdk.signLogicSigTransactionObject(
    smartSigTxn,
    lsig
  );

  console.log(
    ">> The transaction has been signed, the signed transaction is : " +
      signedSmartSigTxn
  );

  const sendTrx = await algod.sendRawTransaction(signedSmartSigTxn.blob).do();

  await algosdk.waitForConfirmation(algod, signedSmartSigTxn.txID, 10);
  return sendTrx;
};

export const acctInfo = async (account: string): Promise<number> => {
  const balance = await algod.accountInformation(account).do();
  console.log(balance);
  return balance.amount();
};
export {
  createAccount,
  createLogicSignatureSecp256k1,
  fundLsig,
  createLsigTrx,
  sendTrx,
  createLogicSignatureEd25519,
};
