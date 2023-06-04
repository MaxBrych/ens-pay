import { useState, useRef, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const ethersDynamic: Promise<any> = import("ethers");

const SearchAddress = () => {
  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const addrRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    ethersDynamic.then((ethers) => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://spring-red-dinghy.discover.quiknode.pro/54a9c39cdfc6a8085cfb75f545ce67a66249d4ac/"
      );
      setProvider(provider);
    });
  }, []);

  const getName = async (addr: string) => {
    setIsLoading(true);
    if (provider) {
      const resolvedName = await provider.lookupAddress(addr);
      setIsLoading(false);
      return resolvedName ?? addr;
    }

    setIsLoading(false);
    return addr;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (addrRef.current) {
      getName(addrRef.current.value).then((ensName) => {
        router.push(`/profile/${ensName}`);
      });
    }
  };

  return (
    <Box w={"full"}>
      <Box p={1} className="credit-card" mx="auto" w="full" maxW={"lg"}>
        <FormControl
          id="addr"
          mt={1}
          justifyContent={"center"}
          alignItems={"center"}
          display={"flex"}
          flexDirection={"column"}
        >
          <FormLabel
            textAlign={"center"}
            mb={4}
            textColor={"gray.700"}
            fontSize={"4xl"}
            lineHeight={"1.1"}
            fontWeight={"black"}
          >
            Search for your <br />
            ETH address
          </FormLabel>
          <FormLabel
            mb={8}
            textAlign={"center"}
            fontSize={"lg"}
            fontWeight={"semibold"}
            textColor={"gray.500"}
          >
            We'll find your ENS name
          </FormLabel>
          <Input
            borderRadius={"2xl"}
            h={"20"}
            fontWeight={"bold"}
            backgroundColor={"white"}
            fontSize={"xl"}
            ref={addrRef}
            placeholder="ETH Address"
          ></Input>
          <Button
            size={"lg"}
            w={"full"}
            borderRadius={"full"}
            mt={6}
            fontSize={"lg"}
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Resolving..."
          >
            Resolve Name
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
};

export default SearchAddress;
