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
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { ethers } from "ethers";
import { Inter, Manrope } from "next/font/google";
import Navbar from "@/components/NavBar";
import DonateButton from "@/components/Donate";
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
      const address = await provider.resolveName(ensName);
      setAddress(address);
      const result = await client.query({ query });

      if (provider && result.data && result.data.domains.length > 0) {
        const resolver = await provider.getResolver(ensName);
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
        setLoading(false);
      }
    };
    if (ensName && provider) {
      // ensure both ensName and provider are available
      getAllRecords(ensName as string);
    }

    if (ensName) {
      getAllRecords(ensName as string);
    }
  }, [ensName, provider]);

  return (
    <>
      <Navbar />
      <Box
        minHeight="100vh"
        w="full"
        backgroundColor={"gray.50"}
        className={` ${manrope.className}`}
      >
        <main className="w-full p-4 mt-4">
          <Flex direction="column" w="full" align="center">
            <ENSRecordSkeleton isLoaded={!isLoading}>
              <Image
                src={
                  ensRecords.avatar ||
                  "https://cdn.discordapp.com/attachments/1070670506052821083/1115515708802076763/MaxCJack60_small_town_people_living_with_robots_and_delivery_dr_40bd2932-6127-4391-a6c0-d9348f6d0db6.png"
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
              {ensRecords.description && (
                <Text
                  textAlign="center"
                  fontWeight={"medium"}
                  textColor={"gray.500"}
                >
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
                    href={ensRecords["com.github"]}
                    h={"full"}
                    w={"full"}
                    isExternal
                  >
                    <Icon as={FaGithub} boxSize={6} mr={2} />
                    <Text fontSize={"lg"} fontWeight={"semibold"}>
                      {ensRecords["com.github"]}
                    </Text>
                  </Link>
                </Flex>
              )}

              <DonateButton receiverAddress={address} />
            </ENSRecordSkeleton>
          </Flex>
        </main>
      </Box>
    </>
  );
};

export default ProfilePage;
