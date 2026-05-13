"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { fadeUp } from "@/lib/motion";

export function Footer() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.footer
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="container-px mx-auto max-w-[92rem] pb-8 pt-12"
    >
      <div className="rounded-lg border border-line bg-white/[0.045] p-5 text-ink">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-cobalt text-paper">
                <Sparkles className="h-4 w-4" aria-hidden />
              </span>
              <span className="font-display text-2xl font-semibold">Wemplate</span>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted">
              Premium daily website templates for resellers, studios, and fast-moving operators.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {["Best sellers", "FAQ"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(" ", "-")}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-4 py-2 text-sm font-semibold text-muted transition-colors hover:border-cobalt hover:text-ink"
              >
                {label}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-10 border-t border-line pt-5 text-xs font-semibold uppercase text-muted">
          (c) 2026 Wemplate. Built for daily drops.
        </div>
      </div>
    </motion.footer>
  );
}
