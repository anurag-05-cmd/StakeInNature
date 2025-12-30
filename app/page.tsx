"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Image from "next/image";
import { onboard } from "./lib/onboard";
import { firstValueFrom } from "rxjs";

export default function Home() {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});
  const [userData, setUserData] = useState<{
    tokenBalance: string;
    stakedBalance: string;
    isValidated: boolean;
  } | null>(null);
  const [isStaking, setIsStaking] = useState(false);
  const [stakeAmount, setStakeAmount] = useState<string>("900");

  // Subscribe to wallet connection changes
  useEffect(() => {
    const wallets = onboard.state.select("wallets");
    const subscription = wallets.subscribe((connectedWallets) => {
      if (connectedWallets && connectedWallets.length > 0) {
        const address = connectedWallets[0].accounts?.[0]?.address;
        setConnectedAddress(address || null);
      } else {
        setConnectedAddress(null);
        setUserData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user data when connected
  useEffect(() => {
    if (connectedAddress) {
      fetchUserData();
    }
  }, [connectedAddress]);

  const fetchUserData = async () => {
    if (!connectedAddress) return;

    try {
      const response = await fetch("/api/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getUserData",
          userAddress: connectedAddress,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setUserData(data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleClaimSIN = async () => {
    if (!connectedAddress) {
      // Connect wallet first
      try {
        await onboard.connectWallet();
        return;
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        return;
      }
    }

    setIsClaiming(true);
    setClaimStatus({});

    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: connectedAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        setClaimStatus({
          success: false,
          message: data.error || "Failed to claim tokens",
        });
        return;
      }

      setClaimStatus({
        success: true,
        message: data.message,
      });

      // Refresh user data after claiming
      await fetchUserData();
    } catch (error) {
      setClaimStatus({
        success: false,
        message: error instanceof Error ? error.message : "Failed to claim tokens",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  const handleStake = async () => {
    if (!connectedAddress) {
      setClaimStatus({
        success: false,
        message: "Please connect your wallet first",
      });
      return;
    }

    const stakeAmountNum = parseFloat(stakeAmount);
    if (isNaN(stakeAmountNum) || stakeAmountNum < 900) {
      setClaimStatus({
        success: false,
        message: "Minimum stake is 900 SIN",
      });
      return;
    }

    if (userData && parseFloat(userData.tokenBalance) < stakeAmountNum) {
      setClaimStatus({
        success: false,
        message: "Insufficient balance",
      });
      return;
    }

    setIsStaking(true);
    setClaimStatus({});

    try {
      const { ethers } = await import("ethers");
      const wallets = onboard.state.select("wallets");
      const currentWallets = await firstValueFrom(wallets);
      
      if (!currentWallets || currentWallets.length === 0) {
        throw new Error("No wallet connected");
      }

      console.log("Setting up provider and signer...");
      const provider = currentWallets[0].provider;
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      
      console.log("Signer address:", await signer.getAddress());

      // Import contract helper
      const { getContractWithSigner } = await import("./lib/contractHelper");
      
      const contract = getContractWithSigner(signer);
      const amountInWei = ethers.parseEther(stakeAmount);
      
      console.log(`Staking ${ethers.formatEther(amountInWei)} SIN...`);
      
      // Check current staked balance
      const currentStaked = await contract.getStakedBalance(connectedAddress);
      console.log(`Current staked balance: ${ethers.formatEther(currentStaked)} SIN`);
      
      const tx = await contract.stake(amountInWei);
      console.log("Transaction sent:", tx.hash);
      
      await tx.wait();
      console.log("Transaction confirmed!");
      
      // Verify new balance
      const newStaked = await contract.getStakedBalance(connectedAddress);
      console.log(`New staked balance: ${ethers.formatEther(newStaked)} SIN`);

      setClaimStatus({
        success: true,
        message: `Successfully staked ${stakeAmount} SIN!`,
      });

      // Refresh user data
      await fetchUserData();
    } catch (error) {
      setClaimStatus({
        success: false,
        message: error instanceof Error ? error.message : "Failed to stake tokens",
      });
    } finally {
      setIsStaking(false);
    }
  };

  // Check if user can access validator (has >= 900 SIN staked)
  const canAccessValidator =
    userData && parseFloat(userData.stakedBalance) >= 900;
  
  // Check if user has already claimed (has any token balance or staked balance)
  const hasAlreadyClaimed =
    userData &&
    (parseFloat(userData.tokenBalance) > 0 ||
      parseFloat(userData.stakedBalance) > 0);

  return (
    <div className="relative min-h-screen">
      {/* Dark overlay gradient for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent z-0" />
      
      <Navbar />
      
      <main className="relative z-10 flex items-center justify-center min-h-screen pt-20">
        <div className="w-[90%] max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="flex flex-col gap-6">
              {/* Main Heading with refined styling */}
              <div className="space-y-2">
                <h1 className="text-[5rem] lg:text-[6rem] font-black leading-[0.9] tracking-tight">
                  <span className="block text-white hero-gradient-text">STAKE</span>
                  <span className="block text-[#51bb0b] hero-gradient-text-green">IN NATURE</span>
                </h1>
              </div>
              
              {/* Subtitle with subtle styling */}
              <h2 className="text-xl lg:text-2xl font-medium text-white/90 tracking-wide max-w-md">
                Proof of Honesty for a Greener Economy
              </h2>
              
              {/* Divider line */}
              <div className="w-20 h-1 bg-gradient-to-r from-[#51bb0b] to-transparent rounded-full" />
              
              {/* Description with refined typography */}
              <div className="space-y-3 text-white/80 text-base lg:text-lg leading-relaxed max-w-lg">
                <p>
                  <span className="text-white/95">Blockchain-powered</span> incentives that reward honest recycling work.
                </p>
                <p className="flex gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <span className="text-[#51bb0b] font-semibold">Stake</span>
                    <span className="text-white/70">your commitment.</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="text-[#51bb0b] font-semibold">Prove</span>
                    <span className="text-white/70">your impact.</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="text-[#51bb0b] font-semibold">Earn</span>
                    <span className="text-white/70">transparently.</span>
                  </span>
                </p>
              </div>

              {/* User Balance Display */}
              {connectedAddress && userData && (
                <div className="glass-navbar rounded-xl p-4 space-y-2 border border-white/20">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Token Balance:</span>
                    <span className="text-white font-bold">{parseFloat(userData.tokenBalance).toFixed(2)} SIN</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Staked Balance:</span>
                    <span className="text-[#51bb0b] font-bold">{parseFloat(userData.stakedBalance).toFixed(2)} SIN</span>
                  </div>
                  {userData.isValidated && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Status:</span>
                      <span className="text-green-400 font-bold flex items-center gap-1">
                        ✓ Validated
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Claim Status Message */}
              {claimStatus.message && (
                <div
                  className={`p-3 rounded-lg ${
                    claimStatus.success
                      ? "bg-green-500/20 border border-green-500/50 text-green-300"
                      : "bg-red-500/20 border border-red-500/50 text-red-300"
                  }`}
                >
                  {claimStatus.message}
                </div>
              )}

              {/* Stake Input (only show if not yet staked minimum) */}
              {connectedAddress && userData && parseFloat(userData.stakedBalance) < 900 && (
                <div className="glass-navbar rounded-xl p-4 space-y-3 border border-white/20">
                  <label className="text-white/80 text-sm font-medium">
                    Amount to Stake (minimum 900 SIN):
                  </label>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    min="900"
                    step="1"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#51bb0b]"
                    placeholder="900"
                  />
                </div>
              )}
              
              {/* CTA Buttons with refined styling */}
              <div className="flex gap-4 mt-6">
                {!canAccessValidator ? (
                  <button
                    onClick={handleStake}
                    disabled={
                      isStaking ||
                      !connectedAddress ||
                      !userData ||
                      parseFloat(userData.tokenBalance) < 900
                    }
                    className={`group relative px-8 py-4 font-semibold rounded-full overflow-hidden transition-all duration-300 ${
                      isStaking || !connectedAddress || !userData || parseFloat(userData.tokenBalance) < 900
                        ? "bg-gray-500/50 text-white/50 cursor-not-allowed"
                        : "bg-[#51bb0b] text-white hover:shadow-[0_0_30px_rgba(81,187,11,0.5)] hover:scale-[1.02]"
                    }`}
                  >
                    <span className="relative z-10 uppercase tracking-wider text-sm">
                      {isStaking ? "Staking..." : "Stake SIN"}
                    </span>
                    {!isStaking && connectedAddress && userData && parseFloat(userData.tokenBalance) >= 900 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#45a009] to-[#51bb0b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </button>
                ) : (
                  <a
                    href="/validate"
                    className="group relative px-8 py-4 bg-[#51bb0b] text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(81,187,11,0.5)] hover:scale-[1.02]"
                  >
                    <span className="relative z-10 uppercase tracking-wider text-sm">Validate</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#45a009] to-[#51bb0b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                )}
                
                <button
                  onClick={handleClaimSIN}
                  disabled={isClaiming || hasAlreadyClaimed}
                  className={`group relative px-8 py-4 font-semibold rounded-full border overflow-hidden transition-all duration-300 ${
                    hasAlreadyClaimed
                      ? "bg-gray-500/20 text-white/50 border-white/10 cursor-not-allowed"
                      : isClaiming
                        ? "bg-white/10 text-white border-white/20 cursor-wait"
                        : "bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white hover:text-[#51bb0b] hover:border-white hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10 uppercase tracking-wider text-sm">
                    {!connectedAddress
                      ? "Connect to Claim"
                      : isClaiming
                        ? "Claiming..."
                        : hasAlreadyClaimed
                          ? "Already Claimed"
                          : "Claim 5000 SIN"}
                  </span>
                </button>
              </div>
            </div>

            {/* Right side - Logo with sophisticated effects */}
            <div className="flex justify-center items-center lg:justify-end">
              <div className="relative">
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 bg-[#51bb0b]/20 blur-[80px] rounded-full scale-110" />
                
                <div className="relative w-[400px] h-[400px] lg:w-[500px] lg:h-[500px]">
                  <Image
                    src="/logo-3d.png"
                    alt="Stake In Nature 3D Logo"
                    fill
                    className="object-contain animate-float-refined drop-shadow-[0_20px_60px_rgba(81,187,11,0.4)]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}