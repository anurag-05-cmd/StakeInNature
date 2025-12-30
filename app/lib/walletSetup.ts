export const BDAG_TESTNET = {
  chainId: "0x413", // 1043 in decimal
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

// LocalStorage key for tracking token addition
const SIN_TOKEN_ADDED_KEY = "sin_token_added";

/**
 * Check if wallet is already on BDAG network
 */
export async function isOnBDAGNetwork(provider: any): Promise<boolean> {
  try {
    const chainId = await provider.request({ method: "eth_chainId" });
    return chainId === BDAG_TESTNET.chainId;
  } catch (error) {
    console.error("Error checking network:", error);
    return false;
  }
}

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
 * Check if SIN token was already added (tracked in localStorage)
 */
export function wasTokenAlreadyAdded(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SIN_TOKEN_ADDED_KEY) === "true";
}

/**
 * Mark SIN token as added in localStorage
 */
export function markTokenAsAdded(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SIN_TOKEN_ADDED_KEY, "true");
}

/**
 * Add SIN token to wallet (only if not already added)
 */
export async function addSINToken(provider: any): Promise<boolean> {
  // Skip if token was already added before
  if (wasTokenAlreadyAdded()) {
    console.log("SIN token was already added previously, skipping prompt");
    return true;
  }

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

    if (wasAdded) {
      markTokenAsAdded();
    }
    return wasAdded;
  } catch (error: any) {
    if (error.code === 4001) {
      console.log("User rejected token addition");
      // Still mark as handled so we don't prompt again
      markTokenAsAdded();
      return false;
    }
    console.error("Error adding SIN token:", error);
    throw error;
  }
}

/**
 * Setup BDAG network and SIN token after wallet connection
 * Only prompts if necessary (network not connected or token not added)
 */
export async function setupWalletForBDAG(provider: any): Promise<void> {
  try {
    // Check if already on BDAG network
    const alreadyOnBDAG = await isOnBDAGNetwork(provider);
    
    if (!alreadyOnBDAG) {
      // Only switch/add network if not already connected
      const networkAdded = await switchToBDAGNetwork(provider);
      if (!networkAdded) {
        console.log("Network switch was rejected or failed");
        return;
      }
    }
    
    // Only prompt for token if not already added
    if (!wasTokenAlreadyAdded()) {
      await addSINToken(provider);
    }
  } catch (error) {
    console.error("Error setting up wallet:", error);
    throw error;
  }
}
