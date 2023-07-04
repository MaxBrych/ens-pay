import Image from "next/image";
import { Inter, Manrope } from "next/font/google";
import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import SearchAddress from "@/components/SearchAddress";
import Navbar from "@/components/NavBar";
import { ConnectKitButton } from "connectkit";
import { ConnectKit } from "@/components/ConnectKit";
import NavBarNew from "@/components/NavBarNew";
import AppBar from "@/components/AppBar";
import Recommendation from "@/components/Recommendation";
import Main from "@/components/Main";

const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });

export default function Home() {
  const bg = "gray.50";
  const color = "gray.700";

  return (
    <Container maxWidth={"5xl"}>
      <Box
        color={color}
        className={`flex min-h-screen bg-white ${manrope.className}`}
      >
        <AppBar />
        <Main />
        <Recommendation />
      </Box>
    </Container>
  );
}
