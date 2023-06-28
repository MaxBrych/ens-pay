import React from "react";
import { Button, IconButton, VStack, Text } from "@chakra-ui/react";
import { FaShareAlt } from "react-icons/fa";
import { color } from "framer-motion";

export default function ShareButton() {
  const handleShare = async () => {
    if (!navigator.share) {
      alert(`Your browser doesn't support Web Share API`);
      return;
    }

    try {
      await navigator.share({
        title: "Share Title",
        text: "Share this awesome content!",
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <VStack>
      <IconButton
        colorScheme="blackAlpha"
        aria-label="Send Message"
        icon={<FaShareAlt />}
        onClick={handleShare}
        rounded={"full"}
        size={"lg"}
      />
      <Text
        fontSize="xs"
        className="font-semibold"
        textColor={"blackAlpha.600"}
      >
        Share
      </Text>
    </VStack>
  );
}
