import React from "react";
import {Link, useLoaderData} from "react-router-dom";
import {Project} from "../projectTypes";
import Page from "../../component/page/Page";
import {
  Badge,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Image,
  InputGroup,
  InputLeftAddon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  useToast
} from "@chakra-ui/react";

import {getProjectCategory} from "../projectUtils";
import CurrencyInput from "react-currency-input-field";
import {useMutation} from "react-query";
import {
  useDonationContractMethods,
  useTokenContractMethods
} from "../../contract/contractConstants";
import {getErrorMessage} from "../../util/errorUtils";
import WalletGuardButton from "../../connection/wallet-guard-button/WalletGuardButton";

interface ProjectDetailPageProps {}

function ProjectDetailPage(props: ProjectDetailPageProps) {
  const {project} = useLoaderData() as {project: Project};
  const category = getProjectCategory(project);
  const [amount, setAmount] = React.useState("");
  const {approve} = useTokenContractMethods();
  const {donate} = useDonationContractMethods();
  const toast = useToast();
  const donateMutation = useMutation(
    "donate",
    async (amount: number) => {
      const approveTxn = await approve(amount);
      console.log({
        approveTxn
      });
      // todo: update id
      const donateTxn = await donate(amount, Number(project.sdgNftIds[0]));

      return {
        approveTxn,
        donateTxn
      };
    },
    {
      onSuccess() {
        toast({
          title: "Donation successful",
          description: "Thank you for your donation!",
          status: "success"
        });
      },
      onError(error) {
        toast({
          title: "Donation failed",
          description: getErrorMessage(error),
          status: "error"
        });
      }
    }
  );

  return (
    <Page>
      <Grid
        templateColumns={{
          lg: "300px 1fr",
          sm: "1fr"
        }}
        gap={"32px"}
        alignItems={"start"}>
        <Image src={project.image} width={"100%"} borderRadius={"12px"} />

        <Grid bg={"blackAlpha.300"} borderRadius={"12px"} p="12px">
          <Heading mb={"12px"}>{project.title}</Heading>

          <Text mb={"12px"} fontSize={"lg"}>
            {project.description}
          </Text>

          <TableContainer mb={"32px"}>
            <Table variant="simple">
              <Tbody>
                <Tr>
                  <Td>SDG Category</Td>
                  <Td isNumeric>
                    <Badge>{project.sdgNftIds}</Badge>
                  </Td>
                </Tr>

                <Tr>
                  <Td>Category</Td>
                  <Td isNumeric>
                    <Link to={`/categories/${category?.id}`}>
                      <Badge>{category?.title}</Badge>
                    </Link>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>

          <WalletGuardButton
            connectWalletButtonProps={{
              children: "Connect Wallet to Donate"
            }}>
            <FormControl mb={"9px"}>
              <FormLabel>Amount</FormLabel>

              <InputGroup>
                <InputLeftAddon children="ITO" />
                <CurrencyInput
                  id="input-example"
                  name="input-name"
                  placeholder="Please enter a number"
                  defaultValue={10}
                  decimalsLimit={2}
                  value={amount}
                  onValueChange={(value, name) => {
                    setAmount(value ? value : "");
                  }}
                  style={{
                    borderRadius: "0 8px 8px 0",
                    paddingLeft: "12px",
                    width: "100%"
                  }}
                />
              </InputGroup>
            </FormControl>

            <Button
              colorScheme={"green"}
              isLoading={donateMutation.isLoading}
              isDisabled={amount === ""}
              onClick={() => donateMutation.mutate(Number(amount))}>
              {"💰 Donate"}
            </Button>
          </WalletGuardButton>
        </Grid>
      </Grid>
    </Page>
  );
}

export default ProjectDetailPage;
