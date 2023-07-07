import React from "react";
import AppBar from "@/components/AppBar";
import Recommendation from "@/components/Recommendation";
import { Box, Container } from "@chakra-ui/react";

export default function Settings() {
  return (
    <Container
      display={"flex"}
      justifyContent={"space-between"}
      maxWidth={"6xl"}
      w={"full"}
    >
      <AppBar />
      <Container width={"full"}>Feed</Container>
      <Recommendation />
    </Container>
  );
}
