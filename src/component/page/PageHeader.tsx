import {ChevronDownIcon} from "@chakra-ui/icons";
import {
  Flex,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Avatar,
  Heading
} from "@chakra-ui/react";
import {useEtherProvider} from "../../connection/EtherProviderContext";
import {useNavigate} from "react-router-dom";

export default function PageHeader() {
  const {handleConnectWallet, hasConnectedWallet, defaultAccount} = useEtherProvider();
  const navigate = useNavigate();
  return (
    <Flex as={"header"} justifyContent={"space-between"} width={"100%"}>
      <Heading as={"button"} onClick={() => navigate("/")}>
        {"🚀 NiCem"}
      </Heading>

      {hasConnectedWallet ? (
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Flex gap={"9px"} alignItems={"center"}>
              <Avatar width={"24px"} height={"24px"} />
              {
                // truncated account address
                defaultAccount?.slice(0, 6) +
                  "..." +
                  defaultAccount?.slice(defaultAccount.length - 4)
              }
            </Flex>
          </MenuButton>

          <MenuList>
            <MenuItem onClick={() => navigate("/my-account")}>My Account</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Button onClick={handleConnectWallet}>{"Connect Wallet"}</Button>
      )}
    </Flex>
  );
}
