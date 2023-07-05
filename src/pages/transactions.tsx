import AppBar from "@/components/AppBar";
import Recommendation from "@/components/Recommendation";
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
      maxWidth={"4xl"}
      w={{ base: "full", md: "4xl" }}
    >
      <AppBar />
      <Box w={{ base: "full", md: "50vw" }}>
        <h1>Transactions</h1>
        <UserTransactions />
      </Box>
      <Recommendation />
    </Container>
  );
}
