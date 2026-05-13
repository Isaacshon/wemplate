export type Currency = "usd" | "cad";

export type PreviewStyle =
  | "clinic"
  | "saas"
  | "service"
  | "commerce"
  | "healthcare"
  | "hospitality";

export type TemplateTier = "css" | "react" | "premium";
export type TemplateStatus = "seed" | "draft" | "published";

export type TemplateItem = {
  id: string;
  name: string;
  industry: string;
  concept: string;
  previewStyle: PreviewStyle;
  headline: string;
  cta: string;
  supportingCopy: string;
  proof: string;
  sections: [string, string, string];
  visualMood: string;
  priceUsd: number;
  priceCad: number;
  tier: TemplateTier;
  stack: string;
  isBestSeller: boolean;
  deliveryNote: string;
  zipPath?: string;
  previewImagePath?: string;
  status?: TemplateStatus;
  motionProfile?: string;
  generatedAt?: string;
  referenceIds?: string[];
  accent: string;
  palette: {
    primary: string;
    background: string;
    text: string;
    surface: string;
  };
  stats: string;
};

export const templates: TemplateItem[] = [
  {
    id: "botanical-clinic",
    name: "Botanical Clinic",
    industry: "Wellness",
    concept: "A calm skincare clinic site built around trust, treatments, and quiet luxury.",
    previewStyle: "clinic",
    headline: "Clinical skincare with a softer edge",
    cta: "Book a consult",
    supportingCopy: "A refined appointment-led site for facial studios, cosmetic clinics, and founders who want care to feel calm before the first visit.",
    proof: "Used for treatment menus, booking pages, and practitioner profiles.",
    sections: ["Treatments", "Results", "Booking"],
    visualMood: "botanical, soft clinical, editorial",
    priceUsd: 59,
    priceCad: 59,
    tier: "premium",
    stack: "Next.js + Tailwind + Framer Motion",
    isBestSeller: true,
    deliveryNote: "ZIP and setup notes emailed after checkout.",
    status: "seed",
    motionProfile: "scroll reveal, treatment-card parallax, soft CTA lift",
    accent: "#B7D7A8",
    palette: {
      primary: "#B7D7A8",
      background: "#F2EFE7",
      text: "#182019",
      surface: "#FFFFFF",
    },
    stats: "4.9 conversion score",
  },
  {
    id: "founder-room",
    name: "Founder Room",
    industry: "B2B SaaS",
    concept: "A founder-grade SaaS landing page with metrics, dashboard proof, and direct CTAs.",
    previewStyle: "saas",
    headline: "Run the room before the demo starts",
    cta: "See product tour",
    supportingCopy: "Built for AI operations, internal tools, analytics products, and early teams selling a technical promise with polish.",
    proof: "Includes dashboard hero, metric strip, feature proof, and investor-ready copy blocks.",
    sections: ["Signal", "Workflow", "Demo"],
    visualMood: "precise, technical, investor-ready",
    priceUsd: 49,
    priceCad: 49,
    tier: "react",
    stack: "Vite React + TypeScript + Tailwind",
    isBestSeller: true,
    deliveryNote: "ZIP and Framer Motion notes emailed after checkout.",
    status: "seed",
    motionProfile: "metric reveal, dashboard hover states, CTA lift",
    accent: "#8FA8FF",
    palette: {
      primary: "#8FA8FF",
      background: "#F4F6FF",
      text: "#121621",
      surface: "#FFFFFF",
    },
    stats: "16 sections included",
  },
  {
    id: "afterhours-barber",
    name: "Afterhours Barber",
    industry: "Local service",
    concept: "A cinematic booking site for premium grooming studios and appointment businesses.",
    previewStyle: "service",
    headline: "Cuts after dark, booked before noon",
    cta: "Reserve a chair",
    supportingCopy: "A compact service site for barbers, tattooers, salons, and studios that sell atmosphere as much as availability.",
    proof: "Optimized for menus, hours, location, and high-intent booking.",
    sections: ["Services", "Artists", "Reserve"],
    visualMood: "moody, tactile, appointment-first",
    priceUsd: 29,
    priceCad: 29,
    tier: "css",
    stack: "HTML + CSS",
    isBestSeller: true,
    deliveryNote: "ZIP and brand swap guide emailed after checkout.",
    status: "seed",
    motionProfile: "CSS-only hover, sticky booking cue, fade reveal",
    accent: "#C47A5A",
    palette: {
      primary: "#C47A5A",
      background: "#201B18",
      text: "#F6EFE7",
      surface: "#2B2420",
    },
    stats: "Mobile-first booking CTA",
  },
  {
    id: "ceramic-market",
    name: "Ceramic Market",
    industry: "Commerce",
    concept: "A product-drop storefront for handmade goods, small catalogs, and limited releases.",
    previewStyle: "commerce",
    headline: "Small batch objects with a gallery pace",
    cta: "View the drop",
    supportingCopy: "Made for ceramicists, object makers, fragrance labels, and shops that need products to feel collected, not dumped into a grid.",
    proof: "Includes drop cards, material notes, social proof, and a conversion-focused product path.",
    sections: ["Drop", "Materials", "Cart"],
    visualMood: "crafted, gallery retail, tactile",
    priceUsd: 59,
    priceCad: 59,
    tier: "premium",
    stack: "Next.js + Tailwind + Framer Motion",
    isBestSeller: true,
    deliveryNote: "ZIP and product grid guide emailed after checkout.",
    status: "seed",
    motionProfile: "product grid parallax, hover zoom, sticky drop CTA",
    accent: "#D6B98C",
    palette: {
      primary: "#D6B98C",
      background: "#F3EDE2",
      text: "#1D1913",
      surface: "#FFF9EF",
    },
    stats: "Drop-ready catalog",
  },
  {
    id: "neon-dental",
    name: "Neon Dental",
    industry: "Healthcare",
    concept: "A confident clinic site that makes dental care feel modern without losing trust.",
    previewStyle: "healthcare",
    headline: "A brighter clinic visit, from the first click",
    cta: "Start intake",
    supportingCopy: "Designed for dental groups, orthodontists, urgent clinics, and health practices that need clarity with a little visual edge.",
    proof: "Includes insurance cues, care pathways, location panel, and patient-ready copy.",
    sections: ["Care", "Insurance", "Visit"],
    visualMood: "clean, bright, trust-forward",
    priceUsd: 49,
    priceCad: 49,
    tier: "react",
    stack: "Vite React + TypeScript + Tailwind",
    isBestSeller: true,
    deliveryNote: "ZIP and copy prompts emailed after checkout.",
    status: "seed",
    motionProfile: "care-path tabs, intake CTA reveal, trust-card hover",
    accent: "#7ED8D0",
    palette: {
      primary: "#7ED8D0",
      background: "#EEF7F5",
      text: "#10211F",
      surface: "#FFFFFF",
    },
    stats: "Patient-first copy blocks",
  },
  {
    id: "micro-hotel",
    name: "Micro Hotel",
    industry: "Hospitality",
    concept: "A boutique stay site with strong gallery rhythm, room details, and direct booking.",
    previewStyle: "hospitality",
    headline: "A small hotel with a long memory",
    cta: "Check dates",
    supportingCopy: "For boutique stays, cabins, guest houses, and micro-hotels that sell mood, location, and a clear path to booking.",
    proof: "Includes room gallery, amenities, neighborhood notes, and booking CTA.",
    sections: ["Rooms", "Neighborhood", "Dates"],
    visualMood: "cinematic, intimate, editorial travel",
    priceUsd: 29,
    priceCad: 29,
    tier: "css",
    stack: "HTML + CSS",
    isBestSeller: true,
    deliveryNote: "ZIP and image replacement notes emailed after checkout.",
    status: "seed",
    motionProfile: "CSS-only gallery crop, booking strip reveal, hover lift",
    accent: "#C98D6B",
    palette: {
      primary: "#C98D6B",
      background: "#171513",
      text: "#F4EDE2",
      surface: "#25211C",
    },
    stats: "Gallery motion system",
  },
];

export function getTemplateById(id: string) {
  return templates.find((item) => item.id === id) ?? null;
}

export function getCheckoutItem(id: string) {
  const template = getTemplateById(id);

  if (template) {
    return {
      id: template.id,
      name: template.name,
      description: template.concept,
      priceUsd: template.priceUsd,
      priceCad: template.priceCad,
      tier: template.tier,
      stack: template.stack,
      zipPath: template.zipPath,
    };
  }

  return null;
}
