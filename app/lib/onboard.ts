import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";

const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

const injected = injectedModule();

const walletConnect = walletConnectModule({
  projectId: WALLETCONNECT_PROJECT_ID,
  dappUrl: process.env.NEXT_PUBLIC_DAPP_URL || "http://localhost:3000",
  requiredChains: [1], // Ethereum mainnet
  optionalChains: [42161, 8453, 10, 137, 56], // Arbitrum, Base, Optimism, Polygon, BSC
});

export const onboard = Onboard({
  wallets: [injected, walletConnect],
  chains: [
    {
      id: "0x20C49",
      token: "BDAG",
      label: "BDAG Testnet",
      rpcUrl: "https://rpc.awakening.bdagscan.com",
    },
  ],
  appMetadata: {
    name: "Stake In Nature",
    icon: "/logo-black.png",
    logo: "/logo-black.png",
    description: "Proof of Honesty for a Greener Economy",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
    ],
  },
  connect: {
    autoConnectLastWallet: true,
  },
});
