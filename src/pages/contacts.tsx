import AppBar from "@/components/AppBar";
import Sidebar from "@/components/Sidebar";
import { Box, Container } from "@chakra-ui/react";
import React from "react";

export default function Contacts() {
  return (
    <Container
      display={"flex"}
      justifyContent={"space-between"}
      maxWidth={"6xl"}
      w={"full"}
    >
      <AppBar />
      <Container width={"full"}>Feed</Container>
      <Sidebar />
    </Container>
  );
}
