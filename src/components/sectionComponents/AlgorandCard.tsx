import { useState, useContext } from "react";
import MButton from "./MButton";
import WalletCard from "./WalletCard";
import { defaultAlgorandAssets } from "../Defaults";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MySwal = withReactContent(Swal);
const AlgorandCard = () => {
  //ho portato window fino a qui perchè poi servirà per estrarre informazioni sull'account con una funzione che metteremo in Metamask.tsx
  const [initCard, SetInitCard] = useState(false);
  if (!initCard)
    /*return (
      <MButton
        text=" Show Algorand Account"
        onClick={() => {
          SetInitCard(true);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Created Algorand Account",
            showConfirmButton: false,
            timer: 1000,
          });
        }}
        icon={undefined}
      />
    );
  else*/
    return <WalletCard assets={defaultAlgorandAssets} />;
};

export default AlgorandCard;
