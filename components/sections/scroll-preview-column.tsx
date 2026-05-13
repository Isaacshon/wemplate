"use client";

import Link from "next/link";
import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { TemplatePreview } from "@/components/templates/template-preview";
import type { PriceFilter } from "@/components/price-filter-context";
import type { TemplateItem } from "@/data/templates";
import { cn, formatPrice } from "@/lib/utils";

type ScrollPreviewColumnProps = {
  templates: TemplateItem[];
  columnIndex: number;
  selectedPrice: PriceFilter;
  scrollY: MotionValue<number>;
};

const columnLeft = ["4.5vw", "28.35vw", "52.2vw", "76.1vw"] as const;
const columnBaseTop = [960, -6030, 1020, -5920] as const;
const aspectPattern = [
  ["aspect-[1/1.23]", "aspect-square", "aspect-[1/1.18]", "aspect-[1/1.34]"],
  ["aspect-[1/0.78]", "aspect-[1/1.24]", "aspect-square", "aspect-[1/1.18]"],
  ["aspect-[1/1.24]", "aspect-square", "aspect-[1/1.08]", "aspect-[1/1.28]"],
  ["aspect-[1/0.8]", "aspect-[1/1.26]", "aspect-square", "aspect-[1/1.2]"],
] as const;

export function ScrollPreviewColumn({
  templates,
  columnIndex,
  selectedPrice,
  scrollY,
}: ScrollPreviewColumnProps) {
  const isDesktopMotion = useDesktopMotion();
  const isReverse = columnIndex % 2 === 1;
  const y = useTransform(scrollY, (value) => {
    if (!isDesktopMotion) {
      return 0;
    }

    return isReverse ? value * 0.96 : value * -0.88;
  });

  return (
    <motion.div
      style={{
        y,
        top: columnBaseTop[columnIndex],
        left: columnLeft[columnIndex],
      }}
      className={cn(
        "mb-7 flex flex-col gap-7 will-change-transform md:absolute md:mb-0 md:w-[clamp(17.5rem,19.35vw,23.25rem)] md:gap-[5.25rem]",
      )}
    >
      {templates.map((template, index) => (
        <GalleryCard
          key={`${template.id}-${columnIndex}-${index}`}
          template={template}
          columnIndex={columnIndex}
          itemIndex={index}
          selectedPrice={selectedPrice}
        />
      ))}
    </motion.div>
  );
}

function GalleryCard({
  template,
  columnIndex,
  itemIndex,
  selectedPrice,
}: {
  template: TemplateItem;
  columnIndex: number;
  itemIndex: number;
  selectedPrice: PriceFilter;
}) {
  const shouldReduceMotion = useReducedMotion();
  const isDimmed = selectedPrice !== null && template.priceUsd !== selectedPrice;
  const aspectClass = aspectPattern[columnIndex][itemIndex % aspectPattern[columnIndex].length];

  return (
    <motion.article
      animate={{
        opacity: 1,
        scale: isDimmed ? 0.94 : 1,
        filter: isDimmed
          ? "brightness(0.28) blur(1.4px) saturate(0.52)"
          : "brightness(1) blur(0px) saturate(1)",
      }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="group relative z-20"
    >
      <motion.div
        whileHover={shouldReduceMotion ? undefined : { scale: 1.1, zIndex: 40 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href={`/templates/${template.id}`}
          className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          aria-label={`Open ${template.name} preview editor`}
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-lg border border-white/22 bg-black shadow-[0_18px_58px_rgba(0,0,0,0.36)] transition-colors duration-300 group-hover:border-white/55",
              aspectClass,
            )}
          >
            <motion.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="h-full origin-top"
            >
              <TemplatePreview template={template} size="market" />
            </motion.div>

            <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex items-end justify-between gap-3 mix-blend-difference">
              <p className="max-w-[12rem] font-sans text-[clamp(1.05rem,1.28vw,1.45rem)] font-bold leading-[0.96] tracking-[-0.024em] text-white">
                {template.name}
              </p>
              <span className="shrink-0 font-sans text-[clamp(1.05rem,1.18vw,1.35rem)] font-bold leading-none tracking-[-0.024em] text-white">
                {formatPrice(template.priceUsd, "usd")}
              </span>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-2 bg-gradient-to-t from-black/68 via-black/18 to-transparent px-3 pb-3 pt-16 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="pr-16 text-[0.64rem] font-semibold uppercase tracking-[0.08em] text-white/78">
                {template.industry}
              </p>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.article>
  );
}

function useDesktopMotion() {
  const [isDesktopMotion, setIsDesktopMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktopMotion(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return isDesktopMotion;
}
