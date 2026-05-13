"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePriceFilter, type PriceFilter } from "@/components/price-filter-context";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

const priceItems = [59, 49, 29] as const;

export function Navbar() {
  const shouldReduceMotion = useReducedMotion();
  const { selectedPrice, togglePrice, clearPrice } = usePriceFilter();

  return (
    <motion.header
      initial={false}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: easeOut }}
      className="fixed left-0 right-0 top-0 z-[80] px-[30px] py-[27px] text-white mix-blend-difference max-sm:px-5 max-sm:py-6"
    >
      <nav
        className="relative flex items-start justify-between font-sans text-[clamp(1rem,1.11vw,1.25rem)] font-semibold leading-[1.15] tracking-[-0.024em]"
        aria-label="Primary navigation"
      >
        <a
          href="/"
          onClick={(event) => {
            if (window.location.pathname === "/") {
              event.preventDefault();
              clearPrice();
              window.requestAnimationFrame(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              });
            }
          }}
          className="flex min-h-6 items-center rounded-md text-white"
        >
          Wemplate
          <span className="ml-1 text-[64%] text-white">(R)</span>
        </a>

        <div className="absolute left-[62.6vw] right-[8.9vw] top-0 flex items-center justify-between gap-6 max-md:left-auto max-md:right-10 max-md:justify-start max-md:gap-4">
          {priceItems.map((price) => (
            <PriceButton
              key={price}
              price={price}
              selectedPrice={selectedPrice}
              onClick={() => {
                togglePrice(price);
                window.requestAnimationFrame(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                });
              }}
            />
          ))}
        </div>

        <a
          href="mailto:drops@wemplate.co"
          className="absolute right-0 top-1 h-3 w-3 rounded-[2px] bg-white"
          aria-label="Contact Wemplate"
        />
      </nav>
    </motion.header>
  );
}

function PriceButton({
  price,
  selectedPrice,
  onClick,
}: {
  price: 59 | 49 | 29;
  selectedPrice: PriceFilter;
  onClick: () => void;
}) {
  const isSelected = selectedPrice === price;

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={cn(
        "min-h-6 rounded-md text-[clamp(1rem,1.11vw,1.25rem)] font-semibold leading-[1.15] tracking-[-0.024em] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt",
        isSelected
          ? "text-white"
          : "text-white hover:text-white",
      )}
    >
      ${price}
    </button>
  );
}
