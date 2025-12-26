import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function migrate() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('venetia_project');
    const collection = db.collection('weather');

    console.log('Connected to MongoDB');

    const cursor = collection.find({});
    let processed = 0;
    let updated = 0;

    for await (const doc of cursor) {
      const updates: any = {};
      
      // Fields to convert to float
      const fields = ['tmax', 'tmin', 'tavg', 'prcp'];

      for (const field of fields) {
        const val = doc[field];
        // If it's a string, try to parse it
        if (typeof val === 'string') {
          const num = parseFloat(val);
          if (!isNaN(num)) {
            updates[field] = num;
          }
        }
      }

      if (Object.keys(updates).length > 0) {
        await collection.updateOne({ _id: doc._id }, { $set: updates });
        updated++;
      }
      processed++;
      if (processed % 100 === 0) {
          process.stdout.write(`\rProcessed ${processed} records...`);
      }
    }

    console.log(`\nMigration complete. Processed: ${processed}, Updated: ${updated}`);

    // Validation
    console.log('Validating records...');
    // We want to ensure that if the field exists and is not null, it is a number (double/int/decimal)
    // $type: 'number' matches any numeric type.
    const invalidDocs = await collection.find({
        $or: [
            { tmax: { $exists: true, $ne: null, $not: { $type: 'number' } } },
            { tmin: { $exists: true, $ne: null, $not: { $type: 'number' } } },
            { tavg: { $exists: true, $ne: null, $not: { $type: 'number' } } },
            { prcp: { $exists: true, $ne: null, $not: { $type: 'number' } } }
        ]
    }).toArray();

    if (invalidDocs.length > 0) {
        console.warn(`Found ${invalidDocs.length} records with non-numeric weather data:`);
        // Limit output
        invalidDocs.slice(0, 10).forEach(d => console.log(`- ID: ${d._id}, Date: ${d.date}, Loc: ${d.location}`));
        if (invalidDocs.length > 10) console.log(`...and ${invalidDocs.length - 10} more.`);
    } else {
        console.log('All records validated successfully (numeric types).');
    }

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

migrate();
