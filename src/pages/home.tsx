import AppBar from "@/components/AppBar";
import Sidebar from "@/components/Sidebar";
import HomeFeed from "@/components/sections/HomeFeed";
import { Container } from "@chakra-ui/react";
import React from "react";

export default function Home() {
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
        <HomeFeed />
      </Container>
      <Sidebar />
    </Container>
  );
}