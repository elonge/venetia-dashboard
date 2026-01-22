The technology behind venetia project:
1. Two projects
  1. extract the data (python, chrome extensions, to scrape, extract, ocr - with gemini - and normalized the data)
  2. Search, analyze and visualize the data - for chat interface, charts, podcasts

# Tools I used:
https://the-venetia-project.vercel.app/about

# Primary sources:
https://the-venetia-project.vercel.app/about

# About the 1st part:
This part of the project isn’t about scraping — it’s about indexing. I built tools that let me read historical archives at scale, the same way libraries or search engines do, so the sources could be analyzed, cited, and explored responsibly.

### The Concept: "Digital Excavation"

* **Vectorization (`scripts_rag/ingest_documents.py`):**
* You split the clean text into chunks (approx 1000 tokens) with overlap so context isn't lost between breaks.
* You generate **Embeddings** (using `text-embedding-3-large`)—mathematical representations of the text's meaning—and upload them to **MongoDB** for semantic search.

# Here's the 2nd part:
Here is the technical raw material derived from your codebase, structured into thematic segments suitable for planning a technical deep-dive podcast.

### 1. Core Architecture: The "Agentic" Workflow

Instead of a simple chatbot, your project uses a sophisticated **Agentic Workflow**. The system acts as a "Digital Historian" that reasons before it answers.

* **The Brain (`lib/chat/workflow.ts`):**
* The core is an `Agent` powered by `gpt-5.2-2025-12-11` (or 4o).
* It operates on a specific "Strategy" defined in the System Prompt: *Date-Check -> Triangulate -> Visualize -> Quantify -> Contextualize*.
* **Tool-Use over Hallucination:** The agent is explicitly instructed *not* to use its internal training data for facts but to call specific tools (e.g., `get_daily_locations_and_proximity`, `get_personal_chunks_in_range`) to retrieve evidence first.


* **Specialized Sub-Agents (`lib/chat/locationWorkflow.ts`):**
* You have decoupled specific historical tasks into their own workflows to increase accuracy.
* **The Location Historian:** A dedicated agent solely responsible for determining *why* a person was at a specific location, outputting a probability score (`high`, `medium`, `low`) alongside the reason.
* **The Meeting Checker:** Another specialized agent that looks at proximity data and letters to determine if Asquith and Venetia actually met on a specific day.



### 2. The "RAG" (Retrieval-Augmented Generation) Engine

Your search mechanism is much more complex than simple keyword matching. It uses **Semantic Search** and **Concept Expansion**.

* **Vector Search (`lib/vector-search.ts`):**
* The project uses OpenAI embeddings (`text-embedding-3-large`) stored in MongoDB.
* It performs a **Hybrid Search**: It combines vector similarity (semantic meaning) with traditional metadata filters (Date Range, Author, Sentiment Score).
* *Fallback Mechanism:* If the vector search fails, the code automatically falls back to a regex/keyword search to ensure the user gets *some* result.


* **Concept Expansion (`lib/sentiment-series.ts`):**
* *The "Secret Sauce":* When a user searches for a concept (e.g., "Sadness"), the system doesn't just search for the word "Sadness."
* It uses an LLM to "expand" the concept into 1910s-appropriate synonyms and indicators (e.g., "depression," "black dog," "wretchedness") before searching the database.
* It generates a JSON object containing `synonyms`, `indicators`, and `exclusions` (related concepts to avoid) to make the search historically accurate.



### 3. Data Integrity & "Hallucination Control"

The project uses strict typing and a multi-pass verification system to ensure historical accuracy.

* **Structured Outputs with Zod (`lib/schemas.ts`):**
* You force the AI to output structured JSON data, not just text.
* You use **Zod schemas** to validate everything. For example, a `LocationReasonAnswer` must contain a `reason` (string), a `probability` (enum), and a list of `source` citations. If the AI output doesn't match this schema, it is rejected.


* **The "Editor" Layer (`lib/chat/formatFinalAnswers.ts`):**
* There is a dedicated post-processing step. After the main agent generates an answer, a separate LLM call (acting as a "professional historical editor") runs.
* **Citation Enforcement:** This layer parses the raw text and matches it against `ValidatedSourceIds`. It ensures that every claim is backed by a footnote in the final Markdown output. It separates the "Narrative" (`markdownText`) from the "Evidence" (`footnotes`).



### 4. Mathematical History: Quantifying Emotion

You are turning qualitative history (letters) into quantitative data (graphs).

* **Sentiment Metrics (`lib/sentiment-series.ts` & `lib/recharts-transformers.ts`):**
* You track three distinct emotional metrics over time: **Tension** (Political Unburdening), **Warmth** (Romantic Adoration), and **Anxiety** (Emotional Desolation).
* The system calculates a "Rolling Mean" (moving average) to smooth out the data points and show trends over weeks or months rather than just daily noise.
* Data is normalized (0 to 100 scale) to make different metrics comparable on the same graph.


* **Proximity Calculations (`lib/daily_records.ts`):**
* The system calculates the physical distance (in km) between the Prime Minister and Venetia Stanley daily.
* It uses geospatial coordinates (`geo_coords`) stored in the daily records to track their physical separation vs. their correspondence volume.



### 5. The Tech Stack Summary

* **Database:** MongoDB (with Atlas Vector Search).
* **Language:** TypeScript (heavy use of Interfaces and Types for historical data).
* **AI Models:** OpenAI GPT-5.2 (logic/reasoning) and GPT-4o-mini (formatting/extraction).
* **Validation:** Zod (schema validation).
* **Frontend Data Prep:** Custom transformers for Recharts, Vis.js, and React-Chrono.

### Suggested Podcast Segments (Based on the above):

1. **The "Agent" Approach:** Why we didn't just dump PDFs into ChatGPT. (Discussing the `tools.ts` and workflow strategy).
2. **Structuring the Unstructured:** How we force the AI to follow strict schemas (Zod) so history doesn't become hallucination.
3. **Concept Expansion:** The coolest tech feature—teaching the AI to understand 1914 slang before it searches the database.
4. **The "Editor" LLM:** The second pass that checks citations (The `formatFinalAnswers.ts` pipeline).