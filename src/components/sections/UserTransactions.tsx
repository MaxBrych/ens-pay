import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  useContract,
  useContractRead,
  useAddress,
  useWallet,
} from "@thirdweb-dev/react";
import { Box, Text, VStack, Icon } from "@chakra-ui/react";
import {
  HiOutlineArrowSmDown,
  HiOutlineArrowSmUp,
  HiOutlineSwitchHorizontal,
} from "react-icons/hi";
import axios from "axios";

const CONTRACT_ADDRESS = "0x9c8b3ff4ec56363daED3caB2d449bdA279D14e37"; // Your contract address
const ENS_SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/ensdomains/ens";
const PLACEHOLDER_IMAGE =
  "https://cdn.discordapp.com/attachments/1070670506052821083/1116097197826658414/MaxCJack60_Front-facing_human_figure_styled_akin_to_a_Pokemon_p_9fe497d9-0642-49ce-829e-d00ad4a1876f.png"; // default avatar
const DECIMALS = 6; // USDC has 6 decimals

const UserTransactions = () => {
  const wallet = useWallet();
  const account = useAddress();
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: transactions, isLoading: isLoadingTransactions } =
    useContractRead(contract, "getAllTransactions");

  const [ensProvider, setEnsProvider] =
    useState<ethers.providers.Provider | null>(null);
  const [profiles, setProfiles] = useState<Record<string, any>>({}); // store fetched profile data

  useEffect(() => {
    if (!wallet) {
      console.log("No wallet available");
      return;
    }

    const initializeProvider = async () => {
      const ethersDynamic: any = await import("ethers");
      const provider = new ethersDynamic.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_PROVIDER_URL
      );
      setEnsProvider(provider);
    };

    initializeProvider();
  }, [wallet]);

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

        profilesToUpdate[address] = { ensName };
      }

      setProfiles((prevProfiles) => ({ ...prevProfiles, ...profilesToUpdate }));
    });
  }, [isLoadingTransactions, ensProvider, transactions, profiles]);

  return isLoadingTransactions ? (
    <div>Loading transactions...</div>
  ) : (
    transactions.map((transaction: any, index: any) => {
      const isSender = transaction.sender === account;
      const isReceiver = transaction.receiver === account;

      const senderProfile = profiles[transaction.sender];
      const receiverProfile = profiles[transaction.receiver];

      let IconComponent, color;
      if (isSender && isReceiver) {
        IconComponent = HiOutlineSwitchHorizontal;
        color = "gray";
      } else if (isSender) {
        IconComponent = HiOutlineArrowSmUp;
        color = "red";
      } else if (isReceiver) {
        IconComponent = HiOutlineArrowSmDown;
        color = "green";
      }

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
            <Text>
              Sender:{" "}
              {senderProfile ? senderProfile.ensName : transaction.sender}
            </Text>
            <Text>
              Receiver:{" "}
              {receiverProfile ? receiverProfile.ensName : transaction.receiver}
            </Text>
            <Text>
              Amount: {ethers.utils.formatUnits(transaction.amount, DECIMALS)}
            </Text>
            <Text>Message: {transaction.message}</Text>
            <Text>
              Timestamp:{" "}
              {new Date(transaction.timestamp * 1000).toLocaleString()}
            </Text>
            <Icon as={IconComponent} color={color} boxSize={6} />
          </VStack>
          <hr />
        </Box>
      );
    })
  );
};

export default UserTransactions;
