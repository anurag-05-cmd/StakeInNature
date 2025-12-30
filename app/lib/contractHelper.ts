import { ethers } from "ethers";

// Contract ABI - import from your artifacts
const CONTRACT_ABI = [
  {
    type: "function",
    name: "stake",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unstake",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unstakeAll",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "validateUser",
    inputs: [{ name: "user", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "slashUser",
    inputs: [{ name: "user", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getStakedBalance",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isValidated",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
];

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "";

// Get read-only provider
function getProvider() {
  return new ethers.JsonRpcProvider(RPC_URL);
}

// Get contract instance for reading
function getContractReadOnly() {
  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

// Get contract instance for writing (requires signer)
export function getContractWithSigner(signer: ethers.Signer) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

/**
 * Get staked balance for a user
 */
export async function getStakedBalance(userAddress: string): Promise<string> {
  try {
    const contract = getContractReadOnly();
    const balance = await contract.getStakedBalance(userAddress);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error getting staked balance:", error);
    throw error;
  }
}

/**
 * Get token balance for a user
 */
export async function getTokenBalance(userAddress: string): Promise<string> {
  try {
    const contract = getContractReadOnly();
    const balance = await contract.balanceOf(userAddress);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error getting token balance:", error);
    throw error;
  }
}

/**
 * Check if user is validated
 */
export async function isUserValidated(userAddress: string): Promise<boolean> {
  try {
    const contract = getContractReadOnly();
    return await contract.isValidated(userAddress);
  } catch (error) {
    console.error("Error checking user validation:", error);
    throw error;
  }
}

/**
 * Stake tokens (requires signer)
 */
export async function stakeTokens(
  signer: ethers.Signer,
  amount: string
): Promise<ethers.ContractTransactionResponse | null> {
  try {
    const contract = getContractWithSigner(signer);
    const amountInWei = ethers.parseEther(amount);
    const tx = await contract.stake(amountInWei);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error staking tokens:", error);
    throw error;
  }
}

/**
 * Unstake specific amount (requires signer)
 */
export async function unstakeTokens(
  signer: ethers.Signer,
  amount: string
): Promise<ethers.ContractTransactionResponse | null> {
  try {
    const contract = getContractWithSigner(signer);
    const amountInWei = ethers.parseEther(amount);
    const tx = await contract.unstake(amountInWei);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error unstaking tokens:", error);
    throw error;
  }
}

/**
 * Unstake all tokens (requires signer)
 */
export async function unstakeAllTokens(
  signer: ethers.Signer
): Promise<ethers.ContractTransactionResponse | null> {
  try {
    const contract = getContractWithSigner(signer);
    const tx = await contract.unstakeAll();
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error unstaking all tokens:", error);
    throw error;
  }
}

/**
 * Validate a user (requires owner/admin signer)
 */
export async function validateUser(
  signer: ethers.Signer,
  userAddress: string
): Promise<ethers.ContractTransactionResponse | null> {
  try {
    const contract = getContractWithSigner(signer);
    const tx = await contract.validateUser(userAddress);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error validating user:", error);
    throw error;
  }
}

/**
 * Slash a user (requires owner/admin signer)
 */
export async function slashUser(
  signer: ethers.Signer,
  userAddress: string
): Promise<ethers.ContractTransactionResponse | null> {
  try {
    const contract = getContractWithSigner(signer);
    const tx = await contract.slashUser(userAddress);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error slashing user:", error);
    throw error;
  }
}

/**
 * Mint tokens (requires owner/admin signer)
 */
export async function mintTokens(
  signer: ethers.Signer,
  toAddress: string,
  amount: string
): Promise<ethers.ContractTransactionResponse | null> {
  try {
    const contract = getContractWithSigner(signer);
    const amountInWei = ethers.parseEther(amount);
    const tx = await contract.mint(toAddress, amountInWei);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error minting tokens:", error);
    throw error;
  }
}

/**
 * Get complete user data
 */
export async function getUserData(userAddress: string) {
  try {
    const [stakedBalance, tokenBalance, isValidated] = await Promise.all([
      getStakedBalance(userAddress),
      getTokenBalance(userAddress),
      isUserValidated(userAddress),
    ]);

    return {
      address: userAddress,
      stakedBalance,
      tokenBalance,
      isValidated,
      hasMinimumStake: parseFloat(stakedBalance) >= 900,
    };
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
}

export default {
  getStakedBalance,
  getTokenBalance,
  isUserValidated,
  stakeTokens,
  unstakeTokens,
  unstakeAllTokens,
  validateUser,
  slashUser,
  mintTokens,
  getUserData,
};
