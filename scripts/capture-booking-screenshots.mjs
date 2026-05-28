/**
 * Capture Booking MVP screenshots for the NEXORA landing page.
 * Usage: BOOKING_URL=http://localhost:3099 node scripts/capture-booking-screenshots.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "screenshots");
const baseUrl = (process.env.BOOKING_URL ?? "http://localhost:3099").replace(/\/$/, "");

const shots = [
  { name: "booking-home", path: "/", width: 1280, height: 900 },
  { name: "booking-admin", path: "/admin.html", width: 1280, height: 800 },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 2,
});

await mkdir(outDir, { recursive: true });

for (const shot of shots) {
  const page = await context.newPage();
  await page.setViewportSize({ width: shot.width, height: shot.height });
  await page.goto(`${baseUrl}${shot.path}`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(800);
  const file = path.join(outDir, `${shot.name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log("Saved", file);
  await page.close();
}

await browser.close();
console.log("Done.");
