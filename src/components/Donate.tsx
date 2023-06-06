import { Button, ButtonGroup } from "@chakra-ui/react";
import { ethers } from "ethers";
import { WalletInstance, useWallet } from "@thirdweb-dev/react";

const USDC_CONTRACT_ADDRESS = "0x..."; // Your USDC contract address here
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
    <ButtonGroup>
      {DONATION_AMOUNTS.map((amount) => (
        <Button
          key={amount}
          onClick={() => handleDonate(amount)}
        >{`Donate $${amount}`}</Button>
      ))}
    </ButtonGroup>
  );
}
