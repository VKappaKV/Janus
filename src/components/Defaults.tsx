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
    balance: 1.234,
    dollarValue: 10000.0,
  },
  {
    icon: (
      <IconWalletSidebar
        fill="var(--c-secondary)"
        height="1.4rem"
        width="1.4rem"
      />
    ),
    name: "PHANTOM",
    balance: 10.567,
    dollarValue: 1000.0,
  },
];

export const defaultAssets = [
  {
    icon: <IconCoins fill="black" />,
    name: "BTC",
    balance: 1.234,
    dollarValue: 10000.0,
  },
  {
    icon: <IconCoins fill="black" />,
    name: "ETH",
    balance: 10.567,
    dollarValue: 1000.0,
  },
  {
    icon: <IconCoins fill="black" />,
    name: "LTC",
    balance: 100.89,
    dollarValue: 100.0,
  },
  {
    icon: <IconCoins fill="black" />,
    name: "XRP",
    balance: 1000.123,
    dollarValue: 10.0,
  },
];

export const defaultAlgorandAssets = [
  {
    icon: <IconCoins fill="black" />,
    name: "ALGO",
    balance: 1.234,
    dollarValue: 10000.0,
  },
  {
    icon: <IconCoins fill="black" />,
    name: "USDC",
    balance: 10.567,
    dollarValue: 1000.0,
  },
  {
    icon: <IconCoins fill="black" />,
    name: "wETH",
    balance: 100.89,
    dollarValue: 100.0,
  },
  {
    icon: <IconCoins fill="black" />,
    name: "wBTC",
    balance: 1000.123,
    dollarValue: 10.0,
  },
];
