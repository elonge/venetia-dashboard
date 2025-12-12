# RAG Chat System Setup Guide

This guide will help you set up the RAG (Retrieval-Augmented Generation) chat system for querying historical documents.

## Prerequisites

1. **MongoDB Atlas** with vector search enabled (M10+ cluster or Atlas Search)
2. **OpenAI API Key** for GPT-5 (or GPT-4o as fallback) and embeddings
3. **Node.js** and npm installed

## Environment Variables

Add the following to your `.env.local` file:

```env
# Existing
MONGODB_URI=your_mongodb_connection_string

# New - Required for chat system
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o  # or gpt-5 when available
EMBEDDING_MODEL=text-embedding-3-large
VECTOR_SEARCH_INDEX_NAME=vector_index
```

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including `dotenv` which is needed for the ingestion script to load environment variables.

## Step 2: Prepare Your Documents

Place your text files (`.txt` or `.md` format) in a directory. For example:

```
documents/
  ├── asquith_memoir.txt
  ├── cynthia_asquith_book.txt
  ├── venetia_letters.txt
  └── ...
```

## Step 3: Create the Collection (Optional but Recommended)

The ingestion script will automatically create the `document_chunks` collection, but you can create it manually first if you prefer:

1. Go to your MongoDB Atlas dashboard
2. Navigate to your database `venetia_project`
3. Click "Create Collection"
4. Name it: `document_chunks`
5. Click "Create"

**Note**: If you skip this step, the collection will be created automatically when you run the ingestion script.

## Step 4: Ingest Documents

Run the ingestion script to process your documents:

```bash
npm run ingest <path-to-documents-directory>
```

For example:
```bash
npm run ingest ./documents
```

The script will:
- Create the `document_chunks` collection if it doesn't exist
- Read all `.txt` and `.md` files from the directory
- Chunk them intelligently with overlap
- Generate embeddings using OpenAI's `text-embedding-3-large`
- Store them in MongoDB with metadata

**Note**: This process may take a while for large document sets (6.5MB compressed). The script processes documents in batches to avoid rate limits.

## Step 5: Create Vector Search Index in MongoDB Atlas

**Important**: You must run the ingestion script (Step 4) first, as the collection needs to exist before you can create the vector search index.

1. Go to your MongoDB Atlas dashboard
2. Navigate to your cluster → "Atlas Search" tab
3. Click "Create Search Index"
4. Select "JSON Editor"
5. Use the configuration from `scripts/setup-vector-index.json`:

```json
{
  "name": "vector_index",
  "type": "vectorSearch",
  "definition": {
    "fields": [
      {
        "type": "vector",
        "path": "embedding",
        "numDimensions": 1536,
        "similarity": "cosine"
      }
    ]
  }
}
```

6. Select the database: `venetia_project`
7. Select the collection: `document_chunks`
8. Click "Create Search Index"
9. Wait for the index to build (this may take a few minutes depending on the number of documents)

## Step 6: Start the Application

```bash
npm run dev
```

Navigate to `http://localhost:3000/chat` to use the chat interface.

**Note**: The chat will only work after you've completed both document ingestion (Step 4) and created the vector search index (Step 5).

## Usage

1. Open the chat interface at `/chat`
2. Ask questions about the historical documents
3. The system will:
   - Search for relevant document chunks using vector search
   - Retrieve the most relevant passages
   - Generate answers using GPT-5 (or GPT-4o)
   - Display source citations for transparency

## Troubleshooting

### Vector Search Not Working

If you see errors about vector search:
- Ensure the index is fully built in MongoDB Atlas
- Check that the index name matches `VECTOR_SEARCH_INDEX_NAME` in `.env.local`
- Verify your MongoDB Atlas cluster supports vector search (M10+ or Atlas Search enabled)

### Embedding Generation Fails

- Verify your `OPENAI_API_KEY` is correct
- Check your OpenAI API quota/limits
- Ensure you have access to the `text-embedding-3-large` model

### No Results Returned

- Verify documents were successfully ingested (check MongoDB collection)
- Try rephrasing your query
- Check that the vector search index is active

## Architecture

The system uses:
- **MongoDB Atlas Vector Search** for semantic document retrieval
- **OpenAI Embeddings** (`text-embedding-3-large`) for document and query embeddings
- **GPT-5/GPT-4o** for generating answers based on retrieved context
- **Streaming responses** for better user experience

## Customization

### Adjust Chunk Size

Edit `scripts/ingest-documents.ts`:
- `CHUNK_SIZE`: Default 1000 tokens
- `CHUNK_OVERLAP`: Default 200 tokens

### Adjust Retrieval Count

Edit `app/api/chat/route.ts`:
- Change the `limit` parameter in `searchSimilarChunks()` (default: 8)

### Modify System Prompt

Edit the `SYSTEM_PROMPT` constant in `app/api/chat/route.ts`

