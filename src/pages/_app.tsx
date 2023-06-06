import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import {
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
} from "@thirdweb-dev/react";
import type { AppProps } from "next/app";

const activeChain = "mumbai";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      supportedWallets={[coinbaseWallet(), metamaskWallet()]}
    >
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}
