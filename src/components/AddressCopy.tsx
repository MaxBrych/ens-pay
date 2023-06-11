import { useState } from "react";
import { Button, Tooltip, HStack, Text } from "@chakra-ui/react";
import { FaRegCopy } from "react-icons/fa";
import copy from "copy-to-clipboard";

interface AddressCopyProps {
  address: string;
}

const AddressCopy: React.FC<AddressCopyProps> = ({ address }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    copy(address);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  const truncatedAddress =
    address.slice(0, 6) + "..." + address.slice(address.length - 4);

  return (
    <HStack spacing={2}>
      <Text>{truncatedAddress}</Text>
      <Tooltip label={isCopied ? "Copied!" : "Copy address"} hasArrow>
        <Button size="sm" onClick={handleCopy} leftIcon={<FaRegCopy />}>
          Copy
        </Button>
      </Tooltip>
    </HStack>
  );
};

export default AddressCopy;
