import { useRouter } from "next/router";
import { IconButton, Text, VStack } from "@chakra-ui/react";
import { FaRegComment } from "react-icons/fa";

interface ChatButtonProps {
  receiverAddress: any;
}

const ChatButton: React.FC<ChatButtonProps> = ({ receiverAddress }) => {
  const router = useRouter();

  const handleOnClick = () => {
    router.push(`https://chat.blockscan.com/index?a=${receiverAddress}`);
  };

  return (
    <VStack>
      <IconButton
        aria-label="Send Message"
        icon={<FaRegComment />}
        onClick={handleOnClick}
      />
      <Text fontSize="sm">Send Message</Text>
    </VStack>
  );
};

export default ChatButton;
