import { NextRequest, NextResponse } from "next/server";
import {
  getStakedBalance,
  getTokenBalance,
  isUserValidated,
  getUserData,
} from "@/app/lib/contractHelper";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userAddress, amount, toAddress } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "getStakedBalance": {
        if (!userAddress) {
          return NextResponse.json(
            { error: "userAddress is required" },
            { status: 400 }
          );
        }
        const balance = await getStakedBalance(userAddress);
        return NextResponse.json({ stakedBalance: balance });
      }

      case "getTokenBalance": {
        if (!userAddress) {
          return NextResponse.json(
            { error: "userAddress is required" },
            { status: 400 }
          );
        }
        const balance = await getTokenBalance(userAddress);
        return NextResponse.json({ tokenBalance: balance });
      }

      case "isValidated": {
        if (!userAddress) {
          return NextResponse.json(
            { error: "userAddress is required" },
            { status: 400 }
          );
        }
        const validated = await isUserValidated(userAddress);
        return NextResponse.json({ isValidated: validated });
      }

      case "getUserData": {
        if (!userAddress) {
          return NextResponse.json(
            { error: "userAddress is required" },
            { status: 400 }
          );
        }
        const userData = await getUserData(userAddress);
        return NextResponse.json(userData);
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Contract interaction error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Contract interaction failed",
      },
      { status: 500 }
    );
  }
}
