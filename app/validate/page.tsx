"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import StatusDialog from "../components/StatusDialog";
import Image from "next/image";
import { onboard } from "../lib/onboard";
import { firstValueFrom } from "rxjs";
import {
  Camera,
  CheckCircle,
  X,
  Loader2,
  Search,
  AlertTriangle,
  CheckCircle2,
  Trash2
} from "lucide-react";

interface ValidationResult {
  success: boolean;
  confidence: number;
  isGoodImage: boolean;
  reason: string;
}

export default function ValidatePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [stakedBalance, setStakedBalance] = useState<string>("0");
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [previousStakedBalance, setPreviousStakedBalance] = useState<string>("0");
  const [wasSlashed, setWasSlashed] = useState(false);
  const [hadInitialAccess, setHadInitialAccess] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({ isOpen: false, title: "", message: "", type: "success" });

  // Check wallet connection and staked balance
  useEffect(() => {
    const wallets = onboard.state.select("wallets");
    const subscription = wallets.subscribe((connectedWallets) => {
      if (connectedWallets && connectedWallets.length > 0) {
        const address = connectedWallets[0].accounts?.[0]?.address;
        setConnectedAddress(address || null);
      } else {
        setConnectedAddress(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if user has minimum stake
  useEffect(() => {
    const checkAccess = async () => {
      if (!connectedAddress) {
        setIsCheckingAccess(false);
        return;
      }

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
        setStakedBalance(data.stakedBalance || "0");
        setIsValidated(data.isValidated || false);
        setIsCheckingAccess(false);

        // Only redirect on initial load if user never had access
        // Don't redirect if they were slashed during this session
        if (parseFloat(data.stakedBalance || "0") >= 900) {
          setHadInitialAccess(true);
        } else if (!hadInitialAccess && !wasSlashed) {
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Failed to check user data:", error);
        setIsCheckingAccess(false);
      }
    };

    checkAccess();
  }, [connectedAddress, hadInitialAccess, wasSlashed]);

  // Show loading or redirect if no access
  if (!connectedAddress || isCheckingAccess) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent z-0" />
        <Navbar />
        <main className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-2xl">
            {!connectedAddress ? "Please connect your wallet..." : "Checking access..."}
          </div>
        </main>
      </div>
    );
  }

  if (parseFloat(stakedBalance) < 900 && !hadInitialAccess && !wasSlashed) {
    return null; // Will redirect
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      setSelectedImage(file);
      setError("");
      setResult(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleValidate = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    if (!connectedAddress) {
      setError("Please connect your wallet");
      return;
    }

    setIsLoading(true);
    setError("");

    // Store previous staked balance before validation
    setPreviousStakedBalance(stakedBalance);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("userAddress", connectedAddress);

      const response = await fetch("/api/validate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Validation failed");
      }

      const data: ValidationResult = await response.json();
      setResult(data);
      
      // Mark that user has validated in this session
      setHasValidated(true);
      
      // If validation failed (slashed), mark as slashed
      if (!data.success && data.confidence < 50) {
        setWasSlashed(true);
      }
      
      // Refresh user data after validation
      const userDataResponse = await fetch("/api/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getUserData",
          userAddress: connectedAddress,
        }),
      });
      const userData = await userDataResponse.json();
      setStakedBalance(userData.stakedBalance || "0");
      setIsValidated(userData.isValidated || false);
      
      // Show dialog to stake again after a short delay
      setTimeout(() => {
        setDialogState({
          isOpen: true,
          title: "Validation Complete",
          message: "You can only validate once per stake. Please stake again on the homepage to validate more work.",
          type: data.success && data.confidence >= 50 ? "success" : "error",
        });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!connectedAddress || !isValidated) {
      setError("You must be validated before claiming rewards");
      return;
    }

    setIsClaiming(true);
    setError("");

    try {
      const { ethers } = await import("ethers");
      const wallets = onboard.state.get().wallets;
      
      if (!wallets || wallets.length === 0) {
        throw new Error("No wallet connected");
      }

      const provider = wallets[0].provider;
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      // Import contract helper
      const { unstakeAllTokens } = await import("../lib/contractHelper");

      const tx = await unstakeAllTokens(signer);
      
      if (!tx) {
        throw new Error("Transaction failed");
      }

      await tx.wait();

      // Refresh user data
      const userDataResponse = await fetch("/api/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getUserData",
          userAddress: connectedAddress,
        }),
      });
      const userData = await userDataResponse.json();
      setStakedBalance(userData.stakedBalance || "0");
      setIsValidated(userData.isValidated || false);

      setDialogState({
        isOpen: true,
        title: "Success!",
        message: "Successfully claimed all rewards and unstaked tokens!",
        type: "success",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to claim rewards";
      setDialogState({
        isOpen: true,
        title: "Transaction Failed",
        message: errorMessage,
        type: "error",
      });
      setError(errorMessage);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-[#51bb0b]", "bg-white/5");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-[#51bb0b]", "bg-white/5");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-[#51bb0b]", "bg-white/5");

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
      setResult(null);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Dark overlay gradient for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent z-0" />

      <Navbar />

      {/* Status Dialog */}
      <StatusDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ ...dialogState, isOpen: false })}
        title={dialogState.title}
        message={dialogState.message}
        type={dialogState.type}
      />

      <main className="relative z-10 flex items-center justify-center min-h-screen pt-20 pb-10">
        <div className="w-[90%] max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Upload Section */}
            <div className="flex flex-col gap-8">
              <div className="space-y-2">
                <h1 className="text-[4rem] lg:text-[5rem] font-black leading-[0.9] tracking-tight">
                  <span className="block text-white hero-gradient-text">
                    VALIDATE
                  </span>
                  <span className="block text-[#51bb0b] hero-gradient-text-green">
                    YOUR WORK
                  </span>
                </h1>
              </div>

              <h2 className="text-xl lg:text-2xl font-medium text-white/90 tracking-wide max-w-md">
                Upload images of your social work and get instant validation
              </h2>

              <div className="w-20 h-1 bg-gradient-to-r from-[#51bb0b] to-transparent rounded-full" />

              {/* User Status Display */}
              {connectedAddress && (
                <div className="glass-navbar rounded-xl p-4 space-y-2 border border-white/20">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Staked Balance:</span>
                    <span className="text-[#51bb0b] font-bold">{parseFloat(stakedBalance).toFixed(2)} SIN</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Status:</span>
                    <span className={`font-bold flex items-center gap-1.5 ${isValidated ? "text-green-400" : "text-yellow-400"}`}>
                      {isValidated ? (
                        <>
                          <CheckCircle size={16} />
                          Validated
                        </>
                      ) : (
                        "Pending Validation"
                      )}
                    </span>
                  </div>
                  {isValidated && parseFloat(stakedBalance) > 0 && (
                    <button
                      onClick={handleClaimRewards}
                      disabled={isClaiming}
                      className="w-full mt-2 bg-gradient-to-r from-[#51bb0b] to-[#45a009] hover:from-[#45a009] hover:to-[#51bb0b] text-white font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isClaiming ? "Claiming..." : "Claim Rewards & Unstake All"}
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-3 text-white/80 text-base lg:text-lg leading-relaxed max-w-lg">
                <p>
                  Our AI-powered validator checks if your images show genuine
                  environmental or social work.
                </p>
                <p>
                  Get an instant confidence score and validation result to prove
                  your impact.
                </p>
              </div>

              {/* Upload Box */}
              <div
                className="border-2 border-dashed border-white/30 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-white/50 relative group"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {!preview ? (
                  <>
                    <div className="mb-4 flex justify-center">
                      <div className="p-4 bg-white/10 rounded-full">
                        <Camera className="text-white" size={40} />
                      </div>
                    </div>
                    <p className="text-white font-semibold mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-white/60 text-sm">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mb-4 flex justify-center">
                      <div className="p-4 bg-[#51bb0b]/20 rounded-full">
                        <CheckCircle className="text-[#51bb0b]" size={40} />
                      </div>
                    </div>
                    <p className="text-[#51bb0b] font-semibold">
                      Image selected
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                      {selectedImage?.name}
                    </p>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleValidate}
                  disabled={!selectedImage || isLoading || hasValidated}
                  className="flex-1 bg-[#51bb0b] hover:bg-[#45a009] disabled:bg-white/20 text-black hover:text-black disabled:text-white/50 font-bold py-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#51bb0b]/50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Validating...
                    </span>
                  ) : hasValidated ? (
                    "Already Validated - Stake Again"
                  ) : (
                    "Validate Image"
                  )}
                </button>
                {preview && (
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setPreview("");
                      setResult(null);
                      setError("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="px-6 py-4 border border-white/30 hover:border-white/50 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-white/10"
                  >
                    Clear
                  </button>
                )}
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* Right side - Preview and Results */}
            <div className="flex flex-col gap-6">
              {/* Image Preview */}
              {preview && (
                <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/20">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto object-contain max-h-96"
                  />
                </div>
              )}

              {/* Results Card */}
              {result && (
                <div className="glass-navbar rounded-2xl p-8 space-y-6 border border-white/20">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">
                      Validation Result
                    </h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-[#51bb0b] to-transparent rounded-full" />
                  </div>

                  {/* Success Status */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center ${
                        result.success
                          ? "bg-[#51bb0b]/20 border-2 border-[#51bb0b]"
                          : "bg-red-500/20 border-2 border-red-500"
                      }`}
                    >
                      {result.success ? (
                        <CheckCircle className="text-[#51bb0b]" size={40} />
                      ) : (
                        <X className="text-red-500" size={40} />
                      )}
                    </div>
                    <div>
                      <p className="text-white/60 text-sm font-medium">
                        STATUS
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          result.success
                            ? "text-[#51bb0b]"
                            : "text-red-400"
                        }`}
                      >
                        {result.success ? "VALID" : "INVALID"}
                      </p>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">
                        Confidence Score
                      </span>
                      <span
                        className={`text-2xl font-bold ${
                          result.confidence > 50
                            ? "text-[#51bb0b]"
                            : "text-orange-400"
                        }`}
                      >
                        {result.confidence.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden border border-white/20">
                      <div
                        className={`h-full transition-all duration-500 ${
                          result.confidence > 50
                            ? "bg-gradient-to-r from-[#51bb0b] to-[#6dd81f]"
                            : "bg-gradient-to-r from-orange-400 to-red-500"
                        }`}
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Analysis Reason */}
                  <div className="space-y-2">
                    <p className="text-white/60 text-sm font-medium">
                      ANALYSIS
                    </p>
                    <p className="text-white/90 leading-relaxed">
                      {result.reason}
                    </p>
                  </div>

                  {/* Slashing Warning - Only show if confidence < 50% */}
                  {!result.success && result.confidence < 50 && (
                    <div className="bg-red-900/30 border-2 border-red-500 rounded-xl p-6 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-500/20 rounded-full flex-shrink-0">
                          <AlertTriangle className="text-red-400" size={32} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-red-400 font-bold text-lg mb-2">
                            PROOF INVALID - STAKE SLASHED
                          </h4>
                          <p className="text-red-200 text-sm leading-relaxed">
                            Your proof has been deemed completely invalid. Your staked amount of{" "}
                            <span className="font-bold text-red-300">{parseFloat(previousStakedBalance).toFixed(2)} SIN</span>{" "}
                            has been slashed and is <span className="font-bold">permanently unrecoverable</span>.
                          </p>
                          <p className="text-red-300 text-xs mt-3 font-semibold">
                            ⛔ This action cannot be reversed. Please ensure future submissions show genuine social/environmental work.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Message - Only show if confidence >= 50% */}
                  {result.success && result.confidence >= 50 && (
                    <div className="bg-green-900/30 border-2 border-[#51bb0b] rounded-xl p-6 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#51bb0b]/20 rounded-full flex-shrink-0">
                          <CheckCircle2 className="text-[#51bb0b]" size={32} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[#51bb0b] font-bold text-lg mb-2">
                            VALIDATION SUCCESSFUL - REWARD ADDED
                          </h4>
                          <p className="text-green-200 text-sm leading-relaxed">
                            Your work has been validated! An 8% reward has been added to your staked balance.
                            You can now claim your rewards using the "Claim Rewards" button above.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-white/60 text-xs font-medium mb-1">
                        IMAGE QUALITY
                      </p>
                      <p className="text-white font-semibold">
                        {result.isGoodImage ? "Good" : "Poor"}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs font-medium mb-1">
                        VALIDATION
                      </p>
                      <p className="text-white font-semibold">
                        {result.success ? "Approved" : "Rejected"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!result && !preview && (
                <div className="glass-navbar rounded-2xl p-12 text-center space-y-4 border border-white/20">
                  <div className="flex justify-center">
                    <div className="p-6 bg-white/10 rounded-full">
                      <Search className="text-white/60" size={56} />
                    </div>
                  </div>
                  <p className="text-white/60 text-lg">
                    Upload an image to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
