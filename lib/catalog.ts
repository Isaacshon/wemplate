import "server-only";

import {
  getCheckoutItem,
  getTemplateById,
  templates as seedTemplates,
  type PreviewStyle,
  type TemplateItem,
  type TemplateStatus,
  type TemplateTier,
} from "@/data/templates";
import { getSupabaseAdmin } from "@/lib/supabase";

type TemplateRow = {
  slug?: string | null;
  title?: string | null;
  industry?: string | null;
  concept?: string | null;
  preview_style?: string | null;
  headline?: string | null;
  cta?: string | null;
  supporting_copy?: string | null;
  proof?: string | null;
  sections?: unknown;
  visual_mood?: string | null;
  price_usd?: number | null;
  price_cad?: number | null;
  tier?: string | null;
  stack?: string | null;
  is_best_seller?: boolean | null;
  delivery_note?: string | null;
  zip_path?: string | null;
  preview_image_path?: string | null;
  status?: string | null;
  motion_profile?: string | null;
  generated_at?: string | null;
  reference_ids?: unknown;
  accent?: string | null;
  palette?: unknown;
  stats?: string | null;
};

export type CheckoutCatalogItem = NonNullable<ReturnType<typeof getCheckoutItem>> & {
  tier: TemplateTier;
  stack: string;
  zipPath?: string;
};

const previewStyles: PreviewStyle[] = [
  "clinic",
  "saas",
  "service",
  "commerce",
  "healthcare",
  "hospitality",
];
const tiers: TemplateTier[] = ["css", "react", "premium"];
const statuses: TemplateStatus[] = ["seed", "draft", "published"];

export async function getPublishedTemplates() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return seedTemplates;
  }

  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("status", "published")
    .order("generated_at", { ascending: false })
    .limit(120);

  if (error || !data || data.length === 0) {
    return seedTemplates;
  }

  return (data as TemplateRow[]).map(rowToTemplate);
}

export async function getTemplateForSlug(slug: string) {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data } = await supabase
      .from("templates")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (data) {
      return rowToTemplate(data as TemplateRow);
    }
  }

  return getTemplateById(slug);
}

export async function getCheckoutItemById(slug: string): Promise<CheckoutCatalogItem | null> {
  const template = await getTemplateForSlug(slug);

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

  const item = getCheckoutItem(slug);
  return item ? { ...item, tier: item.tier, stack: item.stack, zipPath: item.zipPath } : null;
}

export function getSeedTemplateParams() {
  return seedTemplates.map((template) => ({ id: template.id }));
}

function rowToTemplate(row: TemplateRow): TemplateItem {
  const priceUsd = Number(row.price_usd ?? 29);
  const tier = normalizeTier(row.tier, priceUsd);
  const palette = normalizePalette(row.palette, row.accent);
  const previewStyle = normalizePreviewStyle(row.preview_style, tier);
  const sections = normalizeSections(row.sections);
  const status = normalizeStatus(row.status);

  return {
    id: stringOr(row.slug, "template"),
    name: stringOr(row.title, "Untitled Template"),
    industry: stringOr(row.industry, "Emerging niche"),
    concept: stringOr(row.concept, "A polished website template for a fast-moving niche."),
    previewStyle,
    headline: stringOr(row.headline, "Launch before the category looks crowded"),
    cta: stringOr(row.cta, "Open the site"),
    supportingCopy: stringOr(
      row.supporting_copy,
      "A responsive website package built for quick brand swaps and premium first impressions.",
    ),
    proof: stringOr(row.proof, "Includes source files, setup notes, and brand swap guidance."),
    sections,
    visualMood: stringOr(row.visual_mood, "premium, responsive, conversion-focused"),
    priceUsd,
    priceCad: Number(row.price_cad ?? priceUsd),
    tier,
    stack: stringOr(row.stack, stackForTier(tier)),
    isBestSeller: row.is_best_seller ?? true,
    deliveryNote: stringOr(row.delivery_note, "ZIP and setup notes emailed after checkout."),
    zipPath: stringOrUndefined(row.zip_path),
    previewImagePath: stringOrUndefined(row.preview_image_path),
    status,
    motionProfile: stringOrUndefined(row.motion_profile),
    generatedAt: stringOrUndefined(row.generated_at),
    referenceIds: normalizeReferenceIds(row.reference_ids),
    accent: stringOr(row.accent, palette.primary),
    palette,
    stats: stringOr(row.stats, `${stackForTier(tier)} package`),
  };
}

function normalizePreviewStyle(value: string | null | undefined, tier: TemplateTier): PreviewStyle {
  if (value && previewStyles.includes(value as PreviewStyle)) {
    return value as PreviewStyle;
  }

  return tier === "premium" ? "commerce" : tier === "react" ? "saas" : "service";
}

function normalizeTier(value: string | null | undefined, priceUsd: number): TemplateTier {
  if (value && tiers.includes(value as TemplateTier)) {
    return value as TemplateTier;
  }

  if (priceUsd >= 59) {
    return "premium";
  }

  return priceUsd >= 49 ? "react" : "css";
}

function normalizeStatus(value: string | null | undefined): TemplateStatus {
  if (value && statuses.includes(value as TemplateStatus)) {
    return value as TemplateStatus;
  }

  return "published";
}

function normalizeSections(value: unknown): [string, string, string] {
  if (Array.isArray(value) && value.length >= 3) {
    return [String(value[0]), String(value[1]), String(value[2])];
  }

  return ["Hero", "Proof", "Convert"];
}

function normalizePalette(value: unknown, accent: string | null | undefined) {
  if (value && typeof value === "object") {
    const palette = value as Record<string, unknown>;
    return {
      primary: stringOr(palette.primary, accent ?? "#D8C39F"),
      background: stringOr(palette.background, "#0D0D0C"),
      text: stringOr(palette.text, "#F4EFE4"),
      surface: stringOr(palette.surface, "#1D1C1A"),
    };
  }

  return {
    primary: accent ?? "#D8C39F",
    background: "#0D0D0C",
    text: "#F4EFE4",
    surface: "#1D1C1A",
  };
}

function normalizeReferenceIds(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.map((item) => String(item));
}

function stackForTier(tier: TemplateTier) {
  if (tier === "premium") {
    return "Next.js + Tailwind + Framer Motion";
  }

  if (tier === "react") {
    return "Vite React + TypeScript + Tailwind";
  }

  return "HTML + CSS";
}

function stringOr(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function stringOrUndefined(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}
