import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { Image, Skeleton, Box, Text, VStack } from "@chakra-ui/react";

const CONTRACT_ADDRESS = "0x9c8b3ff4ec56363daED3caB2d449bdA279D14e37"; // Your contract address
const PLACEHOLDER_IMAGE =
  "https://cdn.discordapp.com/attachments/1070670506052821083/1116097197826658414/MaxCJack60_Front-facing_human_figure_styled_akin_to_a_Pokemon_p_9fe497d9-0642-49ce-829e-d00ad4a1876f.png"; // default avatar
const ENS_MAINNET_ADDRESS = "0x314159265dD8dbb310642f98f50C066173C1259b"; // ENS address on mainnet

async function getAvatarWithENS(ensName: string) {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_PROVIDER_URL
  );

  // create a contract instance
  const ensContract = new ethers.Contract(
    ENS_MAINNET_ADDRESS,
    [
      // resolver(bytes32)
      "function resolver(bytes32) view returns (address)",
      // addr(bytes32)
      "function addr(bytes32) view returns (address)",
    ],
    provider
  );

  const node = ethers.utils.namehash(ensName);
  const resolverAddress = await ensContract.resolver(node);

  const resolverContract = new ethers.Contract(
    resolverAddress,
    [
      // text(bytes32,string)
      "function text(bytes32,string) view returns (string)",
    ],
    provider
  );

  const avatarURL = await resolverContract.text(node, "avatar");
  return avatarURL;
}

const Transactions = () => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: transactions, isLoading: isLoadingTransactions } =
    useContractRead(contract, "getAllTransactions");
  const DECIMALS = 6; // USDC has 6 decimals

  const [provider, setProvider] = useState<ethers.providers.Provider | null>(
    null
  );
  const [profiles, setProfiles] = useState<Record<string, any>>({}); // store fetched profile data

  useEffect(() => {
    async function initializeProvider() {
      const ethersDynamic: any = await import("ethers");
      const provider = new ethersDynamic.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_PROVIDER_URL
      );
      setProvider(provider);
    }
    initializeProvider();
  }, []);

  useEffect(() => {
    if (isLoadingTransactions || !provider || !transactions) return;

    const promises = transactions.map(async (transaction: any) => {
      const { sender, receiver } = transaction;

      for (const address of [sender, receiver]) {
        if (profiles[address]) continue; // Skip if already fetched

        const ensName = await provider.lookupAddress(address);
        if (!ensName) continue; // skip if no ENS name

        const avatar = await getAvatarWithENS(ensName);
        return {
          address,
          ensName,
          avatar: avatar || PLACEHOLDER_IMAGE,
        };
      }
    });

    Promise.all(promises).then((profilesArray) => {
      const profilesToUpdate: Record<string, any> = {};
      profilesArray.forEach((profile) => {
        if (profile) {
          profilesToUpdate[profile.address] = {
            ensName: profile.ensName,
            avatar: profile.avatar,
          };
        }
      });
      setProfiles((prevProfiles) => ({ ...prevProfiles, ...profilesToUpdate }));
    });
  }, [isLoadingTransactions, provider, transactions, profiles]);

  return isLoadingTransactions ? (
    <div>Loading transactions...</div>
  ) : (
    transactions.map((transaction: any, index: any) => {
      const senderProfile = profiles[transaction.sender];
      const receiverProfile = profiles[transaction.receiver];
      const amount = ethers.utils.formatUnits(transaction.amount, DECIMALS);
      const message = transaction.message;
      const timestamp = transaction.timestamp;

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
              <Skeleton
                isLoaded={!isLoadingTransactions}
                height="20px"
                width="100px"
              />
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
              <Skeleton
                isLoaded={!isLoadingTransactions}
                height="20px"
                width="100px"
              />
            )}
            <Text>Amount: {amount} USDC</Text>
            <Text>Message: {message}</Text>
            <Text>
              Timestamp:{" "}
              {new Date(
                transaction.timestamp.toNumber() * 1000
              ).toLocaleString()}
            </Text>
          </VStack>
        </Box>
      );
    })
  );
};

export default Transactions;
