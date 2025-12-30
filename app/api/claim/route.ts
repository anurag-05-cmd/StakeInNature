import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";

const CONTRACT_ABI = [
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
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
];

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.awakening.bdagscan.com";
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x693828A76c6f6E9161414ff2B9b0396433C34d8B";
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || "";

// Claim amount: 5000 SIN tokens
const CLAIM_AMOUNT = ethers.parseEther("5000");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAddress } = body;

    if (!userAddress) {
      return NextResponse.json(
        { error: "userAddress is required" },
        { status: 400 }
      );
    }

    if (!ADMIN_PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create provider and admin signer
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, adminWallet);

    // Check if user already has tokens (to prevent multiple claims)
    const currentBalance = await contract.balanceOf(userAddress);
    if (currentBalance > BigInt(0)) {
      return NextResponse.json(
        { error: "You have already claimed SIN tokens", alreadyClaimed: true },
        { status: 400 }
      );
    }

    // Mint 5000 SIN tokens to user
    const tx = await contract.mint(userAddress, CLAIM_AMOUNT);
    await tx.wait();

    return NextResponse.json({
      success: true,
      message: "Successfully claimed 5000 SIN tokens!",
      txHash: tx.hash,
      amount: "5000",
    });
  } catch (error) {
    console.error("Claim error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to claim tokens" },
      { status: 500 }
    );
  }
}
