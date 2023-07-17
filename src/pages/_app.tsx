"use client";
import "@/styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  ThirdwebProvider,
  coinbaseWallet,
  localWallet,
  metamaskWallet,
  smartWallet,
} from "@thirdweb-dev/react";
import { API_KEY, SMART_WALLET } from "@/utils/addresses";
import { WagmiConfig, createConfig } from "wagmi";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
  SIWESession,
} from "connectkit";
import { siweClient } from "@/utils/siweClient";

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.ALCHEMY_ID || "", // or infuraId
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID || "",

    // Required
    appName: "ENS-Pay",

    // Optional
    appDescription: "Your public ENS Bagpack 🎒",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

import type { AppProps } from "next/app";

const activeChain = "polygon";
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "white",
        color: "gray.700",
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <siweClient.Provider
        // Optional parameters
        enabled={true} // defaults true
        nonceRefetchInterval={300000} // in milliseconds, defaults to 5 minutes
        sessionRefetchInterval={300000} // in milliseconds, defaults to 5 minutes
        signOutOnDisconnect={true} // defaults true
        signOutOnAccountChange={true} // defaults true
        signOutOnNetworkChange={true} // defaults true
      >
        <ConnectKitProvider>
          <ThirdwebProvider
            activeChain={activeChain}
            supportedWallets={[coinbaseWallet(), metamaskWallet()]}
          >
            <ChakraProvider theme={theme}>
              <Component {...pageProps} />
            </ChakraProvider>
          </ThirdwebProvider>
        </ConnectKitProvider>
      </siweClient.Provider>
    </WagmiConfig>
  );
}
