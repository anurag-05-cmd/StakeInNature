"use client";

import Navbar from "../components/Navbar";
import { 
  Award, 
  Wallet, 
  Gift, 
  Lock, 
  TrendingUp, 
  Users, 
  DollarSign,
  Building2,
  Heart,
  Zap,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function RewardsPage() {
  return (
    <div className="relative min-h-screen">
      {/* Dark overlay gradient for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent z-0" />

      <Navbar />

      <main className="relative z-10 flex items-center justify-center min-h-screen pt-24 pb-20 px-4">
        <div className="w-full md:w-[90%] max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-[#51bb0b]/20 rounded-full mb-4">
              <Award className="text-[#51bb0b]" size={48} />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              <span className="text-white">EARN </span>
              <span className="text-[#51bb0b]">REWARDS</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
              Stake your commitment, validate honest work, and earn transparent rewards while supporting a greener economy.
            </p>
          </div>

          {/* Funding Model Section */}
          <div className="glass-navbar rounded-2xl p-6 md:p-8 space-y-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Building2 className="text-blue-400" size={28} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">How We're Funded</h2>
                <p className="text-white/60 text-sm">Sustainable ecosystem for social impact</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg mt-1">
                    <Users size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Institutional Support</h3>
                    <p className="text-white/70 text-sm">
                      NGOs, DAOs, and organizations provide liquidity to directly fund social service workers, creating real-world impact.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg mt-1">
                    <DollarSign size={24} className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Revenue Streams</h3>
                    <p className="text-white/70 text-sm">
                      Ad revenue and a portion of donations contribute to platform development, ensuring longevity and benefits for all participants.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Getting Started Instructions */}
          <div className="glass-navbar rounded-2xl p-6 md:p-8 space-y-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#51bb0b]/20 rounded-lg">
                <Zap className="text-[#51bb0b]" size={28} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Getting Started</h2>
                <p className="text-white/60 text-sm">Follow these steps to begin earning rewards</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4 items-start bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#51bb0b]/30 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-[#51bb0b] rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet size={20} className="text-[#51bb0b]" />
                    <h3 className="text-white font-semibold">Connect Your Wallet</h3>
                  </div>
                  <p className="text-white/70 text-sm">
                    You need a Web3-compatible wallet (MetaMask, Trust Wallet, etc.) to connect to our platform and interact with the blockchain.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#51bb0b]/30 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-[#51bb0b] rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift size={20} className="text-[#51bb0b]" />
                    <h3 className="text-white font-semibold">Claim Initial Tokens</h3>
                  </div>
                  <p className="text-white/70 text-sm">
                    First-time users can claim up to <span className="text-[#51bb0b] font-semibold">5,000 SIN tokens</span> to get started with staking and validation.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#51bb0b]/30 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-[#51bb0b] rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock size={20} className="text-[#51bb0b]" />
                    <h3 className="text-white font-semibold">Stake Your SIN</h3>
                  </div>
                  <p className="text-white/70 text-sm">
                    Stake your tokens to validate honest work and support the system. <span className="text-[#51bb0b] font-semibold">Minimum: 900 SIN</span>
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 items-start bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#51bb0b]/30 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-[#51bb0b] rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={20} className="text-[#51bb0b]" />
                    <h3 className="text-white font-semibold">Earn Rewards</h3>
                  </div>
                  <p className="text-white/70 text-sm">
                    Validated users earn an <span className="text-[#51bb0b] font-semibold">8% return</span> on their staked assets while supporting honest recycling workers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rewards Info */}
          <div className="glass-navbar rounded-2xl p-6 md:p-8 space-y-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <TrendingUp className="text-yellow-400" size={28} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Rewards Structure</h2>
                <p className="text-white/60 text-sm">Transparent and fair returns</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#51bb0b]/20 to-[#51bb0b]/5 rounded-xl p-6 border border-[#51bb0b]/30">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="text-[#51bb0b]" size={24} />
                  <h3 className="text-white font-bold text-lg">Staking Returns</h3>
                </div>
                <p className="text-white/80 text-3xl font-black mb-2">8% APY</p>
                <p className="text-white/60 text-sm">
                  Earn consistent returns on your locked assets while supporting the ecosystem.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="text-blue-400" size={24} />
                  <h3 className="text-white font-bold text-lg">Top-Up Support</h3>
                </div>
                <p className="text-white/80 text-3xl font-black mb-2">5,000 SIN</p>
                <p className="text-white/60 text-sm">
                  Balance below 900? Get another 5,000 SIN to continue testing and validating.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="glass-navbar rounded-2xl p-6 md:p-8 space-y-4 border border-orange-500/30 bg-orange-500/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-orange-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h2 className="text-xl font-bold text-white mb-3">Important Update: RPC URL Changed</h2>
                <div className="space-y-3 text-white/80 text-sm">
                  <p>
                    We are using <span className="font-semibold text-white">BlockDAG</span> for our testnet. 
                    They have recently updated their RPC URL from the previous <code className="px-2 py-1 bg-white/10 rounded text-orange-300">primordial.bdagscan.com</code>.
                  </p>
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <p className="font-semibold text-orange-200 mb-2 flex items-center gap-2">
                      <ArrowRight size={16} />
                      Action Required:
                    </p>
                    <ul className="space-y-2 text-white/70 text-sm ml-6 list-disc">
                      <li>Check the <span className="text-[#51bb0b] font-semibold">Faucet Tab</span> for the updated RPC URL</li>
                      <li>Update your wallet's network settings with the new RPC URL</li>
                      <li><span className="font-semibold text-orange-200">MetaMask Users:</span> If the RPC doesn't update properly, try using another wallet or reinstalling MetaMask to fix the bug</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-4 pt-4">
            <p className="text-white/60 text-sm">Ready to start earning?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/"
                className="group relative px-8 py-4 bg-[#51bb0b] text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(81,187,11,0.5)] hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Wallet size={20} />
                <span className="uppercase tracking-wider text-sm">Connect Wallet</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#45a009] to-[#51bb0b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a
                href="/faucet"
                className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 overflow-hidden transition-all duration-300 hover:bg-white hover:text-[#51bb0b] hover:border-white hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Gift size={20} />
                <span className="uppercase tracking-wider text-sm">Get Tokens</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
