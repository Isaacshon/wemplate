import { cn } from "@/lib/utils";
import type { TemplateItem } from "@/data/templates";

type TemplatePreviewProps = {
  template: TemplateItem;
  primary?: string;
  background?: string;
  text?: string;
  surface?: string;
  headline?: string;
  cta?: string;
  size?: "card" | "large" | "market";
};

const visualLayouts = {
  clinic: "rounded-t-[42%] rounded-b-lg",
  saas: "rounded-lg",
  service: "rounded-sm",
  commerce: "rounded-lg",
  healthcare: "rounded-[1.4rem]",
  hospitality: "rounded-t-full rounded-b-lg",
};

export function TemplatePreview({
  template,
  primary = template.palette.primary,
  background = template.palette.background,
  text = template.palette.text,
  surface = template.palette.surface,
  headline = template.headline,
  cta = template.cta,
  size = "card",
}: TemplatePreviewProps) {
  const isLarge = size === "large";
  const isMarket = size === "market";
  const scaleClass = isLarge ? "min-h-[42rem]" : isMarket ? "h-full min-h-full" : "h-[28rem]";
  const shellPadding = isLarge ? "p-5 sm:p-7" : isMarket ? "p-4" : "p-4";
  const headlineClass = isLarge
    ? "text-5xl leading-[0.94] sm:text-7xl"
    : isMarket
      ? "text-[clamp(1.7rem,2.45vw,2.9rem)] leading-[0.94]"
    : "text-3xl leading-[0.98]";

  return (
    <article
      className={cn(
        "relative isolate overflow-hidden rounded-lg border border-white/12 shadow-[0_28px_80px_rgba(0,0,0,0.36)]",
        scaleClass,
      )}
      style={{ background, color: text }}
      aria-label={`${template.name} website preview`}
    >
      <div
        className="absolute inset-0 opacity-55"
        style={{
          background: `radial-gradient(circle at 16% 8%, ${primary}40, transparent 25rem), radial-gradient(circle at 82% 20%, ${surface}66, transparent 20rem)`,
        }}
      />
      <div className={cn("relative flex h-full flex-col", shellPadding)}>
        <PreviewNav template={template} primary={primary} surface={surface} text={text} isLarge={isLarge} />

        <div className={cn("grid flex-1 gap-4", isLarge ? "mt-10 lg:grid-cols-[1.02fr_0.98fr]" : "mt-6")}>
          <div className="flex flex-col justify-between gap-5">
            <div>
              <div
                className="mb-4 inline-flex rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase"
                style={{ borderColor: `${text}30`, background: `${surface}AA` }}
              >
                {template.visualMood}
              </div>
              <h2 className={cn("max-w-[10ch] font-display font-semibold", headlineClass)}>
                {headline}
              </h2>
              <p className={cn("mt-4 max-w-xl leading-6 opacity-75", isLarge ? "text-base" : "line-clamp-3 text-xs")}>
                {template.supportingCopy}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="inline-flex min-h-10 items-center rounded-md px-3 py-2 text-xs font-bold"
                style={{ background: primary, color: readableOn(primary) }}
              >
                {cta}
              </span>
              <span className="text-xs font-semibold opacity-60">{template.proof}</span>
            </div>
          </div>

          <VisualPanel
            template={template}
            primary={primary}
            surface={surface}
            text={text}
            isLarge={isLarge}
          />
        </div>

        <div className={cn("relative mt-5 grid grid-cols-3 gap-2", isLarge ? "mt-8" : "", isMarket ? "hidden" : "")}>
          {template.sections.map((section, index) => (
            <div
              key={section}
              className="rounded-md border px-3 py-2 text-[10px] font-bold uppercase"
              style={{
                borderColor: `${text}24`,
                background: index === 0 ? `${primary}24` : `${surface}A8`,
              }}
            >
              {section}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function PreviewNav({
  template,
  primary,
  surface,
  text,
  isLarge,
}: {
  template: TemplateItem;
  primary: string;
  surface: string;
  text: string;
  isLarge: boolean;
}) {
  return (
    <div
      className="relative flex items-center justify-between rounded-md border px-3 py-2"
      style={{ borderColor: `${text}20`, background: `${surface}A8` }}
    >
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: primary }} />
        <span className="text-xs font-bold uppercase">{template.name}</span>
      </div>
      <div className={cn("items-center gap-4 text-[10px] font-bold uppercase opacity-62", isLarge ? "hidden sm:flex" : "hidden")}>
        {template.sections.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function VisualPanel({
  template,
  primary,
  surface,
  text,
  isLarge,
}: {
  template: TemplateItem;
  primary: string;
  surface: string;
  text: string;
  isLarge: boolean;
}) {
  const layout = visualLayouts[template.previewStyle];

  if (template.previewStyle === "saas") {
    return (
      <div className={cn("grid gap-3", isLarge ? "content-center" : "")}>
        <div className="grid grid-cols-[0.7fr_1fr] gap-3">
          <div className="rounded-lg border p-3" style={{ borderColor: `${text}22`, background: surface }}>
            <div className="mb-8 h-2 w-14 rounded-sm" style={{ background: primary }} />
            <div className="font-display text-4xl font-semibold">84</div>
            <div className="text-[10px] font-bold uppercase opacity-60">signals</div>
          </div>
          <div className="rounded-lg border p-3" style={{ borderColor: `${text}22`, background: `${surface}BB` }}>
            {[72, 48, 88, 60].map((width, index) => (
              <div key={index} className="mb-3 h-3 rounded-sm" style={{ width: `${width}%`, background: index === 2 ? primary : `${text}30` }} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-16 rounded-md border" style={{ borderColor: `${text}22`, background: item === 1 ? `${primary}44` : `${surface}B8` }} />
          ))}
        </div>
      </div>
    );
  }

  if (template.previewStyle === "commerce") {
    return (
      <div className="grid grid-cols-2 gap-3 self-end">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className={cn("aspect-[0.78] border p-3", item === 0 ? "row-span-2" : "", layout)}
            style={{ borderColor: `${text}22`, background: item === 0 ? primary : surface }}
          >
            <div className="mt-auto h-full rounded-md" style={{ background: item === 0 ? `${text}14` : `${primary}22` }} />
          </div>
        ))}
      </div>
    );
  }

  if (template.previewStyle === "hospitality") {
    return (
      <div className="grid grid-cols-[0.8fr_1.2fr] gap-3 self-end">
        <div className="space-y-3">
          <div className="h-28 rounded-lg border" style={{ borderColor: `${text}20`, background: surface }} />
          <div className="h-20 rounded-lg border" style={{ borderColor: `${text}20`, background: `${primary}55` }} />
        </div>
        <div className={cn("min-h-72 border", layout)} style={{ borderColor: `${text}22`, background: `linear-gradient(160deg, ${primary}, ${surface})` }} />
      </div>
    );
  }

  return (
    <div className="grid content-end gap-3">
      <div className={cn("min-h-64 border", layout)} style={{ borderColor: `${text}22`, background: `linear-gradient(145deg, ${primary}, ${surface})` }}>
        <div className="m-4 h-24 rounded-lg" style={{ background: `${text}12` }} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-16 rounded-md border" style={{ borderColor: `${text}20`, background: item === 0 ? `${primary}55` : `${surface}B8` }} />
        ))}
      </div>
    </div>
  );
}

function readableOn(hex: string) {
  const clean = hex.replace("#", "");
  const red = parseInt(clean.slice(0, 2), 16);
  const green = parseInt(clean.slice(2, 4), 16);
  const blue = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.58 ? "#151413" : "#F4EFE4";
}
