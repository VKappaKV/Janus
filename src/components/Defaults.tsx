import { IconCoins, IconWalletSidebar } from "./Icons";

export const defaultWallets = [
  {
    icon: (
      <IconWalletSidebar
        fill="var(--c-secondary)"
        height="1.4rem"
        width="1.4rem"
      />
    ),
    name: "METAMASK",
  }  ,
  {
    icon: (
      <IconWalletSidebar
        fill="var(--c-secondary)"
        height="1.4rem"
        width="1.4rem"
      />
    ),
    name: "PHANTOM",
  }, ,
];

export interface Wallet {
  icon: JSX.Element;
  name: string;
}

export const defaultAssets = [
  {
    icon: <IconCoins fill="black" />,
    name: "BTC",
    balance: 1.234,
  },
  {
    icon: <IconCoins fill="black" />,
    name: "ETH",
    balance: 10.567,
  },
  {
    icon: <IconCoins fill="black" />,
    name: "LTC",
    balance: 100.89,
  },
  {
    icon: <IconCoins fill="black" />,
    name: "XRP",
    balance: 1000.123,
  },
];

export const defaultAlgorandAssets = [
  {
    icon: <IconCoins fill="black" />,
    name: "ALGO",
  },
  {
    icon: <IconCoins fill="black" />,
    name: "ETH",
  },
  {
    icon: <IconCoins fill="black" />,
    name: "SOL",
  },
];

export interface AssetType {
  icon: JSX.Element;
  name: string;
  balance: number;
}
