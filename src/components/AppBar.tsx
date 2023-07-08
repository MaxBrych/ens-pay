import { Box, useBreakpoint, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ConnectKit } from "./ConnectKit";
import { ConnectKitButton } from "connectkit";
import { ConnectWallet } from "@thirdweb-dev/react";
import Nav from "./ui/navigation/Nav";
import Image from "next/image";
import { useAccount, useEnsName, useEnsResolver } from "wagmi";
import Navbar from "./NavBar";
import {
  HiOutlineDocumentText,
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineViewList,
} from "react-icons/hi";
import Sidebar from "./Sidebar";

const ethersDynamic: Promise<any> = import("ethers");

export default function AppBar() {
  const { address } = useAccount();
  const [provider, setProvider] = useState<any>(null);
  const [ensName, setENSName] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const displayIcon = useBreakpointValue({ base: "none", md: "flex" });

  const SidebarVisibilityButton = sidebarVisible
    ? HiOutlineViewList
    : HiOutlineSearch;

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
    <Box className="fixed bottom-0 z-50 flex justify-between md:w-[280px] gap-3 md:p-4 bg-white border md:static w-[100vw] max-h-16 md:max-h-screen md:min-h-screen border-t-gray-300 md:border-r-gray-300 md:flex-col">
      <Box
        flexDirection={{ base: "row", md: "column" }}
        display={"flex"}
        gap={"2"}
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
        {ensName && (
          <Nav cta="Profile" ensName={ensName} Icon={HiOutlineUser} />
        )}
        {displayIcon === "flex" && (
          <Nav cta="Settings" Icon={HiOutlineViewList} />
        )}
        {displayIcon === "none" && (
          <Nav
            cta="Search"
            onClick={() => setSidebarVisible(!sidebarVisible)}
            Icon={SidebarVisibilityButton}
          />
        )}
      </Box>
      <Box className="fixed z-50 top-4 right-4 md:right-auto md:left-auto md:top-auto md:bottom-8">
        <Navbar />
      </Box>
      {sidebarVisible && displayIcon === "none" && <Sidebar />}
    </Box>
  );
}
