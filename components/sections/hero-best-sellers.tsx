"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { usePriceFilter } from "@/components/price-filter-context";
import { PriceTemplateIndex } from "@/components/sections/price-template-index";
import { ScrollPreviewColumn } from "@/components/sections/scroll-preview-column";
import type { TemplateItem } from "@/data/templates";

const COLUMN_COUNT = 4;
const COLUMN_LENGTH = 12;
const DESKTOP_WALL_HEIGHT = 5200;

export function HeroBestSellers({ templates }: { templates: TemplateItem[] }) {
  const { selectedPrice } = usePriceFilter();
  const scrollY = useMotionValue(0);
  const virtualScrollY = useRef(0);
  const columns = useMemo(() => createColumns(templates), [templates]);
  const filteredTemplates = useMemo(
    () =>
      selectedPrice === null
        ? []
        : templates.filter((template) => template.priceUsd === selectedPrice),
    [selectedPrice, templates],
  );

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      virtualScrollY.current = window.scrollY;
      scrollY.set(virtualScrollY.current);
    };
    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };
    const onWheel = (event: WheelEvent) => {
      virtualScrollY.current = clamp(
        virtualScrollY.current + event.deltaY,
        0,
        DESKTOP_WALL_HEIGHT,
      );
      scrollY.set(virtualScrollY.current);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [scrollY]);

  if (selectedPrice !== null) {
    return (
      <PriceTemplateIndex
        key={selectedPrice}
        price={selectedPrice}
        templates={filteredTemplates}
      />
    );
  }

  return (
    <motion.section
      id="top"
      initial={false}
      className="relative overflow-x-clip"
      style={{ minHeight: DESKTOP_WALL_HEIGHT }}
    >
      <div className="pointer-events-none fixed inset-0 z-10 hidden items-center justify-center overflow-hidden px-4 text-center md:flex">
        <h1
          className="font-sans text-[clamp(8rem,13.25vw,16rem)] font-bold leading-[0.82] text-white"
          style={{ opacity: 0.9 }}
        >
          Wemplate
        </h1>
      </div>

      <div
        id="best-sellers"
        className="relative z-20 mx-auto w-full px-4 pb-24 pt-28 sm:px-6 md:sticky md:top-0 md:h-dvh md:w-screen md:max-w-none md:overflow-visible md:px-0 md:pb-0 md:pt-0"
      >
        <div
          id="template-wall"
          className="relative min-h-[5200px] md:h-[5200px] md:min-h-0"
        >
          {columns.map((items, columnIndex) => (
            <ScrollPreviewColumn
              key={columnIndex}
              templates={items}
              columnIndex={columnIndex}
              selectedPrice={selectedPrice}
              scrollY={scrollY}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createColumns(items: TemplateItem[]) {
  return Array.from({ length: COLUMN_COUNT }, (_, columnIndex) => {
    return Array.from({ length: COLUMN_LENGTH }, (_, rowIndex) => {
      const offset = columnIndex * 3 + rowIndex * (columnIndex % 2 === 0 ? 1 : 2);
      return items[offset % items.length];
    });
  });
}
