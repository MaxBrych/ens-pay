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
import { Inter, Manrope } from "next/font/google";
import Navbar from "@/components/NavBar";
import DonateButton from "@/components/Donate";
import ChatButton from "@/components/ChatButton";
import AddressCopy from "@/components/AddressCopy";
const manrope = Manrope({ subsets: ["latin"] });
const ethersDynamic: Promise<any> = import("ethers");

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

  const [address, setAddress] = useState(null);

  const router = useRouter();
  const { ensName } = router.query;

  const [ensRecords, setEnsRecords] = useState<Record<string, string>>({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    ethersDynamic.then((ethers) => {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_PROVIDER_URL
      );
      setProvider(provider);
    });
  }, []);

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
  const bg = useColorModeValue("gray.50", "#0a0b0d");
  const color = useColorModeValue("gray.700", "white");

  return (
    <>
      <Navbar />
      <Box
        minHeight="100vh"
        w="full"
        color={color}
        backgroundColor={bg}
        className={` ${manrope.className}`}
      >
        <main className="w-full p-4 mt-4">
          <Flex direction="column" w="full" align="center">
            <ENSRecordSkeleton isLoaded={!isLoading}>
              <Image
                src={
                  ensRecords.avatar ||
                  "https://cdn.discordapp.com/attachments/1070670506052821083/1116097197826658414/MaxCJack60_Front-facing_human_figure_styled_akin_to_a_Pokemon_p_9fe497d9-0642-49ce-829e-d00ad4a1876f.png"
                }
                alt="Avatar"
                boxSize="200px"
                rounded="full"
              />
            </ENSRecordSkeleton>
            <ENSRecordSkeleton isLoaded={!isLoading}>
              <Heading mt={4} as="h1" size="lg" textAlign="center">
                {ensName || ""}
              </Heading>
            </ENSRecordSkeleton>
            <ENSRecordSkeleton isLoaded={!isLoading}>
              {address && <AddressCopy address={address} />}
            </ENSRecordSkeleton>
            <ENSRecordSkeleton isLoaded={!isLoading}>
              {ensRecords.description && (
                <Text textAlign="center" fontWeight={"medium"} color={color}>
                  {ensRecords.description}
                </Text>
              )}
            </ENSRecordSkeleton>
            <ENSRecordSkeleton isLoaded={!isLoading}>
              {ensRecords["com.github"] && (
                <Flex
                  border={"1px"}
                  borderColor={"gray.200"}
                  align="center"
                  mt={2}
                  p={4}
                  backgroundColor={"white"}
                  borderRadius={"md"}
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

              <HStack mt={2} spacing={2}>
                <ChatButton receiverAddress={address} />

                <DonateButton receiverAddress={address} />
              </HStack>
            </ENSRecordSkeleton>
          </Flex>
        </main>
      </Box>
    </>
  );
};

export default ProfilePage;
