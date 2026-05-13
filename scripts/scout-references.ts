import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { referenceSources } from "./reference-sources";

async function main() {
  const outputRoot = path.join(process.cwd(), ".wemplate-output", "reference-scout");
  const maxPages = Number(process.env.SCOUT_REFERENCE_LIMIT ?? 20);
  const rows: Array<Record<string, unknown>> = [];

  await mkdir(outputRoot, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  try {
    for (const sourceUrl of referenceSources.slice(0, maxPages)) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

      try {
        await page.goto(sourceUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
        await page.mouse.wheel(0, 900);
        await page.waitForTimeout(300);
        const data = await page.evaluate(() => {
          const styles = getComputedStyle(document.body);
          const nav = Array.from(document.querySelectorAll("header a, nav a, header button, nav button"))
            .map((node) => node.textContent?.trim())
            .filter(Boolean)
            .slice(0, 12);

          return {
            title: document.title,
            bodyFont: styles.fontFamily,
            background: styles.backgroundColor,
            color: styles.color,
            nav,
            scrollHeight: document.documentElement.scrollHeight,
          };
        });

        rows.push({ sourceUrl, ...data });
        console.log(`Scouted ${sourceUrl}`);
      } catch (error) {
        rows.push({
          sourceUrl,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  await writeFile(path.join(outputRoot, "reference-scout.json"), `${JSON.stringify(rows, null, 2)}\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
