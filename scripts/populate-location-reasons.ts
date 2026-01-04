import { format, addDays, startOfYear, endOfYear, eachDayOfInterval } from 'date-fns';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const YEAR = 1915;
const PERSON = 'venetia'; // 'pm' or 'venetia'

async function main() {
  console.log(`Starting population of location reasons for ${YEAR}, person: ${PERSON}`);
  console.log(`Target URL: ${BASE_URL}/api/location_reason`);

  const startDate = new Date(YEAR, 3, 1); // April 1, 1915
  const endDate = new Date(YEAR, 5, 30); //  June 30, 1915

  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  
  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (const date of dates) {
    const dateString = format(date, 'yyyy-MM-dd');
    // const url = `${BASE_URL}/api/location_reason?date=${dateString}&person=${PERSON}`;
    const url = `${BASE_URL}/api/meeting_checker?date=${dateString}`;

    console.log(`Processing location_reason for ${dateString}...`);

    try {
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        const source = data.source; // 'cache' or 'agent' 
        
        if (source === 'cache') {
          console.log(`  -> Cached (${source})`);
          skipCount++;
        } else {
          console.log(`  -> Analyzed (${source})`);
          successCount++;
        }
      } else {
        console.error(`  -> Failed: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error(`     Error: ${errorText}`);
        failCount++;
      }
    } catch (error) {
      console.error(`  -> Network/Script Error:`, error);
      failCount++;
      // If connection refused, stop early?
      if ((error as any).cause?.code === 'ECONNREFUSED') {
         console.error('\nCannot connect to server. Is it running on http://localhost:3000?');
         process.exit(1);
      }
    }
    
    // Optional: add a tiny delay to be nice to the system if needed, 
    // but the prompt asked to wait for response which is already done by await.
  }

  console.log('\n--- Summary ---');
  console.log(`Total Days: ${dates.length}`);
  console.log(`Newly Analyzed: ${successCount}`);
  console.log(`Cached/Skipped: ${skipCount}`);
  console.log(`Failed: ${failCount}`);
}

main().catch(console.error);
