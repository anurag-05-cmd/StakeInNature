"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import { 
  Droplet, 
  Settings, 
  FileText, 
  HelpCircle, 
  RotateCcw, 
  Wallet, 
  Coins, 
  Clock, 
  CheckCircle2, 
  Copy,
  ExternalLink,
  Zap,
  Info
} from "lucide-react";

export default function FaucetPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const networkDetails = {
    chainName: "BDAG Testnet",
    chainId: "1043",
    chainIdHex: "0x413",
    rpcUrl: "https://rpc.awakening.bdagscan.com",
    symbol: "BDAG",
    blockExplorer: "https://bdagscan.com",
    faucetUrl: "https://awakening.bdagscan.com/faucet",
    contractAddress: "0x693828A76c6f6E9161414ff2B9b0396433C34d8B",
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="px-3 py-1.5 text-xs bg-[#51bb0b]/10 hover:bg-[#51bb0b]/20 text-[#51bb0b] rounded-lg transition-all duration-200 flex items-center gap-1.5 border border-[#51bb0b]/20 hover:border-[#51bb0b]/40"
    >
      {copiedField === field ? (
        <>
          <CheckCircle2 size={14} />
          <span className="font-medium">Copied</span>
        </>
      ) : (
        <>
          <Copy size={14} />
          <span className="font-medium">Copy</span>
        </>
      )}
    </button>
  );

  const InfoRow = ({ label, value, field, mono = true }: { label: string; value: string; field: string; mono?: boolean }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-white/5 to-white/0 rounded-xl border border-white/10 hover:border-[#51bb0b]/30 transition-all duration-300 group">
      <div className="flex-1 min-w-0">
        <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
        <p className={`text-white ${mono ? 'font-mono' : 'font-semibold'} text-sm break-all`}>{value}</p>
      </div>
      <CopyButton text={value} field={field} />
    </div>
  );

  return (
    <div className="relative min-h-screen">
      {/* Dark overlay gradient for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent z-0" />

      <Navbar />

      <main className="relative z-10 flex items-center justify-center min-h-screen pt-24 pb-20 px-4">
        <div className="w-full md:w-[90%] max-w-6xl mx-auto space-y-6 md:space-y-8">
          
          {/* Hero Header */}
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-[#51bb0b]/20 rounded-full mb-4">
              <Droplet className="text-[#51bb0b]" size={40} />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              <span className="text-white">TESTNET </span>
              <span className="text-[#51bb0b]">RESOURCES</span>
            </h1>
            <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">
              Get testnet tokens and configure your wallet to interact with the BDAG network and SIN tokens
            </p>
          </div>

          {/* Quick Start CTA */}
          <div className="glass-navbar rounded-2xl p-6 md:p-8 border border-[#51bb0b]/30 bg-gradient-to-br from-[#51bb0b]/10 to-transparent">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-[#51bb0b]/20 rounded-xl">
                  <Zap className="text-[#51bb0b]" size={28} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Get Started in Seconds</h2>
                  <p className="text-white/70 text-sm">
                    Claim free BDAG testnet tokens to start staking and validating
                  </p>
                </div>
              </div>
              <a
                href={networkDetails.faucetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 bg-[#51bb0b] hover:bg-[#45a009] text-white font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(81,187,11,0.5)] hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                <Droplet size={20} />
                <span>Open Faucet</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            
            {/* Left Column */}
            <div className="space-y-6">
              
              {/* How to Get BDAG */}
              <div className="glass-navbar rounded-2xl p-6 md:p-8 space-y-6 border border-white/20">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Info className="text-blue-400" size={24} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">How to Claim</h2>
                </div>

                <div className="space-y-3">
                  {[
                    "Visit the BDAG Testnet Faucet",
                    "Connect your wallet or paste address",
                    "Complete verification if required",
                    "Request tokens and wait 10-30s",
                    "BDAG will be deposited to your wallet"
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#51bb0b]/20 rounded-full flex items-center justify-center">
                        <span className="text-[#51bb0b] text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-white/80 text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SIN Token Contract */}
              <div className="glass-navbar rounded-2xl p-6 md:p-8 space-y-6 border border-white/20">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <FileText className="text-purple-400" size={24} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">SIN Token</h2>
                </div>

                <div className="space-y-3">
                  <InfoRow 
                    label="Contract Address" 
                    value={networkDetails.contractAddress} 
                    field="contract" 
                  />
                  <InfoRow 
                    label="Token Symbol" 
                    value="SIN" 
                    field="tokenSymbol"
                    mono={false}
                  />
                  <InfoRow 
                    label="Decimals" 
                    value="18" 
                    field="decimals" 
                  />
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-start gap-3">
                  <HelpCircle size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-purple-200 text-sm">
                    Import the SIN token in your wallet using the contract address above. Symbol and decimals will auto-fill.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Network Configuration */}
              <div className="glass-navbar rounded-2xl p-6 md:p-8 space-y-6 border border-white/20">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Settings className="text-cyan-400" size={24} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Network Config</h2>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3 mb-4">
                  <Info size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-200 text-sm">
                    <span className="font-semibold">Manual Setup:</span> Add these network details to your wallet if auto-connection fails
                  </p>
                </div>

                <div className="space-y-3">
                  <InfoRow 
                    label="Network Name" 
                    value={networkDetails.chainName} 
                    field="chainName"
                    mono={false}
                  />
                  <InfoRow 
                    label="Chain ID" 
                    value={`${networkDetails.chainId} (${networkDetails.chainIdHex})`} 
                    field="chainId" 
                  />
                  <InfoRow 
                    label="RPC URL" 
                    value={networkDetails.rpcUrl} 
                    field="rpcUrl" 
                  />
                  <InfoRow 
                    label="Currency" 
                    value={networkDetails.symbol} 
                    field="symbol"
                    mono={false}
                  />
                  <InfoRow 
                    label="Block Explorer" 
                    value={networkDetails.blockExplorer} 
                    field="explorer" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Troubleshooting Section */}
          <div className="glass-navbar rounded-2xl p-6 md:p-8 space-y-6 border border-white/20">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <HelpCircle className="text-orange-400" size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Troubleshooting</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="group p-5 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 hover:border-[#51bb0b]/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <RotateCcw size={20} className="text-[#51bb0b]" />
                  <h3 className="text-white font-semibold text-sm">Network Won't Switch?</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  Disconnect wallet, refresh page, and reconnect. Approve the network switch request in your wallet popup.
                </p>
              </div>

              <div className="group p-5 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 hover:border-[#51bb0b]/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet size={20} className="text-[#51bb0b]" />
                  <h3 className="text-white font-semibold text-sm">No BDAG Balance?</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  Use the faucet button above to get free testnet BDAG. You need it for gas fees when transacting.
                </p>
              </div>

              <div className="group p-5 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 hover:border-[#51bb0b]/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Coins size={20} className="text-[#51bb0b]" />
                  <h3 className="text-white font-semibold text-sm">Can't See SIN Tokens?</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  Import the SIN token using the contract address above. Your wallet needs to know about custom tokens.
                </p>
              </div>

              <div className="group p-5 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 hover:border-[#51bb0b]/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={20} className="text-[#51bb0b]" />
                  <h3 className="text-white font-semibold text-sm">Transaction Pending?</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  BDAG transactions typically complete in 10-30 seconds. Check the block explorer if it takes longer.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
