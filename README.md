# Prerequisites

- Metamask browser extension properly configurated
- Phantom browser extension properly configurated
- git
- npm 8.6+
- node 18+
- typescript 5.0.2+
- react 18.2+
- vite 4.4.5+
- openssl 3.0+
- Algokit 4.1
    - Python 3.10+
    - pip 23+
    - pipx 1.2.1+
    - Docker 20+
    - Docker compose 2.5+
- Algosdk 2.7+
- other dependencies defined in package.json

# Setup and run

Before installing this project you might be sure respect the above requirements. For convenience we invite you to go [here](https://github.com/algorandfoundation/algokit-cli) for instructions on how to install algokit

1. Clone Janus project:
```bash
git clone https://github.com/VKappaKV/Janus
```

2. Start algokit localnet:
```bash
algokit localnet start
```

3. Try single wallet integrations
```bash
git checkout Metamask   #To try the Metamask demo
git checkout Phantom    #To try the Phantom demo
```

4. Install dependencies
```bash
npm install
```

5. Run Janus
```bash
npm run dev
# open http://localhost:5173/ in your browser
```

# How to use it

Moving to the localhost URL **http://localhost:5173/**, a user inferface allows the user to :

- Connect a wallet (only Metamask and Phantom a.t.m.)
- Create a logic signature related to the connected wallet
- Provide funds to the logic signature
- Create and sign transactions to the Algorand network

# How it works

The project is composed by:

- **App.tsx**: Represents the main file which manage the wallet and Algorand connection.
- **Metamask.tsx**and **Phantom.tsx**: Implement the wallets SDK, this allows the DAPP to extract important information like keys and signatures and communicate with wallets.
- **Algorand.ts**: Make use of the algorand SDK to communicate with the Algorand network.

Focusing on **Algorand.ts**, it is mainly composed by Logic Signature creation functions, one for each encryption algorithm, the **ed25519** version is represented as follows.

```ts
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
```

The function takes an hex encoded public key **pk** as input, at first, the **0x** prefix is added to the public key string, then the code adds **hexAddress** to the Logic Signature Teal code stored in **smartSigSource**. Lastly, the Logic Signature is compiled and returned to the caller.
The Logic Signature creation for ECDSA **secp256k1** algorithm is represented as follows :

```ts
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
```

Similarly to the **ed25519** version, this function takes as input the hex encoded decompressed public key (splitted in **X and Y values**) and hard codes the 0x prefixed values into the Logic Signature. Finally it returns the compiled Logic signature teal code.

After the Logic Signature creation, a transaction is created from the Logic Signature to a chosen receiver.

```ts
const smartSigTnx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: lsig.address(),
    to: alice.addr,
    amount,
    suggestedParams: await suggestedParams(),
  });
```

Analyzing the the logic signature, we can notice that it is valid just if the arguments that takes in input is a valid Transaction ID signature for the hard coded public key. The transaction creation allows us to extract the Transaction ID and ask to the wallet to sign it returning the signature.
Lastly, the signature is added to the **smartSig's args** attribute as follows:

```ts
lsig.args = [Buffer.from(signature)];

const signedSmartSigTxn = algosdk.signLogicSigTransactionObject(
    smartSigTxn,
    lsig
);

await algod.sendRawTransaction(signedSmartSigTxn.blob).do();
```

Where **lsig** is the Logic Signature object. Finally, the transaction is sent to the Algorand network.
