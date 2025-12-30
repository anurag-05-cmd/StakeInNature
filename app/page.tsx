import Navbar from "./components/Navbar";
import Image from "next/image";

export default function Home() {
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
              
              {/* CTA Buttons with refined styling */}
              <div className="flex gap-4 mt-6">
                <button className="group relative px-8 py-4 bg-[#51bb0b] text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(81,187,11,0.5)] hover:scale-[1.02]">
                  <span className="relative z-10 uppercase tracking-wider text-sm">Validate</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#45a009] to-[#51bb0b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                <button className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 overflow-hidden transition-all duration-300 hover:bg-white hover:text-[#51bb0b] hover:border-white hover:scale-[1.02]">
                  <span className="relative z-10 uppercase tracking-wider text-sm">Claim SIN</span>
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