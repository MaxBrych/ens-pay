import { useState, useRef, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const ethersDynamic: Promise<any> = import("ethers");
const SearchAddress = () => {
  const [provider, setProvider] = useState<any>(null);
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
    if (provider) {
      const resolvedName = await provider.lookupAddress(addr);
      return resolvedName ?? addr;
    }

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
        <FormControl id="addr" mt={4}>
          <FormLabel>ETH Address:</FormLabel>
          <Input ref={addrRef} placeholder="ETH Address" />
          <Button mt={3} colorScheme="blue" onClick={handleSubmit}>
            Resolve Name
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
};

export default SearchAddress;
