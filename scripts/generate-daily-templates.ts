import AdmZip from "adm-zip";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { chromium, type Browser } from "playwright";
import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PreviewStyle, TemplateTier } from "../data/templates";
import { referenceSources } from "./reference-sources";

type TierConfig = {
  tier: TemplateTier;
  priceUsd: 29 | 49 | 59;
  stack: string;
  packageKind: "css" | "react" | "next";
};

type Palette = {
  primary: string;
  background: string;
  text: string;
  surface: string;
};

type Recipe = {
  slug: string;
  previewStyle: PreviewStyle;
  visualMood: string;
  sections: [string, string, string];
  palette: Palette;
  motionProfiles: string[];
  headlineFormats: string[];
  ctaFormats: string[];
};

type GeneratedTemplate = {
  slug: string;
  title: string;
  industry: string;
  concept: string;
  previewStyle: PreviewStyle;
  headline: string;
  cta: string;
  supportingCopy: string;
  proof: string;
  sections: [string, string, string];
  visualMood: string;
  priceUsd: 29 | 49 | 59;
  priceCad: 29 | 49 | 59;
  tier: TemplateTier;
  stack: string;
  deliveryNote: string;
  accent: string;
  palette: Palette;
  stats: string;
  motionProfile: string;
  referenceIds: string[];
  signature: string;
};

type ReferenceSnapshot = {
  id: string;
  sourceUrl: string;
  discoveredUrl: string;
  title: string;
  screenshotPath?: string;
  remoteScreenshotPath?: string;
  palette: Partial<Palette>;
  layoutNotes: string;
  motionNotes: string;
  typographyNotes: string;
  interactionNotes: string;
  tags: string[];
};

type ScriptSupabase = SupabaseClient;

const tierConfigs: TierConfig[] = [
  {
    tier: "css",
    priceUsd: 29,
    stack: "HTML + CSS",
    packageKind: "css",
  },
  {
    tier: "react",
    priceUsd: 49,
    stack: "Vite React + TypeScript + Tailwind",
    packageKind: "react",
  },
  {
    tier: "premium",
    priceUsd: 59,
    stack: "Next.js + Tailwind + Framer Motion",
    packageKind: "next",
  },
];

const industries = [
  "Private Pilates Studio",
  "AI Compliance SaaS",
  "Ceramic Homeware Label",
  "Boutique Dental Clinic",
  "Micro Hotel",
  "Tattoo Appointment Studio",
  "Functional Medicine Practice",
  "Interior Styling Studio",
  "Premium Dog Groomer",
  "Cold Plunge Club",
  "Local Wine Bar",
  "Wedding Content Creator",
  "Architecture Portfolio",
  "Personal Chef",
  "Boutique Recruiting Firm",
  "Music Lesson Studio",
  "Independent Bookstore",
  "Artisan Chocolate Shop",
  "Dermatology Clinic",
  "B2B Analytics Tool",
  "Coworking Loft",
  "Luxury Car Detailer",
  "Yoga Retreat",
  "Landscape Design Firm",
  "Sustainable Fashion Label",
  "Language School",
  "Commercial Photographer",
  "Pet Wellness Clinic",
  "Boutique Accounting Office",
  "Podcast Production Studio",
  "Fermentation Workshop",
  "Nail Art Studio",
  "Private Security Consultant",
  "Boutique Real Estate Team",
  "Sleep Coaching Program",
  "Plant Shop",
  "Coffee Roaster",
  "Craft Furniture Maker",
  "No-Code Automation Agency",
  "Sports Recovery Clinic",
  "Modern Funeral Home",
  "Kids Coding Academy",
  "Boutique Law Office",
  "Luxury Picnic Service",
  "Independent Game Studio",
  "Hair Color Specialist",
  "Creator Newsletter",
  "Financial Coaching Studio",
  "Home Organization Service",
  "Boutique Fitness App",
];

const recipes: Recipe[] = [
  {
    slug: "editorial-gallery",
    previewStyle: "commerce",
    visualMood: "editorial, gallery-paced, tactile",
    sections: ["Index", "Story", "Reserve"],
    palette: {
      primary: "#D8C39F",
      background: "#0B0A09",
      text: "#F4EFE4",
      surface: "#1D1B18",
    },
    motionProfiles: ["opposing scroll columns", "hover crop zoom", "menu blend inversion"],
    headlineFormats: ["{industry} with a collector's rhythm", "A sharper room for {industry}", "Make {industry} feel worth finding"],
    ctaFormats: ["Open the drop", "View the edit", "Reserve the slot"],
  },
  {
    slug: "clinical-quiet",
    previewStyle: "clinic",
    visualMood: "soft clinical, spacious, trust-led",
    sections: ["Care", "Proof", "Book"],
    palette: {
      primary: "#B7D7A8",
      background: "#F2EFE7",
      text: "#172019",
      surface: "#FFFFFF",
    },
    motionProfiles: ["soft reveal stack", "sticky booking CTA", "treatment-card lift"],
    headlineFormats: ["{industry} with a calmer first impression", "A softer digital front desk for {industry}", "{industry} before the first visit"],
    ctaFormats: ["Book a consult", "Start intake", "See care options"],
  },
  {
    slug: "technical-room",
    previewStyle: "saas",
    visualMood: "precise, technical, investor-ready",
    sections: ["Signal", "Workflow", "Demo"],
    palette: {
      primary: "#8FA8FF",
      background: "#F4F6FF",
      text: "#121621",
      surface: "#FFFFFF",
    },
    motionProfiles: ["metric cascade", "dashboard hover lift", "scroll-linked proof strip"],
    headlineFormats: ["{industry} before the demo starts", "A clearer operating room for {industry}", "{industry} with proof in the first fold"],
    ctaFormats: ["See the tour", "Open the workflow", "Book a demo"],
  },
  {
    slug: "after-dark-service",
    previewStyle: "service",
    visualMood: "moody, appointment-first, tactile",
    sections: ["Menu", "Artists", "Reserve"],
    palette: {
      primary: "#C47A5A",
      background: "#201B18",
      text: "#F6EFE7",
      surface: "#2B2420",
    },
    motionProfiles: ["CSS marquee cue", "sticky service panel", "hover glow cards"],
    headlineFormats: ["{industry} after dark, booked before noon", "Make {industry} feel impossible to miss", "A moodier booking path for {industry}"],
    ctaFormats: ["Reserve a time", "Check openings", "Book the room"],
  },
  {
    slug: "hospitality-memory",
    previewStyle: "hospitality",
    visualMood: "cinematic, intimate, editorial travel",
    sections: ["Rooms", "Neighborhood", "Dates"],
    palette: {
      primary: "#C98D6B",
      background: "#171513",
      text: "#F4EDE2",
      surface: "#25211C",
    },
    motionProfiles: ["image-stack parallax", "room-card hover reveal", "date CTA slide"],
    headlineFormats: ["{industry} with a long memory", "A slower, richer doorway into {industry}", "{industry} that feels already remembered"],
    ctaFormats: ["Check dates", "View rooms", "Plan a stay"],
  },
  {
    slug: "bright-trust",
    previewStyle: "healthcare",
    visualMood: "bright, clean, trust-forward",
    sections: ["Paths", "Coverage", "Visit"],
    palette: {
      primary: "#7ED8D0",
      background: "#EEF7F5",
      text: "#10211F",
      surface: "#FFFFFF",
    },
    motionProfiles: ["care path tabs", "insurance strip reveal", "CTA focus ring lift"],
    headlineFormats: ["A brighter path into {industry}", "{industry} with fewer second guesses", "Make {industry} feel clear from click one"],
    ctaFormats: ["Start intake", "Find a path", "Plan a visit"],
  },
];

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const publish = options.publish;
  const dateKey = options.date ?? torontoDateKey();
  const outputRoot = path.join(process.cwd(), ".wemplate-output", dateKey);
  const supabase = publish ? getScriptSupabase() : getOptionalScriptSupabase();
  const recentIndustries = supabase ? await fetchRecentIndustries(supabase) : [];
  const recentSignatures = supabase ? await fetchRecentSignatures(supabase) : [];
  const references = await scoutReferences({
    supabase: publish ? supabase : null,
    outputRoot,
    maxPages: Number(process.env.SCOUT_REFERENCE_LIMIT ?? 12),
    maxDepth: Number(process.env.SCOUT_REFERENCE_DEPTH ?? 3),
  });
  const generated: GeneratedTemplate[] = [];
  const usedIndustries = new Set<string>();
  const usedSignatures = new Set(recentSignatures);

  await mkdir(outputRoot, { recursive: true });

  for (const tierConfig of tierConfigs) {
    for (let slot = 0; slot < 4; slot += 1) {
      const template = createUniqueTemplate({
        dateKey,
        tierConfig,
        slot,
        recentIndustries,
        usedIndustries,
        usedSignatures,
        references,
      });
      const packageDir = path.join(outputRoot, template.slug);
      await rm(packageDir, { recursive: true, force: true });
      await mkdir(packageDir, { recursive: true });
      await writeTemplatePackage(packageDir, template, tierConfig);
      const previewPath = await createPreviewScreenshot(packageDir, template, publish);
      const zipPath = await zipTemplatePackage(outputRoot, packageDir, template.slug);
      const quality = runQualityGate(template, generated, previewPath, publish);

      if (!quality.passed) {
        throw new Error(`Quality gate failed for ${template.slug}: ${quality.reason}`);
      }

      if (publish) {
        await publishTemplate({
          supabase: supabase!,
          template,
          zipPath,
          previewPath,
          dateKey,
        });
      }

      generated.push(template);
      usedIndustries.add(template.industry.toLowerCase());
      usedSignatures.add(template.signature);
      console.log(`${publish ? "Published" : "Generated"} ${template.slug} (${template.stack})`);
    }
  }

  await writeFile(
    path.join(outputRoot, "manifest.json"),
    `${JSON.stringify({ dateKey, generated, references }, null, 2)}\n`,
    "utf8",
  );
}

function createUniqueTemplate({
  dateKey,
  tierConfig,
  slot,
  recentIndustries,
  usedIndustries,
  usedSignatures,
  references,
}: {
  dateKey: string;
  tierConfig: TierConfig;
  slot: number;
  recentIndustries: string[];
  usedIndustries: Set<string>;
  usedSignatures: Set<string>;
  references: ReferenceSnapshot[];
}) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const random = createSeededRandom(`${dateKey}:${tierConfig.tier}:${slot}:${attempt}`);
    const industry = pickIndustry(random, recentIndustries, usedIndustries);
    const recipe = recipes[Math.floor(random() * recipes.length)];
    const motionProfile = recipe.motionProfiles[Math.floor(random() * recipe.motionProfiles.length)];
    const headlineFormat = recipe.headlineFormats[Math.floor(random() * recipe.headlineFormats.length)];
    const ctaFormat = recipe.ctaFormats[Math.floor(random() * recipe.ctaFormats.length)];
    const title = createTitle(industry, recipe, tierConfig, random);
    const slug = slugify(`${industry}-${tierConfig.priceUsd}-${dateKey}-${slot + 1}`);
    const referenceIds = references.slice(0, 4).map((reference) => reference.id);
    const signature = createSignature([
      tierConfig.tier,
      recipe.slug,
      recipe.palette.primary,
      recipe.sections.join("|"),
      motionProfile,
    ]);
    const template: GeneratedTemplate = {
      slug,
      title,
      industry,
      concept: `${tierConfig.stack} template for ${industry.toLowerCase()} teams that need a distinct site without starting from a blank page.`,
      previewStyle: recipe.previewStyle,
      headline: headlineFormat.replace("{industry}", industry),
      cta: ctaFormat,
      supportingCopy: createSupportingCopy(industry, tierConfig, recipe),
      proof: createProof(tierConfig, recipe),
      sections: recipe.sections,
      visualMood: recipe.visualMood,
      priceUsd: tierConfig.priceUsd,
      priceCad: tierConfig.priceUsd,
      tier: tierConfig.tier,
      stack: tierConfig.stack,
      deliveryNote: "ZIP, README, and brand swap guide are emailed after checkout.",
      accent: recipe.palette.primary,
      palette: recipe.palette,
      stats: createStats(tierConfig),
      motionProfile,
      referenceIds,
      signature,
    };

    if (!usedSignatures.has(signature)) {
      return template;
    }
  }

  throw new Error(`Could not create a unique ${tierConfig.tier} template for slot ${slot + 1}.`);
}

function pickIndustry(
  random: () => number,
  recentIndustries: string[],
  usedIndustries: Set<string>,
) {
  const blocked = new Set(
    recentIndustries.concat(Array.from(usedIndustries)).map((industry) => industry.toLowerCase()),
  );
  const candidates = industries.filter((industry) => !blocked.has(industry.toLowerCase()));
  const pool = candidates.length > 0 ? candidates : industries.filter((industry) => !usedIndustries.has(industry.toLowerCase()));

  return pool[Math.floor(random() * pool.length)] ?? industries[Math.floor(random() * industries.length)];
}

function createTitle(industry: string, recipe: Recipe, tierConfig: TierConfig, random: () => number) {
  const suffixes = ["Index", "Room", "Signal", "Edit", "Studio", "Market", "Path", "House"];
  const shortIndustry = industry
    .replace(/\b(Private|Boutique|Premium|Modern|Independent|Commercial|Sustainable)\b/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join(" ");
  const suffix = suffixes[Math.floor(random() * suffixes.length)];

  if (tierConfig.tier === "premium") {
    return `${shortIndustry} ${suffix}`;
  }

  if (recipe.slug.includes("clinical")) {
    return `${shortIndustry} Clinic`;
  }

  return `${shortIndustry} ${suffix}`;
}

function createSupportingCopy(industry: string, tierConfig: TierConfig, recipe: Recipe) {
  if (tierConfig.tier === "premium") {
    return `A fully responsive, motion-rich site for ${industry.toLowerCase()} brands that need premium interaction, scroll rhythm, and a conversion path that feels custom.`;
  }

  if (tierConfig.tier === "react") {
    return `A componentized React site for ${industry.toLowerCase()} teams that need reusable sections, fast edits, and a polished launch surface.`;
  }

  return `A lean CSS-only site for ${industry.toLowerCase()} operators who need a sharp, fast, easy-to-edit web presence.`;
}

function createProof(tierConfig: TierConfig, recipe: Recipe) {
  if (tierConfig.tier === "premium") {
    return `Includes ${recipe.sections.join(", ")}, Framer Motion direction, reduced-motion fallbacks, and setup notes.`;
  }

  if (tierConfig.tier === "react") {
    return `Includes typed components, responsive sections, and brand token notes.`;
  }

  return `Includes semantic HTML, responsive CSS, and copy replacement notes.`;
}

function createStats(tierConfig: TierConfig) {
  if (tierConfig.tier === "premium") {
    return "Premium motion system";
  }

  if (tierConfig.tier === "react") {
    return "Componentized React build";
  }

  return "CSS-only fast launch";
}

async function writeTemplatePackage(
  packageDir: string,
  template: GeneratedTemplate,
  tierConfig: TierConfig,
) {
  await writeFile(path.join(packageDir, "README.md"), createReadme(template), "utf8");
  await writeFile(path.join(packageDir, "preview.html"), createStaticPreview(template), "utf8");

  if (tierConfig.packageKind === "css") {
    await writeFile(path.join(packageDir, "index.html"), createStaticPreview(template), "utf8");
    await writeFile(path.join(packageDir, "style.css"), createStaticCss(template), "utf8");
    return;
  }

  if (tierConfig.packageKind === "react") {
    await mkdir(path.join(packageDir, "src"), { recursive: true });
    await writeFile(path.join(packageDir, "package.json"), createReactPackageJson(template), "utf8");
    await writeFile(path.join(packageDir, "index.html"), `<div id="root"></div><script type="module" src="/src/main.tsx"></script>\n`, "utf8");
    await writeFile(path.join(packageDir, "src", "main.tsx"), createReactMain(), "utf8");
    await writeFile(path.join(packageDir, "src", "App.tsx"), createReactApp(template), "utf8");
    await writeFile(path.join(packageDir, "src", "styles.css"), createStaticCss(template), "utf8");
    return;
  }

  await mkdir(path.join(packageDir, "app"), { recursive: true });
  await writeFile(path.join(packageDir, "package.json"), createNextPackageJson(template), "utf8");
  await writeFile(path.join(packageDir, "next.config.mjs"), "const nextConfig = {};\nexport default nextConfig;\n", "utf8");
  await writeFile(path.join(packageDir, "tailwind.config.ts"), createTailwindConfig(), "utf8");
  await writeFile(path.join(packageDir, "tsconfig.json"), createTsconfig(), "utf8");
  await writeFile(path.join(packageDir, "app", "layout.tsx"), createNextLayout(template), "utf8");
  await writeFile(path.join(packageDir, "app", "globals.css"), createStaticCss(template), "utf8");
  await writeFile(path.join(packageDir, "app", "page.tsx"), createNextPage(template), "utf8");
}

async function createPreviewScreenshot(
  packageDir: string,
  template: GeneratedTemplate,
  required: boolean,
) {
  const previewPath = path.join(packageDir, `${template.slug}-preview.png`);

  for (let attempt = 0; attempt < 2; attempt += 1) {
    let browser: Browser | null = null;

    try {
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
      await page.goto(`file://${path.join(packageDir, "preview.html").replace(/\\/g, "/")}`);
      await page.screenshot({ path: previewPath, fullPage: true });
      return previewPath;
    } catch (error) {
      if (attempt === 1) {
        if (required) {
          throw error;
        }

        console.warn(
          `Preview screenshot skipped for ${template.slug}: ${
            error instanceof Error ? error.message : "unknown error"
          }`,
        );
      }
    } finally {
      await browser?.close();
    }
  }

  return null;
}

async function zipTemplatePackage(outputRoot: string, packageDir: string, slug: string) {
  const zip = new AdmZip();
  zip.addLocalFolder(packageDir);
  const zipPath = path.join(outputRoot, `${slug}.zip`);
  zip.writeZip(zipPath);
  return zipPath;
}

function runQualityGate(
  template: GeneratedTemplate,
  generated: GeneratedTemplate[],
  previewPath: string | null,
  requirePreview: boolean,
) {
  const contrast = contrastRatio(template.palette.background, template.palette.text);

  if (contrast < 4.5) {
    return { passed: false, reason: `contrast ${contrast.toFixed(2)} is below 4.5` };
  }

  if (
    generated.some(
      (item) =>
        item.industry === template.industry ||
        item.signature === template.signature,
    )
  ) {
    return { passed: false, reason: "template is too similar to another daily template" };
  }

  if (requirePreview && !previewPath) {
    return { passed: false, reason: "preview screenshot was not created" };
  }

  return { passed: true };
}

async function publishTemplate({
  supabase,
  template,
  zipPath,
  previewPath,
  dateKey,
}: {
  supabase: ScriptSupabase;
  template: GeneratedTemplate;
  zipPath: string;
  previewPath: string | null;
  dateKey: string;
}) {
  const zipRemotePath = `${dateKey}/${path.basename(zipPath)}`;
  const previewRemotePath = previewPath ? `${dateKey}/${path.basename(previewPath)}` : null;

  await uploadFile(supabase, "template-zips", zipRemotePath, zipPath, "application/zip");

  if (previewPath && previewRemotePath) {
    await uploadFile(supabase, "template-previews", previewRemotePath, previewPath, "image/png");
  }

  const { error } = await supabase.from("templates").upsert(
    {
      slug: template.slug,
      title: template.title,
      industry: template.industry,
      concept: template.concept,
      preview_style: template.previewStyle,
      headline: template.headline,
      cta: template.cta,
      supporting_copy: template.supportingCopy,
      proof: template.proof,
      sections: template.sections,
      visual_mood: template.visualMood,
      price_usd: template.priceUsd,
      price_cad: template.priceCad,
      tier: template.tier,
      stack: template.stack,
      is_best_seller: true,
      delivery_note: template.deliveryNote,
      zip_path: zipRemotePath,
      preview_image_path: previewRemotePath,
      status: "published",
      motion_profile: template.motionProfile,
      generated_at: new Date().toISOString(),
      reference_ids: template.referenceIds,
      accent: template.accent,
      palette: template.palette,
      stats: template.stats,
      signature: template.signature,
    },
    { onConflict: "slug" },
  );

  if (error) {
    throw new Error(`Supabase template upsert failed: ${error.message}`);
  }
}

async function uploadFile(
  supabase: ScriptSupabase,
  bucket: string,
  remotePath: string,
  localPath: string,
  contentType: string,
) {
  const file = await readFile(localPath);
  const { error } = await supabase.storage.from(bucket).upload(remotePath, file, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw new Error(`Upload failed for ${remotePath}: ${error.message}`);
  }
}

async function scoutReferences({
  supabase,
  outputRoot,
  maxPages,
  maxDepth,
}: {
  supabase: ScriptSupabase | null;
  outputRoot: string;
  maxPages: number;
  maxDepth: number;
}) {
  const screenshotsDir = path.join(outputRoot, "references");
  const snapshots: ReferenceSnapshot[] = [];
  const visited = new Set<string>();
  const queue: Array<{ sourceUrl: string; discoveredUrl: string; depth: number }> =
    referenceSources.map((url) => ({ sourceUrl: url, discoveredUrl: url, depth: 1 }));
  let browser: Browser | null = null;

  await mkdir(screenshotsDir, { recursive: true });

  if (maxPages <= 0) {
    return snapshots;
  }

  try {
    browser = await chromium.launch({ headless: true });

    while (queue.length > 0 && snapshots.length < maxPages) {
      const next = queue.shift();

      if (!next || visited.has(next.discoveredUrl) || next.depth > maxDepth) {
        continue;
      }

      visited.add(next.discoveredUrl);
      const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

      try {
        await page.goto(next.discoveredUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
        await page.mouse.wheel(0, 900);
        await page.waitForTimeout(350);
        await page.mouse.wheel(0, -420);
        await page.waitForTimeout(160);

        const safeName = slugify(new URL(next.discoveredUrl).hostname + "-" + snapshots.length);
        const screenshotPath = path.join(screenshotsDir, `${safeName}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });

        const snapshot = await page.evaluate(() => {
          const styles = getComputedStyle(document.body);
          const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
            .map((link) => link.href)
            .filter(Boolean)
            .slice(0, 18);
          const menuTexts = Array.from(document.querySelectorAll("header a, nav a, header button, nav button"))
            .map((node) => node.textContent?.trim())
            .filter((text): text is string => Boolean(text))
            .slice(0, 10);
          const transitionSamples = Array.from(document.querySelectorAll<HTMLElement>("a, button, article, section"))
            .map((node) => getComputedStyle(node).transitionDuration)
            .filter((value) => value && value !== "0s")
            .slice(0, 8);

          return {
            title: document.title,
            background: styles.backgroundColor,
            color: styles.color,
            fontFamily: styles.fontFamily,
            scrollRatio: Math.round(document.documentElement.scrollHeight / Math.max(window.innerHeight, 1)),
            links,
            menuTexts,
            transitionSamples,
          };
        });

        const reference: ReferenceSnapshot = {
          id: createSignature([next.discoveredUrl]).slice(0, 12),
          sourceUrl: next.sourceUrl,
          discoveredUrl: next.discoveredUrl,
          title: snapshot.title,
          screenshotPath,
          palette: {
            background: snapshot.background,
            text: snapshot.color,
          },
          layoutNotes: `scroll-depth:${snapshot.scrollRatio}; menu-items:${snapshot.menuTexts.join(" | ") || "none"}`,
          motionNotes: `observed-transitions:${snapshot.transitionSamples.join(" | ") || "none"}; wheel-scroll-tested:true`,
          typographyNotes: `body-font:${snapshot.fontFamily}`,
          interactionNotes: "Scrolled page, sampled nav/menu affordances, and recorded transition timing without copying code or assets.",
          tags: [new URL(next.sourceUrl).hostname.replace(/^www\./, ""), `depth-${next.depth}`],
        };

        if (supabase) {
          const remoteScreenshotPath = `${torontoDateKey()}/${path.basename(screenshotPath)}`;
          await uploadFile(supabase, "reference-shots", remoteScreenshotPath, screenshotPath, "image/png");
          reference.remoteScreenshotPath = remoteScreenshotPath;
          await supabase.from("references").insert({
            source_url: reference.sourceUrl,
            discovered_url: reference.discoveredUrl,
            screenshot_path: reference.remoteScreenshotPath,
            title: reference.title,
            tags: reference.tags,
            palette: reference.palette,
            layout_notes: reference.layoutNotes,
            motion_notes: reference.motionNotes,
            typography_notes: reference.typographyNotes,
            interaction_notes: reference.interactionNotes,
            allowed_use: "reference_only",
          });
        }

        snapshots.push(reference);

        if (next.depth < maxDepth) {
          for (const link of snapshot.links) {
            if (shouldQueueReferenceLink(link, visited)) {
              queue.push({ sourceUrl: next.sourceUrl, discoveredUrl: link, depth: next.depth + 1 });
            }
          }
        }
      } catch (error) {
        console.warn(`Reference scout skipped ${next.discoveredUrl}: ${error instanceof Error ? error.message : "unknown error"}`);
      } finally {
        await page.close();
      }
    }
  } catch (error) {
    console.warn(`Reference scouting disabled: ${error instanceof Error ? error.message : "unknown error"}`);
  } finally {
    await browser?.close();
  }

  return snapshots;
}

function shouldQueueReferenceLink(link: string, visited: Set<string>) {
  if (visited.has(link)) {
    return false;
  }

  try {
    const url = new URL(link);
    const host = url.hostname.replace(/^www\./, "");
    const blockedHosts = ["facebook.com", "instagram.com", "x.com", "twitter.com", "linkedin.com", "youtube.com"];
    return ["http:", "https:"].includes(url.protocol) && !blockedHosts.some((blocked) => host.endsWith(blocked));
  } catch {
    return false;
  }
}

async function fetchRecentIndustries(supabase: ScriptSupabase) {
  const { data } = await supabase
    .from("templates")
    .select("industry")
    .order("generated_at", { ascending: false })
    .limit(10);

  return (data ?? [])
    .map((row) => String((row as { industry?: unknown }).industry ?? ""))
    .filter(Boolean);
}

async function fetchRecentSignatures(supabase: ScriptSupabase) {
  const { data } = await supabase
    .from("templates")
    .select("signature")
    .order("generated_at", { ascending: false })
    .limit(48);

  return (data ?? [])
    .map((row) => String((row as { signature?: unknown }).signature ?? ""))
    .filter(Boolean);
}

function getScriptSupabase() {
  const supabase = getOptionalScriptSupabase();

  if (!supabase) {
    throw new Error("Publishing requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return supabase;
}

function getOptionalScriptSupabase() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function parseArgs(args: string[]) {
  const dateIndex = args.indexOf("--date");

  return {
    publish: args.includes("--publish"),
    date: dateIndex >= 0 ? args[dateIndex + 1] : undefined,
  };
}

function torontoDateKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function createSeededRandom(seed: string) {
  let state = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    state ^= seed.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function createSignature(parts: string[]) {
  return createHash("sha256").update(parts.join("::")).digest("hex");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 72);
}

function contrastRatio(background: string, text: string) {
  const bg = relativeLuminance(hexToRgb(background));
  const fg = relativeLuminance(hexToRgb(text));
  const lighter = Math.max(bg, fg);
  const darker = Math.min(bg, fg);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(rgb: [number, number, number]) {
  const [red, green, blue] = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function createReadme(template: GeneratedTemplate) {
  return `# ${template.title}

Price tier: $${template.priceUsd}
Stack: ${template.stack}
Industry seed: ${template.industry}
Motion direction: ${template.motionProfile}

## Edit Guide

1. Replace the headline, CTA, and proof copy first.
2. Swap the palette in the CSS variables.
3. Replace image placeholders with licensed brand assets.
4. Run the stack-specific install/build command from package.json when included.

This package was generated by Wemplate from design rules and reference analysis only. It does not copy external code, images, or copy.
`;
}

function createStaticPreview(template: GeneratedTemplate) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(template.title)}</title>
  <link rel="stylesheet" href="./style.css" />
  <style>${createStaticCss(template)}</style>
</head>
<body>
  <main class="site-shell">
    <nav class="nav">
      <strong>${escapeHtml(template.title)}</strong>
      <span>${template.sections.map(escapeHtml).join("</span><span>")}</span>
    </nav>
    <section class="hero">
      <div class="eyebrow">${escapeHtml(template.visualMood)}</div>
      <h1>${escapeHtml(template.headline)}</h1>
      <p>${escapeHtml(template.supportingCopy)}</p>
      <a class="cta" href="#contact">${escapeHtml(template.cta)}</a>
    </section>
    <section class="proof-grid">
      ${template.sections.map((section, index) => `<article><span>0${index + 1}</span><h2>${escapeHtml(section)}</h2><p>${escapeHtml(template.proof)}</p></article>`).join("")}
    </section>
    <section id="contact" class="closing">
      <p>${escapeHtml(template.stats)}</p>
      <h2>${escapeHtml(template.concept)}</h2>
    </section>
  </main>
</body>
</html>
`;
}

function createStaticCss(template: GeneratedTemplate) {
  return `:root {
  --primary: ${template.palette.primary};
  --background: ${template.palette.background};
  --text: ${template.palette.text};
  --surface: ${template.palette.surface};
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 8%, color-mix(in srgb, var(--primary) 28%, transparent), transparent 28rem),
    linear-gradient(135deg, var(--background), color-mix(in srgb, var(--background) 86%, black));
  color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
a { color: inherit; }
.site-shell { width: min(100% - 32px, 1180px); margin: 0 auto; padding: 28px 0 64px; }
.nav {
  position: sticky;
  top: 18px;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, var(--text) 18%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--surface) 78%, transparent);
  backdrop-filter: blur(18px);
}
.nav span { display: inline-flex; gap: 18px; font-size: 12px; font-weight: 800; text-transform: uppercase; opacity: .68; }
.hero {
  min-height: 74vh;
  display: grid;
  align-content: end;
  gap: 22px;
  padding: 14vh 0 8vh;
}
.eyebrow {
  width: fit-content;
  border: 1px solid color-mix(in srgb, var(--text) 22%, transparent);
  border-radius: 8px;
  padding: 8px 10px;
  color: color-mix(in srgb, var(--text) 72%, transparent);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
}
h1 {
  max-width: 980px;
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(4rem, 11vw, 11rem);
  line-height: .82;
  letter-spacing: 0;
}
.hero p { max-width: 620px; margin: 0; font-size: clamp(1rem, 1.4vw, 1.25rem); line-height: 1.55; opacity: .74; }
.cta {
  width: fit-content;
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  padding: 0 18px;
  background: var(--primary);
  color: ${readableOn(template.palette.primary)};
  font-weight: 900;
  text-decoration: none;
  transition: transform .24s ease, filter .24s ease;
}
.cta:hover { transform: translateY(-2px); filter: brightness(1.04); }
.proof-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.proof-grid article, .closing {
  border: 1px solid color-mix(in srgb, var(--text) 16%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--surface) 76%, transparent);
  padding: 22px;
}
.proof-grid span { font-size: 12px; font-weight: 900; color: var(--primary); }
.proof-grid h2 { margin: 30px 0 10px; font-family: Georgia, "Times New Roman", serif; font-size: 32px; line-height: .95; }
.proof-grid p { margin: 0; line-height: 1.5; opacity: .7; }
.closing { margin-top: 14px; min-height: 32vh; display: grid; align-content: end; }
.closing h2 { max-width: 760px; margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: clamp(2.4rem, 6vw, 6rem); line-height: .88; }
.closing p { margin: 0 0 18px; color: var(--primary); font-weight: 900; text-transform: uppercase; }
@media (prefers-reduced-motion: no-preference) {
  .hero > *, .proof-grid article, .closing { animation: rise .7s cubic-bezier(.16, 1, .3, 1) both; }
  .proof-grid article:nth-child(2) { animation-delay: .08s; }
  .proof-grid article:nth-child(3) { animation-delay: .16s; }
  @keyframes rise { from { opacity: 0; transform: translateY(34px); } to { opacity: 1; transform: translateY(0); } }
}
@media (max-width: 760px) {
  .nav { position: static; align-items: flex-start; flex-direction: column; }
  .nav span { flex-wrap: wrap; }
  .proof-grid { grid-template-columns: 1fr; }
  .hero { min-height: 68vh; }
}
`;
}

function createReactPackageJson(template: GeneratedTemplate) {
  return `${JSON.stringify(
    {
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
      },
      dependencies: {
        "@vitejs/plugin-react": "latest",
        vite: "latest",
        typescript: "latest",
        react: "latest",
        "react-dom": "latest",
      },
      devDependencies: {},
      private: true,
      name: template.slug,
    },
    null,
    2,
  )}\n`;
}

function createReactMain() {
  return `import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);
`;
}

function createReactApp(template: GeneratedTemplate) {
  return `const sections = ${JSON.stringify(template.sections)};

export function App() {
  return (
    <main className="site-shell">
      <nav className="nav">
        <strong>${escapeJs(template.title)}</strong>
        <span>{sections.join(" / ")}</span>
      </nav>
      <section className="hero">
        <div className="eyebrow">${escapeJs(template.visualMood)}</div>
        <h1>${escapeJs(template.headline)}</h1>
        <p>${escapeJs(template.supportingCopy)}</p>
        <a className="cta" href="#contact">${escapeJs(template.cta)}</a>
      </section>
      <section className="proof-grid">
        {sections.map((section, index) => (
          <article key={section}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{section}</h2>
            <p>${escapeJs(template.proof)}</p>
          </article>
        ))}
      </section>
      <section id="contact" className="closing">
        <p>${escapeJs(template.stats)}</p>
        <h2>${escapeJs(template.concept)}</h2>
      </section>
    </main>
  );
}
`;
}

function createNextPackageJson(template: GeneratedTemplate) {
  return `${JSON.stringify(
    {
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
      },
      dependencies: {
        next: "latest",
        react: "latest",
        "react-dom": "latest",
        "framer-motion": "latest",
        tailwindcss: "latest",
        typescript: "latest",
      },
      devDependencies: {},
      private: true,
      name: template.slug,
    },
    null,
    2,
  )}\n`;
}

function createTailwindConfig() {
  return `import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
`;
}

function createTsconfig() {
  return `${JSON.stringify(
    {
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
    },
    null,
    2,
  )}\n`;
}

function createNextLayout(template: GeneratedTemplate) {
  return `import "./globals.css";

export const metadata = {
  title: "${escapeJs(template.title)}",
  description: "${escapeJs(template.concept)}",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
}

function createNextPage(template: GeneratedTemplate) {
  return `"use client";

import { motion, useReducedMotion } from "framer-motion";

const sections = ${JSON.stringify(template.sections)};

export default function Page() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="site-shell">
      <nav className="nav">
        <strong>${escapeJs(template.title)}</strong>
        <span>{sections.join(" / ")}</span>
      </nav>
      <motion.section
        className="hero"
        initial={reduceMotion ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="eyebrow">${escapeJs(template.visualMood)}</div>
        <h1>${escapeJs(template.headline)}</h1>
        <p>${escapeJs(template.supportingCopy)}</p>
        <motion.a className="cta" href="#contact" whileHover={reduceMotion ? undefined : { y: -2 }}>
          ${escapeJs(template.cta)}
        </motion.a>
      </motion.section>
      <section className="proof-grid">
        {sections.map((section, index) => (
          <motion.article
            key={section}
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: index * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{section}</h2>
            <p>${escapeJs(template.proof)}</p>
          </motion.article>
        ))}
      </section>
      <motion.section id="contact" className="closing" whileInView={reduceMotion ? undefined : { scale: 1 }}>
        <p>${escapeJs(template.stats)}</p>
        <h2>${escapeJs(template.concept)}</h2>
      </motion.section>
    </main>
  );
}
`;
}

function readableOn(hex: string) {
  const [red, green, blue] = hexToRgb(hex);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.58 ? "#151413" : "#F4EFE4";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeJs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
