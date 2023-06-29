import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  Box,
  Heading,
  Text,
  Image,
  Flex,
  Icon,
  Link,
  Skeleton,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { ethers } from "ethers";
import { Inter, Manrope, Share } from "next/font/google";
import Navbar from "@/components/NavBar";
import DonateButton from "@/components/Donate";
import ChatButton from "@/components/ChatButton";
import ShareButton from "@/components/ShareButton";
import AddressCopy from "@/components/AddressCopy";
import axios from "axios";
import NavBarNew from "@/components/NavBarNew";

const manrope = Manrope({ subsets: ["latin"] });
const ethersDynamic: Promise<any> = import("ethers");
interface NFT {
  contractAddress: string;
  tokenId: string;
  image_url: string;
  name: string;
}

// This component represents a skeleton state of an ENS record.
function ENSRecordSkeleton({
  children,
  isLoaded,
}: {
  children: any;
  isLoaded: any;
}) {
  return (
    <Skeleton
      isLoaded={isLoaded}
      startColor="white"
      endColor="gray.300"
      borderRadius="full"
      mb="4"
    >
      {children}
    </Skeleton>
  );
}

const ProfilePage = () => {
  const [provider, setProvider] = useState<any>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);

  const [address, setAddress] = useState(null);

  const router = useRouter();
  const { ensName } = router.query;

  const [ensRecords, setEnsRecords] = useState<Record<string, string>>({});
  const [isLoading, setLoading] = useState(true);
  const fetchNFTs = async (address: any) => {
    try {
      const { data } = await axios.get(
        `https://api.alchemyapi.io/v1/nfts?userAddress=${address}`,
        {
          headers: {
            "x-api-key": process.env.POLYGON_API_KEY,
          },
        }
      );
      setNfts(data.nfts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    ethersDynamic.then((ethers) => {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_PROVIDER_URL
      );
      setProvider(provider);
    });
  }, []);
  useEffect(() => {
    if (address) {
      fetchNFTs(address);
    }
  }, [address]);
  useEffect(() => {
    const getAllRecords = async (ensName: string) => {
      setLoading(true);
      const client = new ApolloClient({
        uri: "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
        cache: new InMemoryCache(),
      });

      const query = gql`
      {
        domains(where:{name:"${ensName}"}) {
          id
          name
          resolver {
            texts
            coinTypes
          }
        }
      }
      `;

      if (ensName && provider) {
        const address = await provider.resolveName(ensName);
        setAddress(address);

        const result = await client.query({ query });

        if (result.data && result.data.domains.length > 0) {
          const resolver = await provider.getResolver(ensName);

          // Check if texts are defined and not empty before mapping
          if (result.data.domains[0].resolver.texts) {
            const textRecords = await Promise.all(
              result.data.domains[0].resolver.texts.map((key: string) =>
                resolver.getText(key)
              )
            );

            // Store the results in the component's state.
            const newRecords: Record<string, string> = {};
            result.data.domains[0].resolver.texts.forEach(
              (text: string, index: number) => {
                newRecords[text] = textRecords[index];
              }
            );
            setEnsRecords(newRecords);
          }
          setLoading(false);
        }
      }
    };

    if (ensName && provider) {
      getAllRecords(ensName as string);
    }
  }, [ensName, provider]);
  const bg = "gray.50";
  const color = "gray.700";

  return (
    <>
      <NavBarNew />
      <Box
        minHeight="100vh"
        w="full"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        color={color}
        backgroundColor={bg}
        className={` ${manrope.className}`}
        p={4}
      >
        <Box
          className="w-full p-4 mt-20"
          bg={"white"}
          maxW={96}
          rounded={"2xl"}
          h="full"
          minH={"90vh"}
        >
          <Flex direction="column" w="full" align="center">
            <ENSRecordSkeleton isLoaded={!isLoading}>
              <Image
                src={
                  ensRecords.avatar ||
                  "https://cdn.discordapp.com/attachments/1070670506052821083/1116097197826658414/MaxCJack60_Front-facing_human_figure_styled_akin_to_a_Pokemon_p_9fe497d9-0642-49ce-829e-d00ad4a1876f.png"
                }
                alt="Avatar"
                boxSize={["96px", "128px", "160px"]}
                rounded="full"
              />
            </ENSRecordSkeleton>

            <ENSRecordSkeleton isLoaded={!isLoading}>
              <Heading mt={4} mb={0} as="h1" fontSize={"md"} textAlign="center">
                {ensName || ""}
              </Heading>
            </ENSRecordSkeleton>
            {/*   <ENSRecordSkeleton isLoaded={!isLoading}>
              {address && <AddressCopy address={address} />}
            </ENSRecordSkeleton> */}
            <ENSRecordSkeleton isLoaded={!isLoading}>
              {ensRecords.description && (
                <Text
                  textAlign="center"
                  fontSize={"sm"}
                  fontWeight={"medium"}
                  color={color}
                >
                  {ensRecords.description}
                </Text>
              )}
            </ENSRecordSkeleton>
            <ENSRecordSkeleton isLoaded={!isLoading}>
              <HStack mt={2} spacing={8} rowGap={8}>
                <ChatButton receiverAddress={address} />
                <ShareButton />
                <DonateButton receiverAddress={address} />
              </HStack>
            </ENSRecordSkeleton>
            <ENSRecordSkeleton isLoaded={!isLoading}>
              {ensRecords["com.github"] && (
                <Flex
                  fontSize={"sm"}
                  border={"1px"}
                  borderColor={"gray.200"}
                  align="center"
                  mt={2}
                  p={4}
                  backgroundColor={"white"}
                  borderRadius={"md"}
                  className="transition-all duration-150 cursor-pointer hover:bg-gray-300"
                >
                  <Link
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={2}
                    color={color}
                    href={ensRecords["com.github"]}
                    h={"full"}
                    w={"full"}
                    isExternal
                    fontSize={"sm"}
                    textDecorationLine={"none"}
                  >
                    <Icon as={FaGithub} boxSize={6} mr={2} color={color} />
                    <Text
                      fontSize={"lg"}
                      fontWeight={"semibold"}
                      textColor={color}
                    >
                      {ensRecords["com.github"]}
                    </Text>
                  </Link>
                </Flex>
              )}
            </ENSRecordSkeleton>
          </Flex>
          <Flex direction="column" w="full" align="center">
            {nfts.map((nft, index) => (
              <Box key={index}>
                <Text>NFT Contract Address: {nft.contractAddress}</Text>
                <Text>NFT Token ID: {nft.tokenId}</Text>
                <Image
                  src={nft.image_url}
                  alt={nft.name}
                  width="100"
                  height="100"
                />
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default ProfilePage;
