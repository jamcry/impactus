import React from "react";
import {useEtherProvider} from "../EtherProviderContext";
import {Button, ButtonProps} from "@chakra-ui/react";

// if the user is not connected to a wallet, this button renders connect wallet button otherwise renders the children
interface WalletGuardButtonProps {
  children: React.ReactNode;
  connectWalletButtonProps?: Omit<ButtonProps, "onClick">;
}
function WalletGuardButton({children, connectWalletButtonProps}: WalletGuardButtonProps) {
  // if the user is not connected to a wallet, this button renders connect wallet button otherwise renders the children
  const {hasConnectedWallet, handleConnectWallet} = useEtherProvider();

  if (!hasConnectedWallet) {
    return (
      <Button
        onClick={handleConnectWallet}
        children={"Connect Wallet"}
        {...connectWalletButtonProps}
      />
    );
  }

  return <>{children}</>;
}

export default WalletGuardButton;
