import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Box, Heading, Text, Image, Flex, Icon, Link } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const ethersDynamic: Promise<any> = import("ethers");

const ProfilePage = () => {
  const [provider, setProvider] = useState<any>(null);

  const router = useRouter();
  const { ensName } = router.query;

  const [ensRecords, setEnsRecords] = useState<Record<string, string>>({});

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

      const result = await client.query({ query });
      console.log(result.data);

      if (provider && result.data && result.data.domains.length > 0) {
        const resolver = await provider.getResolver(ensName);
        const textRecords = await Promise.all(
          result.data.domains[0].resolver.texts.map((key: string) =>
            resolver.getText(key)
          )
        );
        console.log(textRecords);

        // Store the results in the component's state.
        const newRecords: Record<string, string> = {};
        result.data.domains[0].resolver.texts.forEach(
          (text: string, index: number) => {
            newRecords[text] = textRecords[index];
          }
        );
        setEnsRecords(newRecords);
      }
    };

    if (ensName) {
      getAllRecords(ensName as string);
    }
  }, [ensName, provider]);

  return (
    <Box p={4} minHeight="100vh" w="full" backgroundColor={"gray.50"}>
      <Box
        p={4}
        className="credit-card"
        shadow="lg"
        bg="white"
        mx="auto"
        rounded="xl"
        w="full"
      >
        <main className="w-full p-4 mt-4">
          <Flex direction="column" w="full" align="center" mt={4} p={4}>
            <Image
              src={ensRecords.avatar || "/placeholder.jpg"}
              alt="Avatar"
              boxSize="200px"
              rounded="full"
            />
            <Heading as="h1" size="2xl" textAlign="center">
              {ensName || ""}
            </Heading>
            {ensRecords.description && (
              <Text mt={4} textAlign="center">
                {ensRecords.description}
              </Text>
            )}
            {ensRecords["com.github"] && (
              <Flex align="center" mt={4}>
                <Icon as={FaGithub} boxSize={6} mr={2} />
                <Link href={ensRecords["com.github"]} isExternal>
                  {ensRecords["com.github"]}
                </Link>
              </Flex>
            )}
          </Flex>
        </main>
      </Box>
    </Box>
  );
};

export default ProfilePage;
