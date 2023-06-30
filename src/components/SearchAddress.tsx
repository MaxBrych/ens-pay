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
            placeholder="ETH Address or ENS Name"
            isInvalid={isError}
          ></Input>
          {isError && (
            <Text color="red.500" mt={2}>
              Please input a valid ENS name (ending with .eth)
            </Text>
          )}
        </FormControl>
        <Link
          className="w-full mt-8 text-xs font-semibold text-center text-gray-500 underline md:text-sm underline-offset-1"
          href="https://app.ens.domains/"
          target="_blank"
        >
          Get a ENS name here!
        </Link>
      </Box>
    </Box>
  );
};

export default SearchAddress;
