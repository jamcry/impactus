import {Button, Spinner} from "@chakra-ui/react";
import {useEtherProvider} from "./connection/EtherProviderContext";
import HomePage from "./home/HomePage";

function SiweSignButton() {
  const {providerState, defaultAccount} = useEtherProvider();
  const siweSign = async (siweMessage: string) => {
    try {
      const from = defaultAccount!;
      const msg = `0x${Buffer.from(siweMessage, "utf8").toString("hex")}`;
      const sign = await window.ethereum.request({
        method: "personal_sign",
        params: [msg, from]
      });
      console.log({
        sign
      });
    } catch (err) {
      console.error(err);
    }
  };

  return <Button onClick={() => siweSign("hello")}>{"signin"}</Button>;
}

export default function App() {
  const {providerState, defaultAccount} = useEtherProvider();
  const isAccountLoading =
    providerState.status === "loading" ||
    (providerState.status === "connected" && !providerState.accountReady);

  if (isAccountLoading) return <Spinner />;

  return <HomePage />;
}
