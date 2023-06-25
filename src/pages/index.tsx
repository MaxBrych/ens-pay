import Image from "next/image";
import { Inter, Manrope } from "next/font/google";
import { Box, useColorModeValue } from "@chakra-ui/react";
import SearchAddress from "@/components/SearchAddress";
import Navbar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });

export default function Home() {
  const bg = useColorModeValue("gray.50", "#0a0b0d");
  const color = useColorModeValue("gray.700", "white");
  return (
    <>
      <Box
        color={color}
        className={`flex bg-hero-img background-cover-bottom object-cover object-bottom min-h-screen flex-col items-center justify-center pb-[33vh] p-4 ${manrope.className}`}
      >
        <Navbar />
        <SearchAddress />
      </Box>
    </>
  );
}
