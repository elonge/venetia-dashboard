# Local SEO evidence collector and MCP server

The system has two deliberately separate parts:

1. `npm run seo:collect` gathers evidence and writes immutable snapshots.
2. `npm run seo:mcp` exposes that stored evidence through read-only MCP tools.

Generated Markdown and HTML are factual summaries, not automated recommendations.

## Collect evidence

```bash
npm run seo:collect
```

Outputs:

```text
reports/seo/evidence/latest.json
reports/seo/evidence/runs/<timestamp>.json
reports/seo/summaries/latest.md
reports/seo/summaries/latest.html
reports/seo/summaries/runs/<timestamp>.{md,html}
```

Collection is resilient: one failed external provider becomes a data-quality warning
and does not prevent other evidence from being saved. Search Console, DataForSEO,
and Mixpanel retain the environment variables documented in `.env.example`.

## Start the MCP server

```bash
npm run seo:mcp
```

The server uses stdio and must be launched by an MCP host; running it directly waits
for protocol messages. It never calls external APIs, and all tools are read-only.
Collection remains a separate, explicit command.

Available tools:

- `get_data_quality`
- `get_seo_overview`
- `analyze_query`
- `analyze_page`
- `get_change_timeline`
- `get_serp`
- `get_organic_engagement`
- `inspect_site_content`
- `classify_query`

## Codex configuration

Register it once, then restart Codex:

```bash
codex mcp add venetia-seo -- npm --prefix /Users/elongecht/code/venetia-dashboard --silent run seo:mcp
```

Verify with `codex mcp list`. This workspace has already been registered locally.

The repository `AGENTS.md` instructs Codex to consult this server for SEO analysis.

## Security

Keep credentials in `.env.local`. Google service-account JSON files matching
`gsc-service-account.json` or `*-service-account.json` are ignored by Git. MCP tool
responses never include environment variables or credential contents.
