import { useEffect, useState, useRef, FormEvent } from "react";

import {
  Box,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Text,
  Image,
  Flex,
  Icon,
  Link,
} from "@chakra-ui/react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { FaGithub } from "react-icons/fa";

const ethersDynamic: Promise<any> = import("ethers");

const Profile = () => {
  const [provider, setProvider] = useState<any>(null);
  const [names, setNames] = useState<{ [key: string]: string }>({});
  const addrRef = useRef<HTMLInputElement>(null);
  const [ensRecords, setEnsRecords] = useState<Record<string, string>>({});

  useEffect(() => {
    ethersDynamic.then((ethers) => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://spring-red-dinghy.discover.quiknode.pro/54a9c39cdfc6a8085cfb75f545ce67a66249d4ac/"
      );
      setProvider(provider);
    });
  }, []);

  const getName = async (addr: string) => {
    if (names[addr]) return names[addr];

    console.log("fetching address.. ");
    if (provider) {
      const resolvedName = await provider.lookupAddress(addr);
      setNames((prev) => ({ ...prev, [addr]: resolvedName ?? addr }));
      getAllRecords(resolvedName ?? addr);
      return resolvedName ?? addr;
    }
  };

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("typed addr", addrRef.current?.value);
    if (addrRef.current) {
      getName(addrRef.current.value);
    }
  };

  return (
    <Box m={4} p={4}>
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
            {ensRecords.avatar && (
              <Image
                src={ensRecords.avatar}
                alt="Avatar"
                boxSize="200px"
                rounded="full"
              />
            )}
            <Heading as="h1" size="2xl" textAlign="center">
              {names[addrRef.current?.value || ""]}
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
          <FormControl id="addr" mt={4}>
            <FormLabel>ETH Address:</FormLabel>
            <Input ref={addrRef} placeholder="ETH Address" />
            <Button mt={3} colorScheme="blue" onClick={handleSubmit}>
              Resolve Name
            </Button>
          </FormControl>
        </main>
      </Box>
    </Box>
  );
};

export default Profile;
