import { NextResponse } from 'next/server';
import { getDailyRecordByDate, updateDailyRecordLocationActivity, updateDailyRecordLocationReason } from '@/lib/daily_records';
import { runLocationAnalysisWorkflow, runLocationFinderWorkflow } from '@/lib/chat/locationWorkflow';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const person = searchParams.get('person');

    if (!date || !person || (person.toLowerCase() !== 'pm' && person.toLowerCase() !== 'venetia')) {
      return NextResponse.json({ error: 'Invalid parameters. Requires date and person ("pm" or "venetia")' }, { status: 400 });
    }

    // Determine the key for storage ('pm' or 'venetia' lowercase)
    const personKey = person.toLowerCase() as 'pm' | 'venetia';

    // 1. Check if we already have the reason in the DB
    const dayRecord = await getDailyRecordByDate(date);
    const personLocation = personKey === 'pm' ? dayRecord?.pm_location : dayRecord?.venetia_location;
    if (!personLocation || personLocation == null || personLocation === 'Unknown' || personLocation === '') {
      console.log(`[LocationReason] No personLocation found for ${date}, attempting to find location for ${person}...`);
      const foundLocation = await runLocationFinderWorkflow(date, personKey === 'pm' ? 'PM' : 'Venetia');
      if (foundLocation.location && foundLocation.reason.probability !== 'unknown') {
        await updateDailyRecordLocationActivity(date, personKey, foundLocation);
        return NextResponse.json({ result: foundLocation, source: 'new location' });
      }
      
      return NextResponse.json({ error: 'No daily record found for the given date' }, { status: 404 });
    }
    
    const existingReason = personKey === 'pm' ? dayRecord?.pm_location_reason : dayRecord?.venetia_location_reason;

    if (existingReason) {
      return NextResponse.json({ reason: existingReason, source: 'cache' });
    }

    // 2. If not, ask the LLM Agent
    console.log(`[LocationReason] Analyzing location for ${person} on ${date}...`);
    const reason = await runLocationAnalysisWorkflow(date, personKey === 'pm' ? 'PM' : 'Venetia');

    // 3. Write the result to the database
    if (reason && reason?.probability !== "unknown") {
        await updateDailyRecordLocationReason(date, personKey, reason);
    }

    return NextResponse.json({ reason, source: 'agent' });

  } catch (error) {
    console.error('Error in location_reason API:', error);
    return NextResponse.json({ error: 'Failed to determine location reason' }, { status: 500 });
  }
}
