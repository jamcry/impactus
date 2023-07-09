import {Web3AuthModalPack} from "@safe-global/auth-kit";
import {CHAIN_NAMESPACES, WALLET_ADAPTERS} from "@web3auth/base";
import {useState} from "react";

import {SafeAuthKit} from "@safe-global/auth-kit";
import Safe, {EthersAdapter} from "@safe-global/protocol-kit";
import {Web3AuthOptions} from "@web3auth/modal";
import {OpenloginAdapter} from "@web3auth/openlogin-adapter";
import {Alert, AlertDescription, AlertTitle, Button, Text} from "@chakra-ui/react";
import Page from "../component/page/Page";
import {useQuery} from "react-query";
import {getErrorMessage} from "../util/errorUtils";
import {ethers} from "ethers";

async function get() {
  // https://dashboard.web3auth.io/
  const WEB3_AUTH_CLIENT_ID =
    "BA-qMnEJTq8H_Y5HxdFxDdIAJgYSCyfIliUw2YtWiE3p0_Hm2hVkGmClooP-8CoC1zGVNNRWbzmFAQkF0KkK01o";

  // https://web3auth.io/docs/sdk/web/modal/initialize#arguments
  const options: Web3AuthOptions = {
    clientId: WEB3_AUTH_CLIENT_ID,
    web3AuthNetwork: "testnet",
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x5",
      // https://chainlist.org/
      rpcTarget: `https://rpc.ankr.com/eth_goerli`
    },
    uiConfig: {
      theme: "dark",
      loginMethodsOrder: ["google", "facebook"]
    }
  };

  // https://web3auth.io/docs/sdk/web/modal/initialize#configuring-adapters
  const modalConfig = {
    [WALLET_ADAPTERS.TORUS_EVM]: {
      label: "torus",
      showOnModal: false
    },
    [WALLET_ADAPTERS.METAMASK]: {
      label: "metamask",
      showOnDesktop: true,
      showOnMobile: false
    },
    [WALLET_ADAPTERS.WALLET_CONNECT_V1]: {
      label: "wc",
      // bc it doens't work
      showOnModal: false
    }
  };

  // https://web3auth.io/docs/sdk/web/modal/whitelabel#whitelabeling-while-modal-initialization
  const openloginAdapter = new OpenloginAdapter({
    loginSettings: {
      mfaLevel: "optional"
    },
    adapterSettings: {
      uxMode: "popup",
      whiteLabel: {
        name: "Safe"
      }
    }
  });

  const pack = new Web3AuthModalPack(options, [openloginAdapter], modalConfig);

  const safeAuthKit = await SafeAuthKit.init(pack, {
    txServiceUrl: "https://safe-transaction-goerli.safe.global"
  });

  return safeAuthKit;
}

interface SafeTestProps {}

function SafeTest(props: SafeTestProps) {
  const [accountData, setAccountData] = useState(null);
  const getSafeAuthData = useQuery(
    "getSafeAuthKit",
    async () => {
      // create a new instance of SafeAuthKit
      const safeAuthKit = await get();

      // get the provider
      const safeAuthKitProvider = safeAuthKit.getProvider();

      if (!safeAuthKitProvider) {
        return {
          authKit: safeAuthKit
        };
        throw new Error("safeAuthKitProvider is undefined");
      }

      const web3provider = new ethers.providers.Web3Provider(safeAuthKitProvider);
      // @ts-ignore
      window.devTools = {
        safeAuthKitProvider,
        web3provider
      };
      const accounts = await web3provider.listAccounts();
      let userInfo = await safeAuthKit.getUserInfo();

      // fix for userInfo being an empty object
      if (userInfo && !Object.entries(userInfo).length) {
        userInfo = null;
      }

      return {
        authKit: safeAuthKit,
        // can be used for signing etc
        web3provider,
        accounts: accounts,
        userInfo
      };
    },
    {
      onError(error) {
        console.error(error);
      },
      onSuccess(data) {
        // safeAuthKit.subscribe(ADAPTER_EVENTS.CONNECTED, () => {
        //   console.log("User is authenticated");
        // });

        // safeAuthKit.subscribe(ADAPTER_EVENTS.DISCONNECTED, () => {
        //   console.log("User is not authenticated");
        // });

        console.log({
          data
        });
      }
    }
  );
  const signInQuery = useQuery(
    "signIn",
    async () => {
      const safeAuthKit = getSafeAuthData.data;
      if (!safeAuthKit) {
        console.warn("getSafeAuthKitQuery.data is undefined");
        return;
      }

      return getSafeAuthData.data.authKit.signIn();
    },
    {
      enabled: false,
      onError(error) {
        console.error(error);
      },
      onSuccess({eoa}: {eoa: string}) {
        // a lazy way to get account related data
        getSafeAuthData.refetch();
      }
    }
  );
  const signOutQuery = useQuery(
    "signOut",
    async () => {
      if (!getSafeAuthData.data) {
        console.warn("getSafeAuthKitQuery.data is undefined");
        return;
      }

      return await getSafeAuthData.data.authKit.signOut();
    },
    {
      enabled: false,
      onError(error) {
        console.error(error);
      }
    }
  );
  const signTxnQuery = useQuery(
    "signTxn",
    async () => {
      if (!getSafeAuthData.data || !getSafeAuthData.data.web3provider) {
        console.warn("getSafeAuthKitQuery.data is undefined");
        return;
      }

      const signer = getSafeAuthData.data.web3provider.getSigner();
      // const txn = await (
      //   await signer.sendTransaction({
      //     to: getSafeAuthData.data.accounts[0],
      //     value: "0"
      //   })
      // ).wait();
      // return {
      //   txn
      // };

      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer || provider
      });

      const safeSDK = await Safe.create({
        ethAdapter,
        safeAddress: getSafeAuthData.data.accounts[0]
      });

      // Create a Safe transaction with the provided parameters
      const safeTransactionData = {
        to: "0x",
        data: "0x",
        value: ethers.utils.parseUnits("0.0001", "ether").toString()
      };

      const safeTransaction = await safeSDK.createTransaction({safeTransactionData});
      console.log({
        safeTransaction
      });
      return safeTransaction;
    },
    {
      enabled: false,
      onError: console.log,
      onSuccess: console.log
    }
  );

  const provider = getSafeAuthData.data?.authKit.getProvider();
  const isConnected = !!provider;

  return (
    <Page>
      {isConnected ? (
        <>
          <Text>{getSafeAuthData.data?.accounts?.[0] || "no acct"}</Text>
          {getSafeAuthData.data?.userInfo && (
            <Text>Email: {getSafeAuthData.data?.userInfo.email}</Text>
          )}
          <Button
            isLoading={getSafeAuthData.isLoading}
            isDisabled={!getSafeAuthData.data}
            onClick={() => signOutQuery.refetch()}>
            Sign Out
          </Button>
          <Button
            isLoading={getSafeAuthData.isLoading || signTxnQuery.isLoading}
            isDisabled={!getSafeAuthData.data}
            onClick={() => signTxnQuery.refetch()}>
            {"Test Sign"}
          </Button>
        </>
      ) : (
        <Button
          isLoading={getSafeAuthData.isLoading}
          isDisabled={!getSafeAuthData.data}
          onClick={() => signInQuery.refetch()}>
          Sign In With Safe
        </Button>
      )}

      {(signInQuery.error as any) && (
        <Alert variant={"error"}>
          <AlertTitle>{"Error while signin in"}</AlertTitle>

          <AlertDescription>{getErrorMessage(signInQuery.error)}</AlertDescription>
        </Alert>
      )}
    </Page>
  );
}

export default SafeTest;
