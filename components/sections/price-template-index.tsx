"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TemplatePreview } from "@/components/templates/template-preview";
import type { TemplateItem } from "@/data/templates";
import { formatPrice } from "@/lib/utils";

type PriceTemplateIndexProps = {
  price: 59 | 49 | 29;
  templates: TemplateItem[];
};

export function PriceTemplateIndex({ price, templates }: PriceTemplateIndexProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      key={price}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-screen overflow-x-clip bg-black px-[30px] pb-24 pt-[15vh] text-white max-sm:px-4 max-sm:pt-28"
    >
      <div className="pointer-events-none fixed inset-0 z-0 hidden items-center justify-center md:flex">
        <span className="font-sans text-[clamp(10rem,23vw,28rem)] font-bold leading-none text-white/10">
          {formatPrice(price, "usd")}
        </span>
      </div>

      <div className="relative z-20 mx-auto w-full max-w-[116rem]">
        <div className="mb-10 flex items-end justify-between gap-6 border-b border-white/18 pb-5 max-sm:mb-6">
          <p className="font-sans text-sm font-semibold text-white/72">
            {formatPrice(price, "usd")} templates
          </p>
          <p className="max-w-sm text-right text-sm font-semibold text-white/48 max-sm:hidden">
            Click a template to open the live preview editor.
          </p>
        </div>

        <ul>
          {templates.map((template, index) => (
            <motion.li
              key={template.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 42 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : index * 0.08,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="border-b border-white/18"
            >
              <Link
                href={`/templates/${template.id}`}
                className="group grid min-h-[34rem] grid-cols-[1fr_minmax(22rem,0.58fr)] items-center gap-[5vw] py-10 outline-none focus-visible:ring-2 focus-visible:ring-cobalt max-lg:grid-cols-1 max-sm:min-h-0 max-sm:gap-7 max-sm:py-8"
                aria-label={`Open ${template.name} preview editor`}
              >
                <div className="max-w-[62rem]">
                  <div className="mb-7 flex flex-wrap items-center gap-4 text-sm font-semibold text-white/58">
                    <span>{formatPrice(template.priceUsd, "usd")}</span>
                    <span>{template.industry}</span>
                    <span>{template.sections.join(" / ")}</span>
                  </div>
                  <h2 className="font-sans text-[clamp(4.5rem,9.7vw,12.6rem)] font-bold leading-[0.82] text-white max-sm:text-[4rem]">
                    {template.name}
                  </h2>
                  <p className="mt-8 max-w-xl text-base font-semibold leading-6 text-white/58">
                    {template.concept}
                  </p>
                </div>

                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.045 }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  className="relative justify-self-end max-lg:justify-self-start"
                >
                  <div className="aspect-[1/0.82] w-[min(38vw,35rem)] overflow-hidden rounded-lg border border-white/25 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.38)] max-lg:w-full max-sm:aspect-[4/5]">
                    <TemplatePreview template={template} size="market" />
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/64 transition-colors group-hover:text-white">
                    Open preview
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </motion.div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
