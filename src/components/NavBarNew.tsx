import React from "react";
import { ConnectKit } from "./ConnectKit";
import { Container, Flex, Heading } from "@chakra-ui/react";
import { ConnectKitButton } from "connectkit";

export default function NavBarNew() {
  return (
    <Container
      maxW={"1000px"}
      className="fixed w-[90vw]  rounded-xl top-4"
      py={2}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Heading size={{ base: "md", md: "sm" }}>ENS Bagpack</Heading>
        <ConnectKitButton mode="light" theme="soft" />
      </Flex>
    </Container>
  );
}
