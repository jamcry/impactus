import {useState} from "react";
import {Alert, AlertIcon, Button, Container, Link, useToast} from "@chakra-ui/react";
import {AddIcon, ExternalLinkIcon, RepeatIcon} from "@chakra-ui/icons";
import {ethers} from "ethers";
import {getErrorMessage} from "../util/errorUtils";
import {useEtherProvider} from "../connection/EtherProviderContext";

export type SignState =
  | {
      status: "idle";
    }
  | {
      status: "signing";
    }
  | {
      status: "sending";
    }
  | {
      status: "error";
      error: unknown;
    }
  | {
      status: "success";
      txn: ethers.providers.TransactionReceipt;
    };

interface SignTxnButtonProps {
  to: string;
  value: string;
  onSuccess?: (txnReciept: ethers.providers.TransactionReceipt) => void;
  onlyButton?: boolean;
}

export default function SignTxnButton({
  to,
  value,
  onSuccess,
  onlyButton = true
}: SignTxnButtonProps) {
  const {providerState} = useEtherProvider();
  const provider = providerState.status === "connected" ? providerState.provider : null;
  const [signState, setSignState] = useState<SignState>({
    status: "idle"
  });
  const {status} = signState;
  const toast = useToast();

  const button = (
    <Button
      isLoading={status === "sending" || status === "signing"}
      loadingText={
        status === "signing"
          ? "Waiting for sign..."
          : status === "sending"
          ? "Sending Txn..."
          : undefined
      }
      disabled={signState.status !== "idle"}
      onClick={handleTxnSign}
      colorScheme={"green"}
      leftIcon={<AddIcon />}>
      Donate
    </Button>
  );

  if (onlyButton) return button;
  return (
    <>
      {button}

      <Container padding={0} marginTop={4} marginBottom={4}>
        {status === "error" && (
          <Alert status="error">
            <AlertIcon />
            <div>
              There was an error processing your request:
              <br />
              <code style={{lineBreak: "anywhere"}}>
                {getErrorMessage(signState.error)}
              </code>
              <br />
              <Button
                onClick={handleTxnSign}
                leftIcon={<RepeatIcon />}
                mt={2}
                colorScheme={"green"}>
                Try again
              </Button>
            </div>
          </Alert>
        )}

        {status === "success" && (
          <Alert status="success">
            <AlertIcon />

            <div>
              Transaction was successful!
              <br />
              <Link href={"TODO"} isExternal color={"blue.500"}>
                View on Etherscan
                <ExternalLinkIcon mx="5px" />
              </Link>
            </div>
          </Alert>
        )}
      </Container>
    </>
  );

  async function handleTxnSign() {
    try {
      if (!provider) {
        throw new Error("Provider not found");
      }

      setSignState({status: "signing"});
      const signer = provider.getSigner();
      const txn = await signer.sendTransaction({to, value});
      setSignState({status: "sending"});

      const txnReceipt = await txn.wait();
      setSignState({status: "success", txn: txnReceipt});
      toast({
        title: "Transaction successful",
        description: "Your transaction was successful",
        status: "success",
        isClosable: true
      });

      onSuccess && onSuccess(txnReceipt);
    } catch (error) {
      setSignState({status: "error", error});
      toast({
        title: "Transaction failed",
        description: getErrorMessage(error) || "Your transaction failed",
        status: "error",
        isClosable: true
      });
    }
  }
}
