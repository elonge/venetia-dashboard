export type Period = { start: string; end: string; comparisonStart: string; comparisonEnd: string };

export type SearchRow = {
  date: string; query: string; page: string; country: string; device: string;
  clicks: number; impressions: number; ctr: number; position: number;
};

export type SerpResult = {
  query: string; market: string; device: string; checkedAt: string; rank: number;
  domain: string; url: string; title: string; description: string; resultType: string;
};

export type RepoPage = {
  route: string; source: string; hasMetadata: boolean; hasCanonical: boolean;
  hasStructuredData: boolean; title?: string; description?: string; headings: string[];
  internalLinks: string[]; contentHash: string;
};

export type GitChange = {
  commit: string; committedAt: string; subject: string; files: string[];
  affectedRoutes: string[]; changeTypes: string[];
};

export type ProductionPage = {
  url: string; status?: number; finalUrl?: string; title?: string; canonical?: string;
  robots?: string; h1?: string; headings?: string[]; internalLinks?: string[];
  structuredDataTypes?: string[]; error?: string;
};

export type MixpanelEvidence = {
  status: string; totalStoredEvents?: number;
  topEvents?: Array<{ event: string; count: number }>;
  topPages?: Array<{ page: string; count: number }>;
  organicAttributionAvailable?: boolean; organicEvents?: number;
};

export type EvidencePackage = {
  schemaVersion: 2; generatedAt: string; period: Period; sources: Record<string, string>;
  dataQuality: string[];
  searchConsole: { current: SearchRow[]; comparison: SearchRow[] };
  serp: { current: SerpResult[]; lastSuccessfulSnapshot?: string };
  repository: { pages: RepoPage[] };
  production: { checkedAt: string; pages: ProductionPage[] };
  git: { changes: GitChange[] };
  mixpanel: MixpanelEvidence;
};
