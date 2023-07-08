import React from "react";
import {useLoaderData} from "react-router-dom";
import {Category} from "../project/projectTypes";
import {useEtherProvider} from "../connection/EtherProviderContext";
import {Divider, Flex, Grid, Heading, Text} from "@chakra-ui/react";
import Page from "../component/page/Page";
import {getProjectCategory, getProjectsInCategory} from "../project/projectUtils";
import ProjectCard from "../project/card/ProjectCard";

interface CategoryDetailPageProps {}

function CategoryDetailPage(props: CategoryDetailPageProps) {
  const {defaultAccount} = useEtherProvider();
  const {category} = useLoaderData() as {category: Category};
  const projectsInTheCategory = getProjectsInCategory(category.id);

  return (
    <Page>
      <Heading mb={"12px"}>{category.title}</Heading>

      <Text>{category.description}</Text>

      <Divider my={"24px"} />

      <Heading mb={"12px"} size={"md"}>
        {"Projects"}
      </Heading>

      <Grid templateColumns={"repeat(3, minmax(300px, 1fr))"} gap={"10px"}>
        {projectsInTheCategory.map((project) => (
          <ProjectCard key={`project-${project.id}`} project={project} />
        ))}
      </Grid>
    </Page>
  );
}

export default CategoryDetailPage;
