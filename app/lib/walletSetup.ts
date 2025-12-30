export const BDAG_TESTNET = {
  chainId: "0x20C49", // 134217 in decimal
  chainName: "BDAG Testnet",
  nativeCurrency: {
    name: "BDAG",
    symbol: "BDAG",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.awakening.bdagscan.com"],
  blockExplorerUrls: ["https://bdagscan.com"],
};

export const SIN_TOKEN = {
  address: "0x693828A76c6f6E9161414ff2B9b0396433C34d8B",
  symbol: "SIN",
  decimals: 18,
  image: "/logo-black.png",
};

/**
 * Add BDAG testnet network to wallet
 */
export async function addBDAGNetwork(provider: any): Promise<boolean> {
  try {
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [BDAG_TESTNET],
    });
    return true;
  } catch (error: any) {
    // Error code 4001 means user rejected the request
    if (error.code === 4001) {
      console.log("User rejected network addition");
      return false;
    }
    console.error("Error adding BDAG network:", error);
    throw error;
  }
}

/**
 * Switch to BDAG testnet network
 */
export async function switchToBDAGNetwork(provider: any): Promise<boolean> {
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BDAG_TESTNET.chainId }],
    });
    return true;
  } catch (error: any) {
    // Error code 4902 means the chain hasn't been added yet
    if (error.code === 4902) {
      return await addBDAGNetwork(provider);
    }
    // Error code 4001 means user rejected
    if (error.code === 4001) {
      console.log("User rejected network switch");
      return false;
    }
    console.error("Error switching to BDAG network:", error);
    throw error;
  }
}

/**
 * Add SIN token to wallet
 */
export async function addSINToken(provider: any): Promise<boolean> {
  try {
    const wasAdded = await provider.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: SIN_TOKEN.address,
          symbol: SIN_TOKEN.symbol,
          decimals: SIN_TOKEN.decimals,
          image: `${window.location.origin}${SIN_TOKEN.image}`,
        },
      },
    });

    return wasAdded;
  } catch (error: any) {
    if (error.code === 4001) {
      console.log("User rejected token addition");
      return false;
    }
    console.error("Error adding SIN token:", error);
    throw error;
  }
}

/**
 * Setup BDAG network and SIN token after wallet connection
 */
export async function setupWalletForBDAG(provider: any): Promise<void> {
  try {
    // First, switch to or add BDAG network
    const networkAdded = await switchToBDAGNetwork(provider);
    
    if (networkAdded) {
      // Then add SIN token
      await addSINToken(provider);
    }
  } catch (error) {
    console.error("Error setting up wallet:", error);
    throw error;
  }
}
