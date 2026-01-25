# The Venetia Project

An interactive digital archive exploring the secret correspondence between British Prime Minister H.H. Asquith and socialite Venetia Stanley (1912–1915).

![The Venetia Project Cover](/public/og-image.jpg)

## Overview

The Venetia Project uses modern web technologies and AI to structure, visualize, and explore over 500 historical letters. It offers a unique window into the Edwardian era, World War I politics, and a complex personal relationship.

### Key Features

*   **Interactive Timeline:** Navigate the correspondence day-by-day.
*   **Data Room:** Analyze the frequency, sentiment, and topics of the letters.
*   **Social Graph:** Explore the network of people mentioned in the letters.
*   **AI-Enhanced Search:** Semantically search the archive to find specific topics or emotions.
*   **Immersive Reading:** Read the letters in a clean, distraction-free environment.

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