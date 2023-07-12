import { Box, useBreakpoint, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ConnectKit } from "../../ConnectKit";
import { ConnectKitButton } from "connectkit";
import { ConnectWallet } from "@thirdweb-dev/react";
import Nav from "./Nav";
import Image from "next/image";
import { useAccount, useEnsName, useEnsResolver } from "wagmi";
import Navbar from "../../NavBar";
import {
  HiOutlineDocumentText,
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineViewList,
} from "react-icons/hi";
import Sidebar from "../../Sidebar";

const ethersDynamic: Promise<any> = import("ethers");

export default function AppBar() {
  const { address } = useAccount();
  const [provider, setProvider] = useState<any>(null);
  const [ensName, setENSName] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const displayIcon = useBreakpointValue({ base: "none", md: "flex" });

  useEffect(() => {
    ethersDynamic.then((ethers) => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://spring-red-dinghy.discover.quiknode.pro/54a9c39cdfc6a8085cfb75f545ce67a66249d4ac/"
      );
      setProvider(provider);
    });
  }, []);

  useEffect(() => {
    if (address && provider) {
      const resolveENSName = async () => {
        const resolvedName = await provider.lookupAddress(address);
        return resolvedName ?? address;
      };

      resolveENSName().then((ensName) => {
        setENSName(ensName);
      });
    }
  }, [address, provider]);

  return (
    <Box className="fixed bottom-0 z-50 flex justify-between md:w-[280px] md:gap-3 md:p-4 bg-white md:static w-[100vw] max-h-[72px] md:max-h-screen md:min-h-screen border border-t-gray-300 md:border-r-gray-300 md:flex-col">
      <Box
        flexDirection={{ base: "row", md: "column" }}
        display={"flex"}
        gap={"2"}
        className="flex justify-between w-full"
        px={4}
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
        <Nav cta="Home" Icon={HiOutlineHome} />
        <Nav cta="Contacts" Icon={HiOutlineUserGroup} />
        <Nav cta="Transactions" Icon={HiOutlineDocumentText} />

        {displayIcon === "flex" && (
          <Nav cta="Settings" Icon={HiOutlineViewList} />
        )}
        {displayIcon === "none" && <Nav cta="Search" Icon={HiOutlineSearch} />}
      </Box>
      <Box className="z-50 hidden md:flex top-4 right-4 md:right-auto md:left-auto md:top-auto md:bottom-8">
        <Navbar />
        <ConnectWallet />
      </Box>
    </Box>
  );
}
