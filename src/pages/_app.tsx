import "@/styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
} from "@thirdweb-dev/react";
import { mode } from "@chakra-ui/theme-tools"; // <-- import the mode function

import type { AppProps } from "next/app";

const activeChain = "polygon";
const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode("gray.100", "#0a0b0d")(props),
        color: mode("gray.700", "white")(props),
      },
    }),
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      supportedWallets={[coinbaseWallet(), metamaskWallet()]}
    >
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}
