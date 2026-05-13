"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type PriceFilter = 59 | 49 | 29 | null;

type PriceFilterContextValue = {
  selectedPrice: PriceFilter;
  togglePrice: (price: Exclude<PriceFilter, null>) => void;
  clearPrice: () => void;
};

const PriceFilterContext = createContext<PriceFilterContextValue | null>(null);

export function PriceFilterProvider({ children }: { children: ReactNode }) {
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>(null);

  const value = useMemo(
    () => ({
      selectedPrice,
      togglePrice: (price: Exclude<PriceFilter, null>) => {
        setSelectedPrice((current) => (current === price ? null : price));
      },
      clearPrice: () => setSelectedPrice(null),
    }),
    [selectedPrice],
  );

  return <PriceFilterContext.Provider value={value}>{children}</PriceFilterContext.Provider>;
}

export function usePriceFilter() {
  const context = useContext(PriceFilterContext);

  if (!context) {
    throw new Error("usePriceFilter must be used inside PriceFilterProvider");
  }

  return context;
}
