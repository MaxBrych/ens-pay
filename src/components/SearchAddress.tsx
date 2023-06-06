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

  return <Box w={"full"}>// ... the rest of your code</Box>;
};

export default SearchAddress;
