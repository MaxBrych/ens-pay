import AppBar from "@/components/ui/navigation/AppBar";
import Sidebar from "@/components/Sidebar";
import { Box, Container } from "@chakra-ui/react";
import React from "react";
import Home from "@/components/chat/Home";

export default function Contacts() {
  return (
    <Container
      display={"flex"}
      justifyContent={"space-between"}
      maxWidth={"6xl"}
      w={"full"}
      p={0}
    >
      <AppBar />
      <Container width={"full"} pt={"16"}>
        <Home />
      </Container>
      <Sidebar />
    </Container>
  );
}
