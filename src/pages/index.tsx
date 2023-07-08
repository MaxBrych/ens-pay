import { useEffect } from "react";
import { useRouter } from "next/router";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { Container } from "@chakra-ui/react";
import AppBar from "@/components/AppBar";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const router = useRouter();
  const address = useAddress();

  useEffect(() => {
    if (address) {
      router.push("/home");
    }
  }, [address]);

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
        <ConnectWallet />
      </Container>
      <Sidebar />
    </Container>
  );
}
