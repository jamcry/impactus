import React from "react";
import Page from "../component/page/Page";
import {Divider, Heading} from "@chakra-ui/react";
import ThreeBoxes from "../dummy/ThreeBoxes";

interface MyAccountPageProps {}

function MyAccountPage(props: MyAccountPageProps) {
  return (
    <Page>
      <Heading>My Account</Heading>

      <Divider my={"20px"} />

      <Heading size={"md"} mb={"12px"}>
        My Donations
      </Heading>

      <ThreeBoxes />

      <Divider my={"20px"} />

      <Heading size={"md"} mb={"12px"}>
        My NFTS
      </Heading>

      <ThreeBoxes />
    </Page>
  );
}

export default MyAccountPage;
