import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function findLongestRainStreak() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('venetia_project');
    const collection = db.collection('weather');

    const startDate = new Date('1914-01-01');
    const endDate = new Date('1914-12-31');

    console.log('Searching for rain streaks in London, 1914...');

    const cursor = collection.find({
      location: 'London',
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });

    let longestStreak = 0;
    let currentStreak = 0;
    let longestStreakStart: Date | null = null;
    let longestStreakEnd: Date | null = null;
    let currentStreakStart: Date | null = null;

    const records = await cursor.toArray();
    console.log(`Found ${records.length} records for London in 1914.`);

    for (const record of records) {
      const isRainy = record.prcp && record.prcp > 0;

      if (isRainy) {
        if (currentStreak === 0) {
          currentStreakStart = record.date;
        }
        currentStreak++;
        
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
          longestStreakStart = currentStreakStart;
          longestStreakEnd = record.date;
        }
      } else {
        currentStreak = 0;
        currentStreakStart = null;
      }
    }

    if (longestStreak > 0) {
      console.log('\n--- Longest Rain Streak Found ---');
      console.log(`Length: ${longestStreak} days`);
      console.log(`Start: ${longestStreakStart?.toISOString().split('T')[0]}`);
      console.log(`End:   ${longestStreakEnd?.toISOString().split('T')[0]}`);
    } else {
      console.log('No rain streaks found.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

findLongestRainStreak();
