import { useState, useRef, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";

const ethersDynamic: Promise<any> = import("ethers");

const SearchAddress = () => {
  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
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

  const getName = async (input: string) => {
    setIsLoading(true);
    setIsError(false);

    if (provider) {
      if (input.includes(".eth")) {
        const resolvedAddress = await provider.resolveName(input);
        setIsLoading(false);

        if (resolvedAddress) {
          return resolvedAddress;
        } else {
          setIsError(true);
          return input;
        }
      } else {
        const resolvedName = await provider.lookupAddress(input);
        setIsLoading(false);

        if (resolvedName) {
          return resolvedName;
        } else {
          setIsError(true);
          return input;
        }
      }
    }

    setIsLoading(false);
    setIsError(true);
    return input;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (addrRef.current) {
      const userInput = addrRef.current.value.trim(); // trim to remove any leading or trailing spaces

      // Check if userInput is empty
      if (!userInput) {
        toast({
          title: "Input is missing.",
          description: "Please input an ENS name or Ethereum address.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Check if userInput ends with ".eth"
      if (!userInput.endsWith(".eth")) {
        toast({
          title: "Invalid ENS Name",
          description: "ENS name must end with .eth",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // If all checks pass, proceed to route to profile
      router.push(`/profile/${userInput}`);
    }
  };

  return (
    <Box w={"full"}>
      <Box p={1} className="credit-card" mx="auto" w="full" maxW={"lg"}>
        <FormControl
          as="form"
          onSubmit={handleSubmit}
          id="addr"
          justifyContent={"center"}
          alignItems={"center"}
          display={"flex"}
          flexDirection={"column"}
        >
          <Input
            borderRadius={"full"}
            h={{ base: "6", md: "12" }}
            fontWeight={"medium"}
            backgroundColor={"gray.200"}
            fontSize={{ base: "xs", md: "sm" }}
            ref={addrRef}
            placeholder="ETH Address or ENS Name"
            isInvalid={isError}
          ></Input>
          {isError && (
            <Text color="red.500" mt={2}>
              Please input a valid ENS name (ending with .eth)
            </Text>
          )}
        </FormControl>
      </Box>
    </Box>
  );
};

export default SearchAddress;
