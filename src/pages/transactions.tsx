import AppBar from "@/components/ui/navigation/AppBar";
import Sidebar from "@/components/Sidebar";
import UserTransactions from "@/components/sections/UserTransactions";
import { Box, Container } from "@chakra-ui/react";
import {
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import React from "react";

export default function Transactions() {
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
        <UserTransactions />
      </Container>
      <Sidebar />
    </Container>
  );
}
