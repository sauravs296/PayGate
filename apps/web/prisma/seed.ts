// prisma/seed.ts
// Seeds the database with a demo developer and 3 paywalled APIs.
// Run: npx tsx prisma/seed.ts
//
// Safe to re-run — uses upsert so it won't create duplicates.
// The demo APIs point at public mock/free endpoints so the e2e script works
// immediately without standing up a separate backend.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding PayGate database...\n");

  // ── Demo developer ──────────────────────────────────────────────────────────
  // Uses a placeholder wallet — replace with your real testnet G... address
  // after generating one via Friendbot.
  const dev = await prisma.developer.upsert({
    where: { stellarWallet: "GDEMO_REPLACE_WITH_REAL_WALLET_ADDRESS_HERE001" },
    update: {},
    create: {
      stellarWallet: "GDEMO_REPLACE_WITH_REAL_WALLET_ADDRESS_HERE001",
      email: "demo@paygate.dev",
    },
  });
  console.log(`✔ Developer: ${dev.stellarWallet}`);

  // ── Demo API 1: Weather feed ─────────────────────────────────────────────────
  // Points at a free, no-auth public weather API for demo purposes
  const weatherApi = await prisma.api.upsert({
    where: { slug: "demo-weather" },
    update: {},
    create: {
      developerId: dev.id,
      slug: "demo-weather",
      name: "Demo Weather API",
      description:
        "Current weather conditions for London — $0.001 per call. Powered by Open-Meteo (free, no key needed).",
      targetUrl:
        "https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current_weather=true",
      priceUsdc: 0.001,
      isListed: true,
      isActive: true,
    },
  });
  console.log(`✔ API: /${weatherApi.slug}  →  $${weatherApi.priceUsdc}/call`);

  // ── Demo API 2: Crypto price feed ────────────────────────────────────────────
  const priceApi = await prisma.api.upsert({
    where: { slug: "demo-xlm-price" },
    update: {},
    create: {
      developerId: dev.id,
      slug: "demo-xlm-price",
      name: "XLM Price Feed",
      description:
        "Live Stellar (XLM) price in USD — $0.002 per call. Sourced from CoinGecko public API.",
      targetUrl:
        "https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd",
      priceUsdc: 0.002,
      isListed: true,
      isActive: true,
    },
  });
  console.log(`✔ API: /${priceApi.slug}  →  $${priceApi.priceUsdc}/call`);

  // ── Demo API 3: Cat fact (unlisted, for internal testing) ────────────────────
  const catApi = await prisma.api.upsert({
    where: { slug: "demo-cat-fact" },
    update: {},
    create: {
      developerId: dev.id,
      slug: "demo-cat-fact",
      name: "Random Cat Fact",
      description:
        "Returns a random cat fact. Unlisted — used for internal e2e testing only.",
      targetUrl: "https://catfact.ninja/fact",
      priceUsdc: 0.0005,
      isListed: false,
      isActive: true,
    },
  });
  console.log(`✔ API: /${catApi.slug}  →  $${catApi.priceUsdc}/call  (unlisted)`);

  console.log("\n✅ Seed complete.");
  console.log("\nTest the paywall route:");
  console.log("  API_SLUG=demo-weather npx tsx scripts/e2e-demo.ts");
  console.log("\nReplace the placeholder wallet above with your real G... address");
  console.log("then re-run:  npx tsx prisma/seed.ts");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
