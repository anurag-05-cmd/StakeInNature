"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { firstValueFrom } from "rxjs";
import { onboard } from "../lib/onboard";
import { setupWalletForBDAG } from "../lib/walletSetup";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("Home");
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [stakedBalance, setStakedBalance] = useState<string>("0");
  const hasSetupWallet = useRef(false);
  const isManualConnect = useRef(false);

  useEffect(() => {
    // Subscribe to wallet changes
    const wallets = onboard.state.select("wallets");
    const subscription = wallets.subscribe(async (connectedWallets) => {
      if (connectedWallets && connectedWallets.length > 0) {
        const wallet = connectedWallets[0];
        const address = wallet.accounts?.[0]?.address;
        setConnectedAddress(address || null);

        // Only setup BDAG network and SIN token on manual connect, not auto-reconnect
        if (address && wallet.provider && isManualConnect.current && !hasSetupWallet.current) {
          try {
            hasSetupWallet.current = true;
            await setupWalletForBDAG(wallet.provider);
          } catch (error) {
            console.error("Failed to setup wallet:", error);
          } finally {
            isManualConnect.current = false;
          }
        }
      } else {
        setConnectedAddress(null);
        setStakedBalance("0");
        hasSetupWallet.current = false;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch staked balance when wallet connects and periodically refresh
  useEffect(() => {
    const fetchStakedBalance = async () => {
      if (!connectedAddress) return;

      try {
        const response = await fetch("/api/contract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "getStakedBalance",
            userAddress: connectedAddress,
          }),
        });
        const data = await response.json();
        setStakedBalance(data.stakedBalance || "0");
      } catch (error) {
        console.error("Failed to fetch staked balance:", error);
      }
    };

    // Fetch immediately
    fetchStakedBalance();

    // Also refresh every 3 seconds to catch updates after staking
    const interval = setInterval(fetchStakedBalance, 3000);

    return () => clearInterval(interval);
  }, [connectedAddress]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    isManualConnect.current = true;
    try {
      await onboard.connectWallet();
      setShowDropdown(false);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      isManualConnect.current = false;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      const wallets = onboard.state.select("wallets");
      const currentWallets = await firstValueFrom(wallets);
      
      if (currentWallets && currentWallets.length > 0) {
        const walletLabel = currentWallets[0].label;
        await onboard.disconnectWallet({ label: walletLabel });
        
        // Force state update
        setConnectedAddress(null);
        setShowDropdown(false);
        
        // Log for debugging
        console.log(`Wallet ${walletLabel} disconnected successfully`);
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      // Still reset UI even if there's an error
      setConnectedAddress(null);
      setShowDropdown(false);
    }
  };

  const displayAddress = connectedAddress
    ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`
    : null;

  const hasMinimumStake = parseFloat(stakedBalance) >= 900;

  const navLinks = [
    { label: "Home", href: "/", disabled: false },
    { label: "SIN Validator", href: "/validate", disabled: !hasMinimumStake },
    { label: "Faucet", href: "#", disabled: false },
    { label: "Rewards", href: "#", disabled: false },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl">
      <div className="glass-navbar flex items-center justify-between px-8 py-4 rounded-full">
        {/* Left side - Logo and brand name */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo-black.png"
            alt="Stake In Nature Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-white font-bold text-xl whitespace-nowrap tracking-tight">
            Stake In Nature
          </span>
        </div>

        {/* Center - Navigation links */}
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.disabled ? "#" : link.href}
              onClick={(e) => {
                if (link.disabled) {
                  e.preventDefault();
                } else {
                  setActiveLink(link.label);
                }
              }}
              className={`nav-link font-medium text-sm tracking-wide transition-colors duration-200 ${
                link.disabled
                  ? "text-white/30 cursor-not-allowed"
                  : "text-white hover:text-[#51bb0b]"
              } ${
                activeLink === link.label && !link.disabled ? "text-[#51bb0b]" : ""
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side - Connect Wallet button / Wallet dropdown */}
        <div className="relative">
          {!connectedAddress ? (
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="connect-wallet-btn bg-white text-[#51bb0b] font-semibold text-sm tracking-wide px-6 py-2.5 rounded-full transition-all duration-300 hover:bg-[#51bb0b] hover:text-white hover:shadow-lg hover:scale-105 whitespace-nowrap border border-transparent hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="connect-wallet-btn bg-white text-[#51bb0b] font-semibold text-sm tracking-wide px-6 py-2.5 rounded-full transition-all duration-300 hover:bg-[#51bb0b] hover:text-white hover:shadow-lg hover:scale-105 whitespace-nowrap border border-transparent hover:border-white/20 flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-[#51bb0b] rounded-full inline-block"></span>
                {displayAddress}
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/20 rounded-xl shadow-lg glass-navbar overflow-hidden z-50">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDisconnectWallet();
                    }}
                    className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-colors duration-200 font-semibold text-sm flex items-center gap-2"
                  >
                    <span>🔌</span> Disconnect Wallet
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
