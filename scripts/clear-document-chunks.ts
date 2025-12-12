// Load environment variables BEFORE any other imports
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') });

import clientPromise from '../lib/mongodb';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'document_chunks';

async function clearDocumentChunks() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    console.log('Clearing all document chunks from collection...');
    
    const result = await collection.deleteMany({});
    
    console.log(`Deleted ${result.deletedCount} document chunks.`);
    console.log('Collection is now empty and ready for re-ingestion.');
    
    await client.close();
  } catch (error) {
    console.error('Error clearing document chunks:', error);
    throw error;
  }
}

clearDocumentChunks()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

