# The Venetia Project

An interactive digital archive exploring the secret correspondence between British Prime Minister H.H. Asquith and socialite Venetia Stanley (1912–1915).

![The Venetia Project Cover](/public/og-image.jpg)

## Overview

The Venetia Project uses modern web technologies and AI to structure, visualize, and explore over 80MB of historical letters, diaries, etc.. It offers a unique window into the Edwardian era, World War I politics, and a complex personal relationship.

### Key Features

*   **Interactive Timeline:** Navigate the correspondence day-by-day.
*   **Data Room:** Analyze the frequency, sentiment, and topics of the letters.
*   **Social Graph:** Explore the network of people mentioned in the letters.
*   **AI-Enhanced Search:** Semantically search the archive to find specific topics or emotions.
*   **Immersive Reading:** Read the letters in a clean, distraction-free environment.

## Deep Dives

### 1. The Historian Agent (Chat)

The chat interface is a sophisticated Retrieval-Augmented Generation (RAG) system built with the `@openai/agents` framework. It acts as an automated researcher that can synthesize information from multiple disparate sources.

*   **Multi-Tool Orchestration:** The agent chooses from 10+ specialized tools to gather data:
    *   `get_personal_chunks`: Semantic search through private letters and diaries.
    *   `get_cabinet_chunks` & `get_parliament_chunks`: Queries official records to cross-reference personal claims with state reality.
    *   `get_daily_locations`: Accesses geo-spatial data to verify the proximity of individuals on specific dates.
    *   `get_correspondence_metrics`: Analyzes pre-computed sentiment trends (e.g., tracking "romantic intensity" or "war anxiety").
*   **Triangulation Strategy:** The agent is system-prompted to compare personal, official, and academic perspectives. It identifies contradictions (e.g., what Asquith said in a letter vs. what he did in a Cabinet meeting) to provide a nuanced historical narrative.
*   **Academic Rigor:** All responses include inline citations and automated Markdown footnotes linked to verified archive fragments.

### 2. Social Search (Person Tracing)

Tracing individuals across historical archives is challenging due to the frequent use of nicknames, titles (e.g., "The PM"), and familial shorthand. The Social Search system uses a multi-stage resolution engine:

*   **Canonical Resolution:** A dedicated `name_alias_collection` maps hundreds of variations (e.g., "Winston", "WSC", "First Lord") to canonical identities (e.g., "Winston Churchill").
*   **Contextual Aliases:** It handles "conditional aliases" where a nickname might refer to different people depending on who is writing or receiving the letter.
*   **Mention Extraction:** Once a person is resolved, the engine scans the `primary_sources` for every document where that person is mentioned, either by their real name or an alias.
*   **Context Snippets:** Results are displayed with dynamic context windows that highlight the specific alias match within the original text.

### 3. Vector Search Engine

The underlying search capability is powered by **MongoDB Atlas Vector Search** and **OpenAI Embeddings** (`text-embedding-3-large`).

*   **Semantic Understanding:** Unlike keyword search, the vector engine understands concepts. Searching for "loneliness" will find letters where the word isn't used but the sentiment is present.
*   **Chunking Strategy:** Documents are broken into overlapping chunks to preserve local context while staying within embedding token limits.
*   **Hybrid Filtering:** The system combines vector similarity scores with hard metadata filters (date ranges, authors, source types) to ensure results are both relevant and historically accurate.

## Tech Stack

*   **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Database:** MongoDB
*   **Analytics:** Mixpanel, Vercel Analytics
*   **Visualization:** Recharts, React Force Graph, Leaflet (Maps)
*   **AI/LLM:** OpenAI (for embeddings and analysis)

## Getting Started

### Prerequisites

*   Node.js 18.17 or later
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/venetia-dashboard.git
    cd venetia-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory. You will need keys for:
    *   `MONGODB_URI`: Connection string for the data.
    *   `OPENAI_API_KEY`: For vector search and AI features.
    *   `NEXT_PUBLIC_MIXPANEL_TOKEN`: For analytics.
    *   `MIXPANEL_PROXY_TARGET`: (Optional) Mixpanel ingestion host for the server-side proxy. Defaults to `https://api-js.mixpanel.com`.
    *   `NEXT_PUBLIC_APP_URL`: The production URL.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

*   `app/`: Next.js App Router pages and API routes.
    *   `(site)/`: Public-facing pages.
    *   `api/`: Backend endpoints.
*   `components/`: Reusable UI components (charts, maps, etc.).
*   `lib/`: Utility functions, database connections, and business logic.
*   `public/`: Static assets (images, fonts).
*   `scripts/`: ETL scripts for ingesting and processing letter data.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## License

This project is open source and available under the [MIT License](LICENSE).
