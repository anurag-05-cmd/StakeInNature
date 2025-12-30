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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleDisconnectWallet = () => {
    localStorage.clear();
    window.location.reload();
  };

  const displayAddress = connectedAddress
    ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`
    : null;

  const hasMinimumStake = parseFloat(stakedBalance) >= 900;

  const navLinks = [
    { label: "Home", href: "/", disabled: false },
    { label: "SIN Validator", href: "/validate", disabled: !hasMinimumStake },
    { label: "Faucet", href: "/faucet", disabled: false },
    { label: "Rewards", href: "/rewards", disabled: false },
  ];

  return (
    <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[90%] max-w-6xl">
      <div className="glass-navbar flex items-center justify-between px-4 md:px-8 py-3 md:py-4 rounded-full">
        {/* Left side - Logo and brand name */}
        <div className="flex items-center gap-2 md:gap-3">
          <Image
            src="/logo-black.png"
            alt="Stake In Nature Logo"
            width={32}
            height={32}
            className="object-contain md:w-10 md:h-10"
          />
          <span className="text-white font-bold text-base md:text-xl whitespace-nowrap tracking-tight">
            Stake In Nature
          </span>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white p-2 hover:text-[#51bb0b] transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation - Center links */}
        <div className="hidden md:flex items-center gap-8">
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

        {/* Desktop - Right side Connect Wallet button */}
        <div className="hidden md:block relative">
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 glass-navbar rounded-3xl overflow-hidden">
          <div className="flex flex-col p-4 space-y-2">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.disabled ? "#" : link.href}
                onClick={(e) => {
                  if (link.disabled) {
                    e.preventDefault();
                  } else {
                    setActiveLink(link.label);
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={`px-4 py-3 rounded-xl font-medium text-sm tracking-wide transition-all duration-200 ${
                  link.disabled
                    ? "text-white/30 cursor-not-allowed"
                    : "text-white hover:bg-white/10 hover:text-[#51bb0b]"
                } ${
                  activeLink === link.label && !link.disabled
                    ? "bg-white/10 text-[#51bb0b]"
                    : ""
                }`}
              >
                {link.label}
              </a>
            ))}
            
            {/* Mobile Connect Wallet Button */}
            <div className="pt-2 border-t border-white/10">
              {!connectedAddress ? (
                <button
                  onClick={() => {
                    handleConnectWallet();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isConnecting}
                  className="w-full bg-white text-[#51bb0b] font-semibold text-sm tracking-wide px-6 py-3 rounded-xl transition-all duration-300 hover:bg-[#51bb0b] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="px-4 py-3 bg-white/10 rounded-xl text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#51bb0b] rounded-full inline-block"></span>
                    {displayAddress}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDisconnectWallet();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 rounded-xl transition-colors duration-200 font-semibold text-sm flex items-center gap-2"
                  >
                    <span>🔌</span> Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
