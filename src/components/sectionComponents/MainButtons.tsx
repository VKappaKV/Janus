import styled from "styled-components";
import {
  IconCoins,
  IconBankTransfer,
  IconSwapWallet,
  IconFileSignature,
} from "../Icons";
import MButton from "./MButton";
import {
  createLogicSign,
  create_sign_transaction,
  giveFoundLogicSign,
} from "../../Metamask";
import { useState, useContext } from "react";
import algosdk, { Account } from "algosdk";
import { acctInfo } from "../../Algorand";
import { WalletContext } from "../WalletContext";
import { LsigContext } from "../LsigContext";

const MainButtonsContainer = styled.div`
  height: 30%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 8rem;
  box-sizing: border-box;
  margin: 0;
  padding: 2rem;
`;

function MainButtons() {
  const { setAddress } = useContext(LsigContext);
  const { value, setValue } = useContext(WalletContext);
  const [alice, setAlice] = useState<Account | undefined>(undefined);
  const [account, setMyAccount] = useState<string | undefined>(undefined);
  const [logicSign, setLogicSign] = useState<algosdk.LogicSig | undefined>(
    undefined
  );
  const [privateKey, setPrivateKey] = useState<string | undefined>(undefined);

  return (
    <MainButtonsContainer>
      <MButton
        icon={<IconFileSignature />}
        text="Create Logic Signature"
        onClick={async () => {
          const result: {
            logicSign: algosdk.LogicSig;
            privateKey: string;
            account: string;
          } = await createLogicSign();
          setLogicSign(result.logicSign);
          setPrivateKey(result.privateKey);
          setMyAccount(result.account);
          acctInfo(result.logicSign.address());
          setValue(!value);
          setAddress(result.logicSign.address());
        }}
      />
      <MButton
        icon={<IconCoins />}
        text="Fund Logic Signature"
        onClick={async () => {
          if (logicSign === undefined)
            alert("Bisogna creare la logic Signature prima");
          else {
            setAlice(await giveFoundLogicSign(logicSign));
            setValue(!value);
          }
        }}
      />
      <MButton
        icon={<IconSwapWallet />}
        text="Send Transaction"
        onClick={async () => {
          if (alice === undefined)
            alert("Serve un account alice, ridai i fondi alla transaction");
          else if (logicSign === undefined)
            alert("Bisogna creare la logic Signature prima");
          else if (privateKey === undefined)
            alert(
              "La chiave privata non è stata estratta correttamente, riprova a creare la Logic Signature"
            );
          else {
            await create_sign_transaction(alice, logicSign, privateKey);
            setValue(!value);
          }
        }}
      />
    </MainButtonsContainer>
  );
}

export default MainButtons;
