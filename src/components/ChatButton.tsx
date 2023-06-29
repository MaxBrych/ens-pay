import { useRouter } from "next/router";
import { IconButton, Text, VStack } from "@chakra-ui/react";
import { FaRegComment } from "react-icons/fa";
import { BsFillChatFill } from "react-icons/bs";

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
        color="black"
        bg="gray.200"
        aria-label="Send Message"
        icon={<BsFillChatFill />}
        onClick={handleOnClick}
        rounded={"full"}
        size={"lg"}
      />
      <Text
        fontSize="xs"
        className="font-semibold"
        textColor={"blackAlpha.600"}
      >
        Chat
      </Text>
    </VStack>
  );
};

export default ChatButton;
