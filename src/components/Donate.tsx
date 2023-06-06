// Donate.tsx

import {
  Button,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { FaCoffee } from "react-icons/fa"; // for coffee icon
import { ethers } from "ethers";
import { WalletInstance, useWallet } from "@thirdweb-dev/react";

const USDC_CONTRACT_ADDRESS = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"; // Polygon USDC contract address
const DECIMALS = 6; // USDC has 6 decimals
const DONATION_AMOUNTS = [5, 10, 25];

// Prepare USDC contract instance
const contractABI = [
  // transfer function
  "function transfer(address recipient, uint256 amount) public returns (bool)",
];

// Create provider and signer for Polygon network
const provider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_PROVIDER_URL
);
const signer = provider.getSigner();
const usdcContract = new ethers.Contract(
  USDC_CONTRACT_ADDRESS,
  contractABI,
  signer
);

interface DonateButtonProps {
  receiverAddress: any;
}

export default function DonateButton({ receiverAddress }: DonateButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const wallet: WalletInstance | undefined = useWallet();
  const connect = wallet?.connect;

  async function handleDonate(amount: number) {
    // Ensure wallet is connected
    const account = connect && (await connect());

    if (!account) {
      return;
    }

    // Prepare transaction
    const value = ethers.utils.parseUnits(amount.toString(), DECIMALS);
    const tx = await usdcContract.transfer(receiverAddress, value);

    // Wait for transaction to be mined
    await provider.waitForTransaction(tx.hash);
  }

  return (
    <>
      <Button
        leftIcon={<Icon as={FaCoffee} />}
        colorScheme="blue"
        onClick={onOpen}
      >
        Support Me
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Support Me</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
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
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
