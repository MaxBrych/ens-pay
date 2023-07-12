"use client";
import { useAddress, ConnectWallet } from "@thirdweb-dev/react";
import { useState } from "react";
import ArticleList from "../ArticleList";
import {
  Container,
  Heading,
  Center,
  SimpleGrid,
  Card,
  Table,
  TableCaption,
  Text,
} from "@chakra-ui/react";
import React from "react";

const Articles = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <Container className="landing">
        <Heading>Welcome to NeulandDAO</Heading>
        <div className="btn-hero">
          <ConnectWallet />
        </div>
      </Container>
    );
  }

  // Render the screen where the user can claim their NFT.
  // If the user has already claimed their NFT we want to display the internal DAO page to them
  // only DAO members will see this. Render all the members + token amounts.
  return (
    <>
      <Container padding={16} maxWidth={1240} className="member-page">
        <Center>
          <Heading>DAO Dashboard</Heading>
        </Center>
        <Center paddingBottom={8}>
          <Text>Congratulations on being a member!</Text>
        </Center>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          <Card borderRadius={20} padding={6}>
            <ArticleList />
          </Card>
        </SimpleGrid>
      </Container>
    </>
  );
};

export default Articles;
