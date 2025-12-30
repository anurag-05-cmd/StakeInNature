"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

interface StatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error";
  autoCloseDelay?: number;
}

export default function StatusDialog({
  isOpen,
  onClose,
  title,
  message,
  type,
  autoCloseDelay = 5,
}: StatusDialogProps) {
  const [countdown, setCountdown] = useState(autoCloseDelay);

  useEffect(() => {
    if (isOpen) {
      setCountdown(autoCloseDelay);
      
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, onClose, autoCloseDelay]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative glass-navbar rounded-2xl p-8 max-w-md w-full border-2 border-white/20 shadow-2xl animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close dialog"
        >
          <X className="text-white/70 hover:text-white" size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className={`p-4 rounded-full ${
              type === "success"
                ? "bg-[#51bb0b]/20 border-2 border-[#51bb0b]"
                : "bg-red-500/20 border-2 border-red-500"
            }`}
          >
            {type === "success" ? (
              <CheckCircle2 className="text-[#51bb0b]" size={48} />
            ) : (
              <XCircle className="text-red-500" size={48} />
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-2xl font-bold text-center mb-4 ${
            type === "success" ? "text-[#51bb0b]" : "text-red-400"
          }`}
        >
          {title}
        </h3>

        {/* Message */}
        <p className="text-white/80 text-center mb-6 leading-relaxed">
          {message}
        </p>

        {/* Action button with countdown */}
        <button
          onClick={onClose}
          className={`w-full py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 ${
            type === "success"
              ? "bg-[#51bb0b] hover:bg-[#45a009] text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          Ok {countdown > 0 && `(${countdown}s)`}
        </button>
      </div>
    </div>
  );
}
