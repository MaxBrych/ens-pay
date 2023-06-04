import Image from "next/image";
import { Inter } from "next/font/google";
import { Box } from "@chakra-ui/react";
import SearchAddress from "@/components/SearchAddress";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Box
      backgroundColor={"gray.50"}
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <SearchAddress />
    </Box>
  );
}
