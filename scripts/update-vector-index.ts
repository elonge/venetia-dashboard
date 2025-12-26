import './load-env';
import clientPromise from '../lib/mongodb';
import fs from 'fs/promises';
import path from 'path';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'document_chunks';
const INDEX_NAME = 'vector_index';
const DEFINITION_PATH = path.join(process.cwd(), 'scripts/setup-vector-index.json');

async function main() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  console.log(`Reading index definition from ${DEFINITION_PATH}...`);
  const definitionFile = await fs.readFile(DEFINITION_PATH, 'utf-8');
  const definition = JSON.parse(definitionFile);

  console.log(`Updating search index "${INDEX_NAME}" on "${COLLECTION_NAME}"...`);
  
  try {
    // Try to list indexes to see if it exists
    const indexes = await collection.listSearchIndexes().toArray();
    const exists = indexes.find(i => i.name === INDEX_NAME);

    if (exists) {
      console.log('Index exists. Updating...');
      await collection.updateSearchIndex(INDEX_NAME, definition.definition);
      console.log('Update command sent. Changes may take a few minutes to propagate.');
    } else {
      console.log('Index does not exist. Creating...');
      await collection.createSearchIndex({
        name: INDEX_NAME,
        type: 'vectorSearch',
        definition: definition.definition
      });
      console.log('Creation command sent.');
    }

  } catch (error) {
    console.error('Failed to update/create index:', error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
