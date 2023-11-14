import * as algokit from "@algorandfoundation/algokit-utils";
import algosdk, { LogicSig, Transaction } from "algosdk";
import { Buffer } from "buffer";

const algod = algokit.getAlgoClient(algokit.getDefaultLocalNetConfig("algod"));

const createLogicSignatureEd25519 = async (pk: string | undefined) => {
  const hexAddress = `0x` + pk;
  const smartSigSource = `#pragma version 9 \n arg 1 \n arg 0 \n byte ${hexAddress} \n ed25519verify_bare`; //txn TxID
  const result = await algod.compile(Buffer.from(smartSigSource)).do();

  const b64program = result.result;

  const smartSig = new algosdk.LogicSig(
    new Uint8Array(Buffer.from(b64program, "base64"))
  );
  return smartSig;
};

const fundLsig = async (
  alice: algosdk.Account,
  lsig: LogicSig,
  suggestedParams: algosdk.SuggestedParams
) => {
  const fundSmartSigTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: alice.addr,
    to: lsig.address(),
    amount: 1e6,
    suggestedParams,
  });
  // Mettiamo Algo nella logic signature
  await algod.sendRawTransaction(fundSmartSigTxn.signTxn(alice.sk)).do();
  await algosdk.waitForConfirmation(
    algod,
    fundSmartSigTxn.txID().toString(),
    3
  );
  console.log(await algod.accountInformation(lsig.address()).do());
};

const getPKeyHexFromUint8Array = (uint8pk: Uint8Array | undefined) => {
  const key = uint8pk ?? new Uint8Array();
  return Buffer.from(key).toString("hex");
};

const initOperation = async (lsig: LogicSig) => {
  const mnemonic =
    "great purpose initial want current toast timber return situate execute shuffle clutch truth easy dog pause shift regular page mind suit swift actor absorb release";
  const alice = algosdk.mnemonicToSecretKey(mnemonic);

  const suggestedParams = await algod.getTransactionParams().do();

  const kmd = algokit.getAlgoKmdClient(algokit.getDefaultLocalNetConfig("kmd"));

  await algokit.ensureFunded(
    {
      accountToFund: alice.addr,
      minSpendingBalance: algokit.algos(10),
    },
    algod,
    kmd
  );

  await fundLsig(alice, lsig, suggestedParams);

  const smartSigTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: lsig.address(),
    to: alice.addr,
    amount: 0.1e6,
    suggestedParams,
  });

  return smartSigTxn;
};

const sendLsigTxn = async (
  lsig: LogicSig,
  signature: Uint8Array | undefined,
  signedMessage: Uint8Array | undefined,
  smartSigTxn: Transaction
) => {
  const arg1 = signature ?? new Uint8Array();
  const arg2 = signedMessage ?? new Uint8Array();
  lsig.args = [arg1, arg2];
  console.log("args: ", lsig.args);
  const signedSmartSigTxn = algosdk.signLogicSigTransactionObject(
    smartSigTxn,
    lsig
  );

  await algod.sendRawTransaction(signedSmartSigTxn.blob).do();
  await algosdk.waitForConfirmation(algod, signedSmartSigTxn.txID, 3);
  console.log(await algod.accountInformation(lsig.address()).do());
};

export {
  createLogicSignatureEd25519,
  getPKeyHexFromUint8Array,
  initOperation,
  sendLsigTxn,
};
