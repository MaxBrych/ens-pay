import { Box } from "@chakra-ui/react";
import React from "react";
import SearchAddress from "./SearchAddress";
import Navbar from "./NavBar";
import Image from "next/image";

export default function Sidebar() {
  return (
    <Box className="fixed flex w-[100vw] h-16 top-0 z-40 items-center md:items-start justify-start md:w-[280px] gap-3 px-4 bg-white md:static md:h-full md:max-h-screen md:min-h-screen border border-b-gray-300 md:border-l-gray-300 md:flex-col">
      <Box className="flex md:hidden">
        <Navbar />
      </Box>
      <Image
        src={
          "https://cdn.discordapp.com/attachments/911669935363752026/1126195320070623364/logoo.png"
        }
        width={48}
        height={48}
        alt={"logo"}
        className="flex md:hidden"
      />
      <Box className="w-full bg-white md:h-16 md:w-full md:flex md:items-center md:justify-center md:fixed md:z-50 y-0">
        <SearchAddress />
      </Box>
      <Box className="hidden md:flex-col md:gap-2 md:flex">Recommendations</Box>
    </Box>
  );
}
