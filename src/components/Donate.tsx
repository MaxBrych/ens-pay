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
import { BiCoffeeTogo } from "react-icons/bi"; // for coffee icon
import {
  WalletInstance,
  useAddress,
  useChainId,
  useWallet,
  useContract,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const USDC_CONTRACT_ADDRESS = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"; // Polygon USDC contract address
const DECIMALS = 6; // USDC has 6 decimals
const CONTRACT_ADDRESS = "0x9c8b3ff4ec56363daED3caB2d449bdA279D14e37"; // Your contract address

// Prepare USDC contract instance
const contractABI = [
  // transfer function
  "function transfer(address recipient, uint256 amount) public returns (bool)",
];

interface DonateButtonProps {
  receiverAddress: any;
}

export default function DonateButton({ receiverAddress }: DonateButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const wallet: WalletInstance | undefined = useWallet();
  const [usdcContract, setUsdcContract] = useState<ethers.Contract | null>(
    null
  );
  const chainId = useChainId();
  const account = useAddress();
  const [senderEnsName, setSenderEnsName] = useState<string | null>(null);
  const [receiverEnsName, setReceiverEnsName] = useState<string | null>(null);
  const [ensProvider, setEnsProvider] =
    useState<ethers.providers.Provider | null>(null);

  useEffect(() => {
    const loadProviderAndSigner = async () => {
      if (!wallet) {
        console.log("No wallet available");
        return;
      }

      const signer = await wallet.getSigner();
      console.log("Got signer:", signer);

      const ethersDynamic: any = await import("ethers");
      const usdcContract = new ethersDynamic.Contract(
        USDC_CONTRACT_ADDRESS,
        contractABI,
        signer
      );
      setUsdcContract(usdcContract);

      const provider = new ethersDynamic.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_PROVIDER_URL
      );
      setEnsProvider(provider);
    };
    loadProviderAndSigner();
  }, [wallet]);

  useEffect(() => {
    const resolveNames = async () => {
      if (!ensProvider || !account || !receiverAddress) return;
      const senderName = await ensProvider.lookupAddress(account);
      const receiverName = await ensProvider.lookupAddress(receiverAddress);
      setSenderEnsName(senderName);
      setReceiverEnsName(receiverName);
    };

    resolveNames();
  }, [ensProvider, account, receiverAddress]);

  const toast = useToast();

  const { contract } = useContract(CONTRACT_ADDRESS);
  const { mutateAsync: transferAndRecord, isLoading } = useContractWrite(
    contract,
    "addToBlockchain"
  );
  // Use useContractRead to get all transactions
  const { data: transactions, isLoading: isLoadingTransactions } =
    useContractRead(contract, "getAllTransactions");

  async function handleDonate(amount: number, message: string) {
    if (!wallet || !account) {
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

    if (amount <= 0) {
      toast({
        title: "Invalid amount.",
        description: "Please enter a positive donation amount.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (message.length > 200) {
      toast({
        title: "Message too long.",
        description: "Please keep your message under 200 characters.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const ethersDynamic: any = await import("ethers");
    const value = ethersDynamic.utils.parseUnits(amount.toString(), DECIMALS);

    // Record the transaction details in the contract and perform the transfer
    const tx: any = await transferAndRecord({
      args: [receiverAddress, value, message],
    });

    const provider = new ethersDynamic.providers.Web3Provider(window.ethereum);
    await provider.waitForTransaction(tx.hash);
  }

  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");

  return (
    <>
      <VStack>
        <IconButton
          color="black"
          bg="gray.200"
          aria-label="Send Message"
          icon={<BiCoffeeTogo />}
          onClick={onOpen}
          rounded={"full"}
          size={"lg"}
        />
        <Text
          fontSize="xs"
          className="font-semibold"
          textColor={"blackAlpha.600"}
        >
          Support
        </Text>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Support</ModalHeader>
          <ModalCloseButton />
          <ModalBody textColor={"white"}>
            <Flex direction="column" gap={4}>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                placeholder="Amount (USDC)"
              />
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message"
              />
              <Button
                onClick={() => {
                  handleDonate(amount, message);
                  onClose();
                }}
              >
                Donate
              </Button>
            </Flex>
            {isLoadingTransactions ? (
              <div>Loading transactions...</div>
            ) : (
              transactions?.map((transaction: any, index: any) => (
                <div key={index}>
                  <div>Sender: {senderEnsName}</div>
                  <div>Receiver: {receiverEnsName}</div>
                  <div>
                    Amount:{" "}
                    {ethers.utils.formatUnits(transaction.amount, DECIMALS)}
                  </div>
                  <div>Message: {transaction.message}</div>
                  <div>
                    Timestamp:{" "}
                    {new Date(transaction.timestamp * 1000).toLocaleString()}
                  </div>
                  <hr />
                </div>
              ))
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
