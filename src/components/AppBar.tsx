import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { ConnectKit } from "./ConnectKit";
import { ConnectKitButton } from "connectkit";
import { ConnectWallet } from "@thirdweb-dev/react";
import Nav from "./ui/navigation/Nav";
import Image from "next/image";
import { useAccount } from "wagmi";

export default function AppBar() {
  const { address } = useAccount();

  return (
    <Box className="fixed bottom-0 z-50 flex justify-between md:w-full gap-3 p-4 bg-white border md:static w-[100vw] max-h-16 md:max-h-screen md:min-h-screen max-w-1/4 border-t-gray-300 md:border-r-gray-300 md:flex-col">
      <Box
        flexDirection={"column"}
        display={"flex"}
        gap={"2"}
        className="fixed z-50"
      >
        <Image
          src={
            "https://cdn.discordapp.com/attachments/911669935363752026/1126195320070623364/logoo.png"
          }
          width={48}
          height={48}
          alt={"logo"}
          className="hidden md:flex"
        />
        <Nav cta="Home" />
        <Nav cta="Contacts" />
        <Nav cta="Transactions" />
        <Nav cta="Profile" ensName={address} />
        <Nav cta="Settings" />
      </Box>
      <Box className="fixed z-50 top-4 right-4 md:right-auto md:left-auto md:bottom-8">
        <ConnectKitButton mode="light" theme="soft" />
      </Box>
    </Box>
  );
}
