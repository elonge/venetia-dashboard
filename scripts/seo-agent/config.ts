import path from "node:path";

export const SEO_QUERIES = [
  "Venetia Stanley",
  "Venetia Stanley biography",
  "who was Venetia Stanley",
  "Venetia Stanley Asquith",
  "Venetia Stanley letters",
  "Asquith letters to Venetia Stanley",
  "Venetia Stanley Edwin Montagu",
  "why did Venetia Stanley marry Edwin Montagu",
  "Venetia Stanley after 1915",
  "Edwin Montagu",
  "Edwin Montagu biography",
  "Edwin Montagu Venetia Stanley",
  "Edwin Montagu Precipice",
  "is Precipice a true story",
] as const;

function envInt(name: string, fallback: number) {
  const parsed = Number.parseInt(process.env[name] || "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const seoConfig = {
  siteUrl: process.env.SEO_SITE_URL || "https://www.thevenetiaproject.com",
  searchConsoleProperty:
    process.env.GOOGLE_SEARCH_CONSOLE_PROPERTY || "sc-domain:thevenetiaproject.com",
  lookbackDays: envInt("SEO_LOOKBACK_DAYS", 28),
  dataLagDays: envInt("SEO_DATA_LAG_DAYS", 3),
  mixpanelOverlapDays: envInt("MIXPANEL_OVERLAP_DAYS", 7),
  outputDir: path.resolve(process.env.SEO_OUTPUT_DIR || "reports/seo"),
  mongoDatabase: process.env.SEO_MONGODB_DATABASE || "venetia_seo",
  markets: [
    { code: "GB", locationCode: 2826, languageCode: "en" },
    { code: "US", locationCode: 2840, languageCode: "en" },
  ],
};
