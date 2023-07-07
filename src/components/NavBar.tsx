import {
  Avatar,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { ConnectWallet, useAddress, useDisconnect } from "@thirdweb-dev/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ethersDynamic: Promise<any> = import("ethers");

export default function Navbar() {
  const address = useAddress();
  const disconnect = useDisconnect();
  const [provider, setProvider] = useState<any>(null);
  const [ensName, setENSName] = useState<string | null>(null);

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
    <>
      {!address ? (
        <ConnectWallet btnTitle="Sign In" theme="light" />
      ) : (
        <Menu>
          <MenuButton>
            <Avatar
              size="sm"
              src={
                "https://pbs.twimg.com/profile_images/977496875887558661/L86xyLF4_400x400.jpg"
              }
            />
          </MenuButton>
          <MenuList>
            <MenuItem>
              {ensName && <Link href={`/profile/${ensName}`}> Profile </Link>}
            </MenuItem>
            <MenuItem onClick={disconnect}>Sign Out</MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  );
}
