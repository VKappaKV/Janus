import styled from "styled-components";
import { AssetType } from "../Defaults";
import { WalletContext } from "../WalletContext";
import { useContext, useEffect, useState } from "react";
import { acctInfo } from "../../Algorand";
import { LsigContext } from "../LsigContext";
import { useSDK } from "@metamask/sdk-react";
import { getBalanceEth } from "../../Metamask";

const CardContainer = styled.div`
  height: 80%;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: var(--c-primary);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 1rem;
  margin: 0;
  padding: 1rem;
  gap: 1rem;
`;
/* 
const CardTxt = styled.p`
  font-family: var(--f-montserrat);
  font-size: 1rem;
  font-weight: 700;
  color: black;
`;

const CardTopSection = styled.div`
  height: 20%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 1.5rem;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`; */

const CardMiddleSectionContainer = styled.div`
  height: 80%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  border-radius: 1rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  gap: 1rem;
  margin: 0;
  padding: 0.5rem;
  overflow: auto;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(108, 143, 231, 0.7);
    border-radius: 10px;
  }
`;

const CardMiddleSection = styled.div`
  height: 4rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10rem;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`;

const CardMiddleLeft = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  & > h1 {
    font-family: var(--f-montserrat);
    font-size: 1.5rem;
    font-weight: 700;
    color: black;
  }
`;

const CardMiddleRight = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  & > h1 {
    font-family: var(--f-montserrat);
    font-size: 1.5rem;
    font-weight: 700;
    color: black;
    margin: 0;
    padding: 0;
  }

  & > h2 {
    font-family: var(--f-montserrat);
    font-size: 1rem;
    font-weight: 600;
    color: black;
    margin: 0;
    padding: 0;
  }
`;
/* 
const CardBottomSection = styled.div`
  height: 20%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`; */

interface WalletCardProps {
  assets: AssetType[];
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

const WalletCard: React.FC<WalletCardProps> = ({ assets }) => {
  const { address } = useContext(LsigContext);
  const { value } = useContext(WalletContext);
  const [showBalance, setShowBalance] = useState<number>(0);
  const [showETHBalance, setShowETHBalance] = useState<number>(10);

  const { connected } = useSDK();

  useEffect(() => {
    const fetchBalance = async () => {
      console.log(address, value)
      if (address) {
        const balance = await acctInfo(address);
        setShowBalance(balance);
      }
    };
    fetchBalance();
  }, [value]);

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getBalanceEth();
      setShowETHBalance(balance);
    };
    fetchBalance();
  }, [connected]);

  return (
    <CardContainer>
      <CardMiddleSectionContainer>
        {assets &&
          assets.map((asset, index) => (
            <CardMiddleSection key={index}>
              <CardMiddleLeft>
                <h1>{asset.icon}</h1>
                <h1>{asset.name}</h1>
              </CardMiddleLeft>
              <CardMiddleRight>
                <h1>{asset.name=='ALGO' ? showBalance.toLocaleString('it-IT'): 
                  showETHBalance.toLocaleString('it-IT')}</h1>
              </CardMiddleRight>
            </CardMiddleSection>
          ))}
      </CardMiddleSectionContainer>
    </CardContainer>
  );
};

export default WalletCard;
