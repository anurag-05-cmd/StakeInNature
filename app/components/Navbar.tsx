"use client";

import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("Home");

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "SIN Validator", href: "/validate" },
    { label: "Faucet", href: "#" },
    { label: "Rewards", href: "#" },
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
              href={link.href}
              onClick={() => setActiveLink(link.label)}
              className={`nav-link text-white font-medium text-sm tracking-wide transition-colors duration-200 hover:text-[#51bb0b] ${
                activeLink === link.label ? "text-[#51bb0b]" : ""
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side - Connect Wallet button */}
        <button className="connect-wallet-btn bg-white text-[#51bb0b] font-semibold text-sm tracking-wide px-6 py-2.5 rounded-full transition-all duration-300 hover:bg-[#51bb0b] hover:text-white hover:shadow-lg hover:scale-105 whitespace-nowrap border border-transparent hover:border-white/20">
          Connect Wallet
        </button>
      </div>
    </nav>
  );
}
