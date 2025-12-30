"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

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
      className="ml-2 px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-all duration-200"
    >
      {copiedField === field ? "✓ Copied!" : "Copy"}
    </button>
  );

  return (
    <div className="relative min-h-screen">
      {/* Dark overlay gradient for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent z-0" />

      <Navbar />

      <main className="relative z-10 flex items-center justify-center min-h-screen pt-24 pb-10">
        <div className="w-[90%] max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-[3rem] lg:text-[4rem] font-black leading-tight tracking-tight">
              <span className="text-white">GET </span>
              <span className="text-[#51bb0b]">BDAG</span>
              <span className="text-white"> TOKENS</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Before you can stake SIN tokens, you need BDAG (native gas tokens) to pay for transaction fees on the network.
            </p>
          </div>

          {/* Faucet Section */}
          <div className="glass-navbar rounded-2xl p-8 space-y-6 border border-white/20">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🚰</span>
              <div>
                <h2 className="text-2xl font-bold text-white">BDAG Faucet</h2>
                <p className="text-white/60">Get free testnet BDAG tokens</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#51bb0b]/10 border border-[#51bb0b]/30 rounded-xl p-6">
                <h3 className="text-[#51bb0b] font-bold text-lg mb-3">📋 How to get BDAG tokens:</h3>
                <ol className="text-white/80 space-y-3 list-decimal list-inside">
                  <li>Visit the official BDAG Testnet Faucet below</li>
                  <li>Connect your wallet or paste your wallet address</li>
                  <li>Complete any verification if required</li>
                  <li>Click "Request Tokens" to receive free BDAG</li>
                  <li>Wait for the transaction to complete (usually ~10-30 seconds)</li>
                  <li>Your wallet will be funded with BDAG for gas fees!</li>
                </ol>
              </div>

              <a
                href={networkDetails.faucetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-[#51bb0b] to-[#45a009] hover:from-[#45a009] hover:to-[#51bb0b] text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 text-center text-lg hover:shadow-lg hover:shadow-[#51bb0b]/30"
              >
                🔗 Open BDAG Faucet
              </a>

              <p className="text-white/50 text-sm text-center">
                Faucet URL: {networkDetails.faucetUrl}
              </p>
            </div>
          </div>

          {/* Network Details Section */}
          <div className="glass-navbar rounded-2xl p-8 space-y-6 border border-white/20">
            <div className="flex items-center gap-3">
              <span className="text-4xl">⚙️</span>
              <div>
                <h2 className="text-2xl font-bold text-white">Network Details</h2>
                <p className="text-white/60">Add BDAG Testnet to your wallet manually</p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-yellow-200 text-sm">
                <span className="font-bold">💡 Tip:</span> If you're having trouble connecting automatically, 
                you can add the network manually using the details below.
              </p>
            </div>

            <div className="space-y-4">
              {/* Network Name */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <p className="text-white/60 text-sm font-medium">Network Name</p>
                  <p className="text-white font-mono">{networkDetails.chainName}</p>
                </div>
                <CopyButton text={networkDetails.chainName} field="chainName" />
              </div>

              {/* Chain ID */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <p className="text-white/60 text-sm font-medium">Chain ID</p>
                  <p className="text-white font-mono">{networkDetails.chainId} <span className="text-white/50">(hex: {networkDetails.chainIdHex})</span></p>
                </div>
                <CopyButton text={networkDetails.chainId} field="chainId" />
              </div>

              {/* RPC URL */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <p className="text-white/60 text-sm font-medium">RPC URL</p>
                  <p className="text-white font-mono text-sm break-all">{networkDetails.rpcUrl}</p>
                </div>
                <CopyButton text={networkDetails.rpcUrl} field="rpcUrl" />
              </div>

              {/* Currency Symbol */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <p className="text-white/60 text-sm font-medium">Currency Symbol</p>
                  <p className="text-white font-mono">{networkDetails.symbol}</p>
                </div>
                <CopyButton text={networkDetails.symbol} field="symbol" />
              </div>

              {/* Block Explorer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <p className="text-white/60 text-sm font-medium">Block Explorer</p>
                  <p className="text-white font-mono text-sm">{networkDetails.blockExplorer}</p>
                </div>
                <CopyButton text={networkDetails.blockExplorer} field="explorer" />
              </div>
            </div>
          </div>

          {/* Contract Details Section */}
          <div className="glass-navbar rounded-2xl p-8 space-y-6 border border-white/20">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📜</span>
              <div>
                <h2 className="text-2xl font-bold text-white">SIN Token Contract</h2>
                <p className="text-white/60">Add SIN token to your wallet</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Contract Address */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex-1 min-w-0">
                  <p className="text-white/60 text-sm font-medium">Contract Address</p>
                  <p className="text-[#51bb0b] font-mono text-sm break-all">{networkDetails.contractAddress}</p>
                </div>
                <CopyButton text={networkDetails.contractAddress} field="contract" />
              </div>

              {/* Token Symbol */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <p className="text-white/60 text-sm font-medium">Token Symbol</p>
                  <p className="text-white font-mono">SIN</p>
                </div>
                <CopyButton text="SIN" field="tokenSymbol" />
              </div>

              {/* Decimals */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <p className="text-white/60 text-sm font-medium">Decimals</p>
                  <p className="text-white font-mono">18</p>
                </div>
                <CopyButton text="18" field="decimals" />
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-blue-200 text-sm">
                <span className="font-bold">ℹ️ To add SIN token manually:</span> Open your wallet → Import Token → 
                Paste the contract address above → The symbol and decimals should auto-fill.
              </p>
            </div>
          </div>

          {/* Help Section */}
          <div className="glass-navbar rounded-2xl p-8 space-y-4 border border-white/20">
            <div className="flex items-center gap-3">
              <span className="text-4xl">❓</span>
              <h2 className="text-2xl font-bold text-white">Need Help?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-white font-semibold mb-2">🔄 Network not switching?</h3>
                <p className="text-white/60 text-sm">
                  Try disconnecting your wallet, refreshing the page, and reconnecting. 
                  Make sure you approve the network switch request in your wallet.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-white font-semibold mb-2">💰 No BDAG balance?</h3>
                <p className="text-white/60 text-sm">
                  Visit the faucet link above to get free testnet BDAG. 
                  You need BDAG to pay for gas fees when staking or claiming SIN tokens.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-white font-semibold mb-2">🪙 Can't see SIN tokens?</h3>
                <p className="text-white/60 text-sm">
                  Import the SIN token using the contract address above. 
                  Your wallet needs to know about the token to display your balance.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-white font-semibold mb-2">⏳ Transaction pending?</h3>
                <p className="text-white/60 text-sm">
                  Transactions on BDAG Testnet usually complete in 10-30 seconds. 
                  Check the block explorer if your transaction is taking longer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
