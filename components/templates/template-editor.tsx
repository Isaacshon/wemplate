"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { TemplateItem } from "@/data/templates";
import { CheckoutButton } from "@/components/checkout-button";
import { TemplatePreview } from "@/components/templates/template-preview";
import { fadeUp, stagger } from "@/lib/motion";
import { formatPrice } from "@/lib/utils";

const presetColors = ["#D8C39F", "#B7D7A8", "#8FA8FF", "#C47A5A", "#7ED8D0", "#D6B98C"];
const backgroundColors = ["#0D0D0C", "#171513", "#201B18", "#F2EFE7", "#EEF7F5", "#F4F6FF"];

export function TemplateEditor({ template }: { template: TemplateItem }) {
  const shouldReduceMotion = useReducedMotion();
  const [primary, setPrimary] = useState(template.palette.primary);
  const [background, setBackground] = useState(template.palette.background);
  const [text, setText] = useState(template.palette.text);
  const [surface, setSurface] = useState(template.palette.surface);
  const [headline, setHeadline] = useState(template.headline);
  const [cta, setCta] = useState(template.cta);

  const hasChanges = useMemo(
    () =>
      primary !== template.palette.primary ||
      background !== template.palette.background ||
      text !== template.palette.text ||
      surface !== template.palette.surface ||
      headline !== template.headline ||
      cta !== template.cta,
    [
      background,
      cta,
      headline,
      primary,
      surface,
      template.cta,
      template.headline,
      template.palette.background,
      template.palette.primary,
      template.palette.surface,
      template.palette.text,
      text,
    ],
  );

  function resetTheme() {
    setPrimary(template.palette.primary);
    setBackground(template.palette.background);
    setText(template.palette.text);
    setSurface(template.palette.surface);
    setHeadline(template.headline);
    setCta(template.cta);
  }

  function setBackgroundPreset(color: string) {
    const isDark = color === "#0D0D0C" || color === "#171513" || color === "#201B18";
    setBackground(color);
    setText(isDark ? "#F4EFE4" : template.palette.text);
    setSurface(isDark ? "#25211C" : "#FFFFFF");
  }

  return (
    <motion.section
      variants={stagger}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      className="container-px mx-auto grid max-w-[92rem] gap-6 pb-16 pt-24 lg:grid-cols-[1fr_25rem] lg:pt-28"
    >
      <motion.div variants={fadeUp} className="space-y-5">
        <div className="grid gap-4 border-b border-line pb-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase text-cobalt">{template.industry} live preview</p>
            <h1 className="mt-2 max-w-4xl font-display text-5xl font-semibold leading-[0.92] text-ink sm:text-7xl">
              {template.name}
            </h1>
          </div>
          <div className="font-display text-5xl font-semibold tabular-nums text-ink">
            {formatPrice(template.priceUsd, "usd")}
          </div>
        </div>
        <TemplatePreview
          template={template}
          primary={primary}
          background={background}
          text={text}
          surface={surface}
          headline={headline}
          cta={cta}
          size="large"
        />
      </motion.div>

      <motion.aside
        variants={fadeUp}
        className="h-fit rounded-lg border border-line bg-white/[0.055] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur lg:sticky lg:top-28"
      >
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className="text-xs font-semibold uppercase text-cobalt">Editor</p>
            <h2 className="font-display text-3xl font-semibold text-ink">Make it yours</h2>
          </div>
          <SlidersHorizontal className="h-6 w-6 text-cobalt" aria-hidden />
        </div>

        <div className="space-y-6">
          <EditorTextField
            id="headline"
            label="Headline"
            value={headline}
            onChange={setHeadline}
            maxLength={72}
          />
          <EditorTextField
            id="cta"
            label="CTA copy"
            value={cta}
            onChange={setCta}
            maxLength={28}
          />

          <ColorSection
            id="primary-color"
            label="Main color"
            value={primary}
            presets={presetColors}
            onPreset={setPrimary}
            onChange={setPrimary}
          />
          <ColorSection
            id="background-color"
            label="Background"
            value={background}
            presets={backgroundColors}
            onPreset={setBackgroundPreset}
            onChange={setBackground}
          />
          <ColorSection
            id="text-color"
            label="Text color"
            value={text}
            presets={["#F4EFE4", "#151413", "#182019", "#10211F"]}
            onPreset={setText}
            onChange={setText}
          />

          <button
            type="button"
            onClick={resetTheme}
            disabled={!hasChanges}
            className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-line bg-transparent px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-cobalt hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Reset preview
          </button>

          <div className="rounded-md border border-line bg-black/[0.18] p-3 text-sm leading-6 text-muted">
            This edits the live preview before purchase. The finished ZIP or access link is still
            delivered by email.
          </div>

          <CheckoutButton itemId={template.id} variant="primary" className="w-full">
            Buy this site
          </CheckoutButton>
        </div>
      </motion.aside>
    </motion.section>
  );
}

function EditorTextField({
  id,
  label,
  value,
  maxLength,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 min-h-11 w-full rounded-md border border-line bg-black/[0.18] px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-cobalt"
      />
    </div>
  );
}

function ColorSection({
  id,
  label,
  value,
  presets,
  onPreset,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  presets: string[];
  onPreset: (value: string) => void;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Set ${label.toLowerCase()} to ${color}`}
            onClick={() => onPreset(color)}
            className="h-10 w-10 cursor-pointer rounded-md border border-white/20 transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <input
        id={id}
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-11 w-full cursor-pointer rounded-md border border-line bg-black/[0.18] p-1"
      />
    </div>
  );
}
