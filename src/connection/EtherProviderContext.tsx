import {useToast} from "@chakra-ui/react";
import {ethers} from "ethers";
import {createContext, useState, useCallback, useEffect, useContext} from "react";
import {getErrorMessage} from "../util/errorUtils";

type ProviderState =
  | {
      status: "loading";
    }
  | {
      status: "connected";
      provider: ethers.providers.Web3Provider;
      // This is to prevent rendering the app before we have the account data
      // If we only rely on `status === "connected"`, we will render the app
      // before we have the account data (or we attempt to fetch it), and then we will have to re-render
      accountReady: boolean;
    }
  | {
      status: "ready";
      provider: ethers.providers.Web3Provider;
    }
  | {
      status: "not-detected";
    };

const EtherProviderContext = createContext<null | {
  providerState: ProviderState;
  errorMessage: string | null;
  defaultAccount: string | null;
  userBalance: string | null;
  network: ethers.providers.Network | null;
  handleConnectWallet: () => Promise<void>;
  handleAccountChange: VoidFunction;
  resetAccountData: VoidFunction;
}>(null);

export function useEtherProvider() {
  const context = useContext(EtherProviderContext);

  /**
   * We assume that this hook is used within a EtherProviderContextProvider,
   * and it won't be used before the provider is ready.
   */
  if (!context) {
    throw new Error(
      "useEtherProvider must be used within a EtherProviderContextProvider"
    );
  }

  return {
    ...context,
    hasConnectedWallet: !!context.defaultAccount,
    isEthMainnet: context.network?.name === "homestead"
  };
}

function EtherProviderContextProvider({children}: {children: React.ReactNode}) {
  const [providerState, setProviderState] = useState<ProviderState>({
    status: "loading"
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [defaultAccount, setDefaultAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<null | ethers.providers.Network>(null);
  const [userBalance, setUserBalance] = useState<string | null>(null);
  const hasConnectedWallet = !!defaultAccount;
  const toast = useToast();

  /**
   * refetches conntected account address, balance, and network, and
   * updates the state accordingly
   */
  const handleAccountChange = useCallback(async () => {
    if (providerState.status !== "connected") {
      return;
    }

    const {provider} = providerState;
    const newAccount = provider.getSigner();

    const network = await provider.getNetwork();

    const address = await newAccount.getAddress();
    setDefaultAccount(address);

    const balance = await newAccount.getBalance();
    setUserBalance(ethers.utils.formatEther(balance));

    setNetwork(network);

    await providerState.provider.getBalance(address, "latest");
  }, [providerState]);

  /**
   * Handle event listeners
   */
  useEffect(() => {
    function handleAccountsChanged(accounts: string[]) {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log("Please connect to MetaMask.");
      } else if (accounts[0] !== defaultAccount) {
        // If account has changed, reload the page
        window.location.reload();
      }
    }

    function handleChainChanged(newChainId: string) {
      // Reload is suggested by MetaMask docs: https://docs.metamask.io/wallet/reference/provider-api/#chainchanged
      window.location.reload();
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      window.ethereum.on("chainChanged", handleChainChanged);

      window.ethereum.on("disconnect", (error: any) => {
        const toastId = "disconnect-toast";
        if (!toast.isActive(toastId)) {
          toast({
            variant: "error",
            title: "disconnected",
            description: `Wallet disconnected. Error: ${getErrorMessage(error)}`
          });
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);

        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [defaultAccount, handleAccountChange, toast]);

  /**
   * Try to restore the user's account if they have previously connected
   */
  useEffect(() => {
    if (
      window.ethereum &&
      !hasConnectedWallet &&
      providerState.status === "connected" &&
      !providerState.accountReady
    ) {
      handleAccountChange()
        .catch((_) => {
          // ignore since it probably means the user has not connected a wallet
          console.log("Error trying to restore account. Probably it's not connected.");
        })
        .finally(() => {
          setProviderState((last) => ({
            ...last,
            accountReady: true
          }));
        });
    }
    // We don't include `hasConnectedWallet` so it won't be triggered on disconnect
    // eslint-disable-next-line
  }, [handleAccountChange, providerState]);

  useEffect(() => {
    if (window.ethereum) {
      handleEthereum();
    } else {
      window.addEventListener("ethereum#initialized", handleEthereum, {
        once: true
      });

      // If the event is not dispatched by the end of the timeout,
      // the user probably doesn't have MetaMask installed.
      setTimeout(handleEthereum, 3000); // 3 seconds
    }

    function handleEthereum() {
      const {ethereum} = window;
      if (ethereum && ethereum.isMetaMask) {
        setProviderState({
          status: "connected",
          provider: new ethers.providers.Web3Provider(
            ethereum,
            // We need to pass "any", otherwise we get an error when user changes the network
            "any"
          ),
          accountReady: false
        });
      } else {
        setProviderState({
          status: "not-detected"
        });
      }
    }

    return () => {
      // remove listeners
      window.removeEventListener("ethereum#initialized", handleEthereum);
    };
  }, []);

  async function handleConnectWallet() {
    try {
      // make sure metamask is installed
      if (providerState.status === "connected") {
        try {
          await providerState.provider.send("eth_requestAccounts", []);
        } catch (error) {
          /**
           * This is a workaround for the case:
           * 1. User clicks on "Connect Wallet" (Metamask popup opens)
           * 2. User closes the Metamask popup
           * 3. User clicks on "Connect Wallet" again
           * 4. User gets the error "Already processing eth_requestAccounts. Please wait."
           */
          if (
            (error as Error)?.message ===
            "Already processing eth_requestAccounts. Please wait."
          ) {
            await window.ethereum.request({
              method: "wallet_requestPermissions",
              params: [{eth_accounts: {}}]
            });
          }
          throw error;
        }
        await handleAccountChange();
      } else {
        setErrorMessage("Please Install Metamask!!!");
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  return (
    <EtherProviderContext.Provider
      value={{
        providerState,
        errorMessage,
        defaultAccount,
        userBalance,
        network,
        handleAccountChange,
        handleConnectWallet,
        resetAccountData: useCallback(() => {
          setDefaultAccount(null);
          setUserBalance(null);
          setNetwork(null);
          setErrorMessage(null);
        }, [])
      }}>
      {children}
    </EtherProviderContext.Provider>
  );
}

export default EtherProviderContextProvider;
