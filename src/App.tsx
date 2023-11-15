import "./App.css";
import { MetaMaskProvider } from "@metamask/sdk-react";
import MButton from "./components/MButton";
import { useEffect, useState } from "react";
import algosdk, { Account } from "algosdk";
import { createAlice, connectToMetamask, createLogicSign, giveFoundLogicSign, create_sign_transaction } from "./Metamask";

function App() {

  const [alice, setAlice] = useState<Account | undefined>(undefined);
  const [account, setMyAccount] = useState<string | undefined>(undefined);
  const [logicSign, setLogicSign] = useState<algosdk.LogicSig | undefined>(undefined);
  const [privateKey, setPrivateKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    window.process = { ...window.process };
  }, []);

  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        logging: {
          developerMode: false,
        },
        checkInstallationImmediately: false, // This will automatically connect to MetaMask on page load
        dappMetadata: {
          name: "Demo React App",
          url: window.location.host,
        },
      }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          height: "100px",
        }}>
        <MButton text='Create Alice' 
          onClick={async() => setAlice(await createAlice())}
        />
        <MButton text='Connect Metamask' 
          onClick={async() => setMyAccount(await connectToMetamask(window.ethereum))}
        />
        <MButton text='Create logic Sign' onClick={async() => {
          if (account===undefined) alert('Non sei connesso!');
          else {
            const result: {logicSign: algosdk.LogicSig, privateKey: string} = await createLogicSign(window.ethereum, account);
            setLogicSign(result.logicSign)
            setPrivateKey(result.privateKey)
          }
        }}/>
        <MButton text='Give found to logic Sign' onClick={async() => {
          if (alice===undefined) alert('Serve un account alice');
          else if (logicSign===undefined) alert('Bisogna creare la logic Signature prima')
          else await giveFoundLogicSign(alice, logicSign);
        }}/>
        <MButton text='Create Transaction' onClick={async() => {
          if (alice===undefined) alert('Serve un account alice');
          else if (logicSign===undefined) alert('Bisogna creare la logic Signature prima')
          else if (privateKey===undefined) alert('La chiave privata non è stata estratta correttamente, riprova a creare la Logic Signature')
          else await create_sign_transaction(alice, logicSign, privateKey);
        }}/>
      </div>
    </MetaMaskProvider>
  );
}

/*
connectToMetamask,
createLogicSign,
giveFoundLogicSign,
create_sign_transaction*/

export default App;
