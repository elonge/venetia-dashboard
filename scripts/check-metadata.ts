import './load-env';
import clientPromise from '../lib/mongodb';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'document_chunks';

async function main() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const authors = await collection.distinct('metadata.author');
  const recipients = await collection.distinct('metadata.recipient');
  const sourceTypes = await collection.distinct('metadata.source_type');

  console.log('Distinct Authors:', authors);
  console.log('Distinct Recipients:', recipients);
  console.log('Distinct Source Types:', sourceTypes);

  await client.close();
}

main().catch(console.error);
