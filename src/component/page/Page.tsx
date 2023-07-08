import React from "react";
import PageHeader from "./PageHeader";
import PageFooter from "./PageFooter";
import {Divider, Grid} from "@chakra-ui/react";

interface PageProps {
  children: React.ReactNode;
}

function Page({children}: PageProps) {
  return (
    <Grid
      padding={"20px 40px"}
      height={"100%"}
      width={"960px"}
      maxWidth={"100%"}
      margin={"auto"}
      marginTop={"24px"}
      className={"playground-container"}>
      <PageHeader />
      <Divider my={"20px"} />
      <main>{children}</main>
    </Grid>
  );
}

export default Page;
