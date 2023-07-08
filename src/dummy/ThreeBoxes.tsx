import {Flex} from "@chakra-ui/react";
import React from "react";

interface ThreeBoxesProps {}

function ThreeBoxes(props: ThreeBoxesProps) {
  const box = <Flex bg={"red"} width={"100px"} height={"100px"} />;
  return (
    <Flex flexDir={"row"} gap={"32px"}>
      {box}
      {box}
      {box}
    </Flex>
  );
}

export default ThreeBoxes;
