import styled from "styled-components";
import { Wallet, defaultWallets } from "../Defaults";
import { useSDK } from "@metamask/sdk-react";
import { connectToMetamask } from "../../Metamask";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { WalletConnectionContext } from "../WalletConnectionContext";

export const ConnectionToast = Swal.mixin({
  toast: true,
  width: "20rem",
  position: "center",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const TransactionToast = Swal.mixin({
  toast: true,
  width: 'max-content',
  heightAuto: false,
  position: "center",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

function fireConnectionToast(walletName: string) {
  ConnectionToast.fire({
    icon: "success",
    title: "Connected to " + walletName + "",
  });
}

const ErrorToast = Swal.mixin({
  toast: true,
  width: "20rem",
  position: "center",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

function fireErrorToast(message: string) {
  ErrorToast.fire({
    icon: "error",
    title: message,
  });
}

const MenuContainer = styled.div`
  position: absolute;
  top: 10%;
  right: 1.5%;
  height: 70%;
  width: 20%;
  background-color: white;
  border-radius: 28px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0% 4% 1.5% 4%;
  z-index: 2;
`;

const MenuTitle = styled.p`
  font-family: var(--font-open-sans);
  color: black;
  font-size: 1.25rem;
  font-weight: 700;
`;

const MenuInner = styled.div`
  height: 50%;
  width: 100%;
  background-color: var(--c-secondary);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  margin: 0;
  padding: 0;
`;

const MenuFooter = styled.div`
  height: 10%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5%;
  padding: 0;
`;

const InnerTitleContainer = styled.div`
  height: 20%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
`;

const InnerTitle = styled.p`
  font-family: var(--font-open-sans);
  font-size: 3rem;
  font-weight: 700;
  color: white;
`;

const InnerBodyContainerUp = styled.div`
  height: 10%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
`;

const InnerBodyContainerDown = styled.div`
  height: 20%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0 1rem;
`;

const InnerTxt = styled.p`
  font-family: var(--font-open-sans);
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0;
  padding: 0;
`;

const InnerBtnContainer = styled.div`
  height: 40%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
  margin: 0;
  padding: 1rem 0 0 0;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const InnerBtn = styled.button`
  height: 30%;
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  background-color: var(--c-primary);
  border-radius: 8px;
  border: none;
  color: var(--c-secondary);
  font-family: var(--font-open-sans);
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  padding: 0.2rem 2rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;

  &:hover {
    background-color: white;
  }

  &:hover > svg > path {
    fill: var(--c-secondary);
  }

  &:focus {
    outline: none;
  }

  &:active {
    transform: translateY(4px);
  }
`;

const FooterTxt = styled.p`
  color: black;
  font-family: var(--font-open-sans);
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  margin: 0;
  padding: 0;

  a {
    color: black;
    text-decoration: none;
    font-weight: 700;

    &:hover {
      color: var(--c-gray-700);
    }
  }
`;

interface WalletMenuProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WalletMenu: React.FC<WalletMenuProps> = () => {
  const [account, setAccount] = useState<string>();
  const { sdk, connected } = useSDK();
  const { value, setValue } = useContext(WalletConnectionContext);

  return (
    <MenuContainer>
      <MenuTitle>Select your wallet</MenuTitle>
      <MenuInner>
        <InnerTitleContainer>
          <InnerTitle>JANUS</InnerTitle>
        </InnerTitleContainer>
        <InnerBodyContainerUp>
          <InnerTxt>all in one</InnerTxt>
        </InnerBodyContainerUp>
        <InnerBtnContainer>
          {defaultWallets.map((wallet, index) => (
            <InnerBtn
              key={index}
              onClick={async () => {
                try {
                  if(wallet.name=='METAMASK'){
                    const account = await connectToMetamask();
                    setAccount(account);
                    fireConnectionToast(wallet.name);
                  } else {
                    const provider = getProvider()
                    await provider?.connect()
                    setAccount(provider.publicKey?.toBase58())
                    console.log('connect Phantom')
                  }
                  setValue(wallet.name)
                } catch (error) {
                  fireErrorToast("Failed to connect to wallet");
                }
              }}
            >
              {wallet.icon}
              {wallet.name}
            </InnerBtn>
          ))}
        </InnerBtnContainer>
        <InnerBodyContainerDown>
          <InnerTxt>We will add more wallets</InnerTxt>
          <InnerTxt>to the list soon</InnerTxt>
        </InnerBodyContainerDown>
      </MenuInner>
      <MenuFooter>
        <FooterTxt>
          More details on setting up your wallet clicking <a href="/">here</a>.
        </FooterTxt>
      </MenuFooter>
    </MenuContainer>
  );
};

export default WalletMenu;
