import { useState, useRef, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const ethersDynamic: Promise<any> = import("ethers");

const SearchAddress = () => {
  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const addrRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const toast = useToast();

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
      if (addrRef.current.value) {
        getName(addrRef.current.value).then((ensName) => {
          router.push(`/profile/${ensName}`);
        });
      } else {
        toast({
          title: "Address is missing.",
          description: "Please input an address.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box w={"full"}>
      <Box p={1} className="credit-card" mx="auto" w="full" maxW={"lg"}>
        <FormControl
          as="form"
          onSubmit={handleSubmit} // Added onSubmit prop
          id="addr"
          mt={1}
          justifyContent={"center"}
          alignItems={"center"}
          display={"flex"}
          flexDirection={"column"}
        >
          <FormLabel
            textAlign={"center"}
            mb={3}
            textColor={"gray.700"}
            fontSize={{ base: "3xl", md: "4xl" }}
            lineHeight={"1.1"}
            fontWeight={"black"}
          >
            Explore your Web3 bagpack
          </FormLabel>
          <Button
            mb={4}
            textAlign={"center"}
            fontSize={{ base: "xs", md: "lg" }}
            fontWeight={"semibold"}
            textColor={"gray.500"}
            type="submit"
            className="cursor-default"
            isLoading={isLoading}
            loadingText="Resolving..."
            colorScheme="transparent"
            w={{ base: "auto", md: "auto" }}
          >
            Show of your ENS Profile like you’ve never had before
          </Button>
          <Input
            borderRadius={{ base: "xl", md: "2xl" }}
            h={{ base: "16", md: "20" }}
            fontWeight={"bold"}
            backgroundColor={"white"}
            fontSize={{ base: "lg", md: "xl" }}
            ref={addrRef}
            placeholder="ETH Address"
          ></Input>
        </FormControl>
      </Box>
    </Box>
  );
};

export default SearchAddress;
