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
import {
  ConnectWallet,
  useAddress,
  useDisconnect,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import { ConnectedWalletDetails } from "@thirdweb-dev/react/dist/declarations/src/wallet/ConnectWallet/Details";
import { Wallet } from "ethers";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  const address = useAddress();
  const disconnect = useDisconnect();
  const network = useNetworkMismatch();
  return (
    <Container maxW={"1200px"} py={2}>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <ConnectWallet />
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
                <Link href={`/profile/${address}`}> Profile </Link>
              </MenuItem>
              <MenuItem onClick={disconnect}>Sign Out</MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
    </Container>
  );
}
