import AppBar from "@/components/AppBar";
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
    >
      <AppBar />
      <Container width={"full"}>
        <UserTransactions />
      </Container>
      <Sidebar />
    </Container>
  );
}
