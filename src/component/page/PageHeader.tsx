import {ChevronDownIcon, MoonIcon, SunIcon} from "@chakra-ui/icons";
import {
  Flex,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Avatar,
  Heading,
  useColorMode,
  ButtonGroup,
  IconButton
} from "@chakra-ui/react";
import {useEtherProvider} from "../../connection/EtherProviderContext";
import {useNavigate} from "react-router-dom";

export default function PageHeader() {
  const {handleConnectWallet, hasConnectedWallet, defaultAccount} = useEtherProvider();
  const navigate = useNavigate();
  const {colorMode, toggleColorMode} = useColorMode();
  return (
    <Flex
      as={"header"}
      justifyContent={"space-between"}
      width={"100%"}
      gap={"12px"}
      flexWrap={"wrap"}>
      <Heading as={"button"} onClick={() => navigate("/")}>
        {"🚀 Impactus"}
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
            <MenuItem onClick={toggleColorMode}>
              {`Toggle ${colorMode === "light" ? "Dark" : "Light"}`}
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <ButtonGroup spacing={"2"}>
          <IconButton
            onClick={toggleColorMode}
            aria-label={`Toggle ${colorMode === "light" ? "Dark" : "Light"}`}
            icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}></IconButton>
          <Button onClick={handleConnectWallet}>{"Connect Wallet"}</Button>
        </ButtonGroup>
      )}
    </Flex>
  );
}
