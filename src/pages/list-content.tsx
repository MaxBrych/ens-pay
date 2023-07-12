"use client";
import {
  useAddress,
  useNetwork,
  ConnectWallet,
  useMetadata,
  Web3Button,
  useContract,
  useNFTBalance,
  MediaRenderer,
  ChainId,
} from "@thirdweb-dev/react";
import { useState, useEffect, useMemo } from "react";
import { AddressZero } from "@ethersproject/constants";
import {
  Button,
  Text,
  Card,
  Container,
  Flex,
  FormLabel,
  Heading,
  Input,
  Radio,
  Table,
  TableCaption,
  TableContainer,
  SimpleGrid,
  GridItem,
  Switch,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";

import React from "react";

interface Vote {
  type: number;
  label: string;
}
interface ArticleListProps {
  // Define `vote` prop to have the type of your contract
  vote: any; // Ideally, you should replace `any` with the correct contract type
}

interface Proposal {
  proposalId: any;
  description: string;
  votes: Vote[];
}

const Content = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  //console.log("👋 Address:", address);

  // Initialize our Edition Drop contract
  const editionDropAddress = "0x7f2BfBf0E6904b5B6Facec197C64b8eB4b1aBeC1";
  const { contract: editionDrop } = useContract(
    editionDropAddress,
    "edition-drop"
  );
  const { contract: vote } = useContract(
    "0x80Df461EF950721649675B05Eb116687F5145D96",
    "vote"
  );
  if (vote === undefined) {
    console.log("vote is undefined");
  }

  const { contract: token } = useContract(
    "0x3Aa1FebD87D6Cf9bAB16475f943b39DbFbf18f33",
    "token"
  );

  // Hook to check if the user has our NFT
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0");
  const { data: metadata, isLoading: isLoadingMetadata } =
    useMetadata(editionDrop);

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0);
  }, [nftBalance]);

  //array of addresses
  const [memberAddresses, setMemberAddresses] = useState<string[]>([]);

  //function to shorten someones wallet address
  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const [selectedVotes, setSelectedVotes] = useState<{
    [proposalId: string]: number;
  }>({});
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedProposals, setVotedProposals] = useState<string[]>([]);

  // Retrieve all our existing proposals from the contract.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // A simple call to vote.getAll() to grab the proposals.
    const getAllProposals = async () => {
      try {
        if (vote?.getAll) {
          const proposals = await vote.getAll();
          setProposals(proposals);
          console.log("🌈 Proposals:", proposals);
        } else {
          console.log("getAll method is not available on vote contract");
        }
      } catch (error) {
        console.log("failed to get proposals", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  // We also need to check if the user already voted.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // If we haven't finished retrieving the proposals from the useEffect above
    // then we can't check if the user voted yet!
    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        if (vote?.hasVoted) {
          const hasVoted = await vote.hasVoted(
            proposals[0].proposalId,
            address
          );
          setHasVoted(hasVoted);
          if (hasVoted) {
            console.log("🥵 User has already voted");
          } else {
            console.log("🙂 User has not voted yet");
          }
        } else {
          console.log("hasVoted method is not available on vote contract");
        }
      } catch (error) {
        console.error("Failed to check if wallet has voted", error);
      }
    };

    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, vote]);

  //function to get all the members of the DAO
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getMembers = async () => {
      try {
        if (editionDrop?.history?.getAllClaimerAddresses) {
          const memberAddress =
            await editionDrop.history.getAllClaimerAddresses(0);
          if (memberAddress) {
            setMemberAddresses(memberAddress);
            console.log("Members:", memberAddress);
          }
        } else {
          console.log(
            "getAllClaimerAddresses method is not available on editionDrop contract"
          );
        }
      } catch (error) {
        console.error("Failed to get members", error);
      }
    };
    getMembers();
  }, [hasClaimedNFT, editionDrop?.history]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: 1,
      };
    });
  }, [memberAddresses]);
};

export default Content;
