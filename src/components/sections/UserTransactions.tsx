// UserTransactions.tsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { Image, Skeleton, Box, Text, VStack } from "@chakra-ui/react";
import axios from "axios";

const CONTRACT_ADDRESS = "0x9c8b3ff4ec56363daED3caB2d449bdA279D14e37"; // Your contract address
const ENS_SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/ensdomains/ens";
const PLACEHOLDER_IMAGE =
  "https://cdn.discordapp.com/attachments/1070670506052821083/1116097197826658414/MaxCJack60_Front-facing_human_figure_styled_akin_to_a_Pokemon_p_9fe497d9-0642-49ce-829e-d00ad4a1876f.png"; // default avatar

const UserTransactions = () => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: transactions, isLoading: isLoadingTransactions } =
    useContractRead(contract, "getAllTransactions");

  const DECIMALS = 6; // USDC has 6 decimals

  const [ensProvider, setEnsProvider] =
    useState<ethers.providers.Provider | null>(null);
  const [profiles, setProfiles] = useState<Record<string, any>>({}); // store fetched profile data

  useEffect(() => {
    const initializeProvider = async () => {
      const ethersDynamic: any = await import("ethers");
      const provider = new ethersDynamic.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_PROVIDER_URL
      );
      setEnsProvider(provider);
    };

    initializeProvider();
  }, []);

  useEffect(() => {
    if (isLoadingTransactions || !ensProvider || !transactions) return;

    transactions.forEach(async (transaction: any) => {
      const { sender, receiver } = transaction;
      const profilesToUpdate: Record<string, any> = {};

      for (const address of [sender, receiver]) {
        // Skip if already fetched
        if (profiles[address]) continue;

        // Get ENS name
        const ensName = await ensProvider.lookupAddress(address);
        if (!ensName) continue; // skip if no ENS name

        // Fetch profile picture
        const query = `
        {
          domains(where:{name:"${ensName}"}) {
            id
            name
            resolver {
              texts
            }
          }
        }
        `;
        const response = await axios.post(ENS_SUBGRAPH_URL, { query });
        const domains = response.data.data.domains;

        if (domains.length > 0) {
          const avatarRecord = domains[0].resolver.texts.find(
            (text: any) => text.key === "avatar"
          );
          const avatar = avatarRecord ? avatarRecord.value : PLACEHOLDER_IMAGE;
          profilesToUpdate[address] = { ensName, avatar };
        } else {
          profilesToUpdate[address] = { ensName, avatar: PLACEHOLDER_IMAGE };
        }
      }

      setProfiles((prevProfiles) => ({ ...prevProfiles, ...profilesToUpdate }));
    });
  }, [isLoadingTransactions, ensProvider, transactions, profiles]);

  return isLoadingTransactions ? (
    <div>Loading transactions...</div>
  ) : (
    transactions.map((transaction: any, index: any) => {
      const senderProfile = profiles[transaction.sender];
      const receiverProfile = profiles[transaction.receiver];

      return (
        <Box
          key={index}
          w={"full"}
          border="1px"
          borderColor="gray.200"
          p="4"
          rounded="md"
        >
          <VStack align="start">
            {senderProfile ? (
              <>
                <Text>Sender: {senderProfile.ensName}</Text>
                <Image
                  boxSize="50px"
                  src={senderProfile.avatar}
                  alt={senderProfile.ensName}
                />
              </>
            ) : (
              <Skeleton boxSize="50px" />
            )}

            {receiverProfile ? (
              <>
                <Text>Receiver: {receiverProfile.ensName}</Text>
                <Image
                  boxSize="50px"
                  src={receiverProfile.avatar}
                  alt={receiverProfile.ensName}
                />
              </>
            ) : (
              <Skeleton boxSize="50px" />
            )}

            <Text>
              Amount: {ethers.utils.formatUnits(transaction.amount, DECIMALS)}
            </Text>
            <Text>Message: {transaction.message}</Text>
            <Text>
              Timestamp:{" "}
              {new Date(transaction.timestamp * 1000).toLocaleString()}
            </Text>
          </VStack>
          <hr />
        </Box>
      );
    })
  );
};

export default UserTransactions;
