import './load-env';
import clientPromise from '../lib/mongodb';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'document_chunks';

const AUTHOR_MAPPINGS: Record<string, string> = {
  'Edwin S Montagu': 'Edwin Montagu',
  'Edwin S. Montagu': 'Edwin Montagu',
  ' Venetia Stanley': 'Venetia Stanley',
  'Venetia Montagu': 'Venetia Stanley', // Standardize to maiden name for consistency in this context, or keep separate? Let's map to Venetia Stanley for simplicity as most queries ask for Venetia.
};

const RECIPIENT_MAPPINGS: Record<string, string> = {
  'Edwin S Montagu': 'Edwin Montagu',
  'Edwin S. Montagu': 'Edwin Montagu',
  ' Venetia Stanley': 'Venetia Stanley',
  'Venetia Montagu': 'Venetia Stanley',
};

async function main() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  console.log('Starting metadata normalization...');

  // 1. Normalize Authors
  for (const [oldName, newName] of Object.entries(AUTHOR_MAPPINGS)) {
    const result = await collection.updateMany(
      { 'metadata.author': oldName },
      { $set: { 'metadata.author': newName } }
    );
    if (result.modifiedCount > 0) {
      console.log(`Updated author "${oldName}" to "${newName}": ${result.modifiedCount} docs`);
    }
  }

  // 2. Normalize Recipients
  for (const [oldName, newName] of Object.entries(RECIPIENT_MAPPINGS)) {
    const result = await collection.updateMany(
      { 'metadata.recipient': oldName },
      { $set: { 'metadata.recipient': newName } }
    );
    if (result.modifiedCount > 0) {
      console.log(`Updated recipient "${oldName}" to "${newName}": ${result.modifiedCount} docs`);
    }
  }
  
  // 3. Ensure "Asquith" is H.H. Asquith if somehow inconsistent (though usually H.H. Asquith)
  // Check distincts again to be sure
  const authors = await collection.distinct('metadata.author');
  console.log('Final Distinct Authors:', authors.sort());
  
  const recipients = await collection.distinct('metadata.recipient');
  console.log('Final Distinct Recipients:', recipients.sort());

  await client.close();
}

main().catch(console.error);
