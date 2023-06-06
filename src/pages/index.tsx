import Image from "next/image";
import { Inter, Manrope } from "next/font/google";
import { Box } from "@chakra-ui/react";
import SearchAddress from "@/components/SearchAddress";
import Navbar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Navbar />
      <Box
        backgroundColor={"gray.50"}
        className={`flex min-h-screen flex-col items-center justify-center p-4 ${manrope.className}`}
      >
        <SearchAddress />
      </Box>
    </>
  );
}
