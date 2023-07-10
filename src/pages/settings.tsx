import React from "react";
import AppBar from "@/components/ui/navigation/AppBar";
import Sidebar from "@/components/Sidebar";
import { Box, Container } from "@chakra-ui/react";

export default function Settings() {
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
        Feed
      </Container>
      <Sidebar />
    </Container>
  );
}
