// SearchAddress.tsx

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
import { ethers } from "ethers";

const SearchAddress = () => {
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(
    null
  );
  const [address, setAddress] = useState("");
  const toast = useToast();
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    import("ethers").then((ethers) => {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_PROVIDER_URL
      );
      setProvider(provider);
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Check if ENS is used
    let checkedAddress: string;
    if (address.includes(".eth")) {
      try {
        const resolvedAddress = await provider?.resolveName(address);
        if (!resolvedAddress) {
          throw new Error("ENS name not resolved");
        } else {
          checkedAddress = resolvedAddress;
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    } else {
      checkedAddress = address;
    }

    // Check address
    try {
      ethers.utils.getAddress(checkedAddress);
      router.push(`/user/${checkedAddress}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid address.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box my={8}>
      <form onSubmit={handleSubmit}>
        <FormControl id="address">
          <FormLabel>Address</FormLabel>
          <Input ref={ref} onChange={(e) => setAddress(e.target.value)} />
        </FormControl>
        <Button mt={4} colorScheme="teal" type="submit">
          Search
        </Button>
      </form>
    </Box>
  );
};

export default SearchAddress;
