import React from "react";
import {Link, useLoaderData} from "react-router-dom";
import {PROJECTS, Project} from "../projectTypes";
import Page from "../../component/page/Page";
import {
  Badge,
  Divider,
  Flex,
  Grid,
  Heading,
  Image,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr
} from "@chakra-ui/react";
import SignTxnButton from "../../sign-button/SignTxnButton";
import {useEtherProvider} from "../../connection/EtherProviderContext";
import {getProjectCategory} from "../projectUtils";

interface ProjectDetailPageProps {}

function ProjectDetailPage(props: ProjectDetailPageProps) {
  const {defaultAccount} = useEtherProvider();
  const {project} = useLoaderData() as {project: Project};
  const category = getProjectCategory(project);

  return (
    <Page>
      <Grid templateColumns={"300px 1fr"} gap={"32px"} alignItems={"start"}>
        <Image src={project.image} />

        <Grid bg={"gray.800"} borderRadius={"12px"} p="12px">
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
                    <Badge>{"Cat1"}</Badge>
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

          <SignTxnButton to={defaultAccount!} value={"0"} />
        </Grid>
      </Grid>
    </Page>
  );
}

export default ProjectDetailPage;
