"use client";

import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Image from "next/image";

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

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
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
                    <div className="text-4xl mb-4">📸</div>
                    <p className="text-white font-semibold mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-white/60 text-sm">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-4">✓</div>
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
                  disabled={!selectedImage || isLoading}
                  className="flex-1 bg-[#51bb0b] hover:bg-[#45a009] disabled:bg-white/20 text-black hover:text-black disabled:text-white/50 font-bold py-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#51bb0b]/50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Validating...
                    </span>
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
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
                        result.success
                          ? "bg-[#51bb0b]/20 border-2 border-[#51bb0b]"
                          : "bg-red-500/20 border-2 border-red-500"
                      }`}
                    >
                      {result.success ? "✓" : "✗"}
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
                  <p className="text-5xl">🔍</p>
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
