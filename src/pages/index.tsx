import Image from "next/image";
import { Inter, Manrope } from "next/font/google";
import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import SearchAddress from "@/components/SearchAddress";
import Navbar from "@/components/NavBar";
import { ConnectKitButton } from "connectkit";
import { ConnectKit } from "@/components/ConnectKit";
import NavBarNew from "@/components/NavBarNew";
import AppBar from "@/components/AppBar";
import Sidebar from "@/components/Sidebar";
import Main from "@/components/Main";

const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });

export default function Home() {
  const bg = "gray.50";
  const color = "gray.700";

  return (
    <Container
      display={"flex"}
      justifyContent={"space-between"}
      maxWidth={"6xl"}
      w={"full"}
      p={0}
    >
      <AppBar />
      <Container width={"full"} pt={"16"}>
        Feed
      </Container>
      <Sidebar />
    </Container>
  );
}
