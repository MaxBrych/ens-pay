import { Box } from "@chakra-ui/react";
import React from "react";
import { ConnectKit } from "./ConnectKit";
import { ConnectKitButton } from "connectkit";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function AppBar() {
  return (
    <Box className="w-full min-h-screen border max-w-1/4 border-r-gray-300">
      AppBar
      <ConnectKitButton mode="light" theme="soft" />
    </Box>
  );
}
