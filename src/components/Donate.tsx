import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Icon,
  useToast,
  VStack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { FaCoffee } from "react-icons/fa"; // for coffee icon
import {
  WalletInstance,
  useAddress,
  useNetwork,
  useWallet,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const USDC_CONTRACT_ADDRESS = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"; // Polygon USDC contract address
const DECIMALS = 6; // USDC has 6 decimals
const DONATION_AMOUNTS = [5, 10, 25];

// Prepare USDC contract instance
const contractABI = [
  // transfer function
  "function transfer(address recipient, uint256 amount) public returns (bool)",
];

interface DonateButtonProps {
  receiverAddress: any;
}

import { useChainId } from "@thirdweb-dev/react";

export default function DonateButton({ receiverAddress }: DonateButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const wallet: WalletInstance | undefined = useWallet();
  const connect = wallet?.connect;
  const [provider, setProvider] =
    useState<ethers.providers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [usdcContract, setUsdcContract] = useState<ethers.Contract | null>(
    null
  );
  const chainId = useChainId(); // Replace useNetwork() with useChainId()
  const account = useAddress();

  useEffect(() => {
    const loadProviderAndSigner = async () => {
      const ethersDynamic: any = await import("ethers");
      const provider = new ethersDynamic.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_POLYGON_HTTPS
      );
      const signer = provider.getSigner();
      const usdcContract = new ethersDynamic.Contract(
        USDC_CONTRACT_ADDRESS,
        contractABI,
        signer
      );
      setProvider(provider);
      setSigner(signer);
      setUsdcContract(usdcContract);
    };
    loadProviderAndSigner();
  }, []);

  const toast = useToast();

  async function handleDonate(amount: number) {
    if (!provider || !signer || !usdcContract || !wallet || !account) {
      return;
    }

    if (chainId !== 137) {
      // 137 is the chainId for Polygon mainnet
      toast({
        title: "Network error.",
        description: "Please connect to the Polygon mainnet.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!account) {
      return;
    }

    const ethersDynamic: any = await import("ethers");
    const value = ethersDynamic.utils.parseUnits(amount.toString(), DECIMALS);
    const tx = await usdcContract.transfer(receiverAddress, value);

    await provider.waitForTransaction(tx.hash);
  }

  return (
    <>
      <VStack>
        <IconButton
          aria-label="Send Message"
          icon={<FaCoffee />}
          onClick={onOpen}
        />
        <Text fontSize="sm">Support Me</Text>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Support Me</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="row" gap={4}>
              {DONATION_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  onClick={() => {
                    handleDonate(amount);
                    onClose();
                  }}
                >
                  {`Donate $${amount}`}
                </Button>
              ))}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
