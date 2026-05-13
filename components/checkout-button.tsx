"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Currency } from "@/data/templates";

type CheckoutButtonProps = {
  itemId: string;
  currency?: Currency;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "dark";
  className?: string;
};

export function CheckoutButton({
  itemId,
  currency = "usd",
  children,
  variant = "primary",
  className,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const shouldReduceMotion = useReducedMotion();

  async function handleCheckout() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, currency }),
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Checkout is not configured yet.");
      }

      window.location.href = payload.url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout failed.");
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <motion.button
        type="button"
        disabled={isLoading}
        onClick={handleCheckout}
        whileHover={shouldReduceMotion ? undefined : { y: -2 }}
        whileTap={shouldReduceMotion ? undefined : { y: 1 }}
        className={cn(
          "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          variant === "primary" &&
            "border-cobalt bg-cobalt text-paper shadow-[0_12px_34px_rgba(216,195,159,0.22)] hover:bg-ink hover:text-paper",
          variant === "ghost" &&
            "border-line bg-white/[0.06] text-ink hover:border-cobalt hover:bg-white/[0.1]",
          variant === "dark" &&
            "border-line bg-ink text-paper hover:border-cobalt hover:bg-cobalt",
          className,
        )}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        <span>{children}</span>
        {!isLoading ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
      </motion.button>
      {error ? <p className="max-w-xs text-xs font-medium text-coral">{error}</p> : null}
    </div>
  );
}
