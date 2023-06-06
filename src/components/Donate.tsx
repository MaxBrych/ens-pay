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

const USDC_CONTRACT_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // Your USDC contract address here
const DECIMALS = 6; // USDC has 6 decimals
const DONATION_AMOUNTS = [5, 10, 25];

// Prepare USDC contract instance
const contractABI = [
  // transfer function
  "function transfer(address recipient, uint256 amount) public returns (bool)",
];

// Use type assertion to let TypeScript know that window.ethereum is available
const provider = new ethers.providers.Web3Provider(window.ethereum as any);
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
    const account = wallet?.connect && (await wallet.connect());

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
            <ButtonGroup spacing={4}>
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
            </ButtonGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
