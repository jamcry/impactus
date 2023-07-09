import React from "react";
import Page from "../component/page/Page";
import {Heading, Flex, Tag, Divider, Grid} from "@chakra-ui/react";
import {CATEGORIES, PROJECTS} from "../project/projectTypes";
import ProjectCard from "../project/card/ProjectCard";
import {Link} from "react-router-dom";

interface HomePageProps {}

function HomePage(props: HomePageProps) {
  return (
    <Page>
      <Heading mb={"12px"}>Categories</Heading>
      <Flex gap={"12px"}>
        {CATEGORIES.map((category) => (
          <Link key={`category-${category.id}`} to={`/categories/${category.id}`}>
            <Tag size={"lg"} colorScheme={"blue"}>
              {category.title}
            </Tag>
          </Link>
        ))}
      </Flex>

      <Divider my={"24px"} />

      <Heading mb={"12px"}>Projects</Heading>
      <Grid
        templateColumns={{
          lg: "repeat(3, 1fr)",
          md: "repeat(2, 1fr)",
          sm: "1fr"
        }}
        gap={"24px"}>
        {PROJECTS.map((project) => (
          <ProjectCard key={`project-${project.id}`} project={project} />
        ))}
      </Grid>
    </Page>
  );
}

export default HomePage;
