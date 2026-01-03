import { NextResponse } from 'next/server';
import { getDailyRecordByDate, updateDailyRecordLocationActivity, updateDailyRecordLocationReason, updateDailyRecordWithMetVenetia } from '@/lib/daily_records';
import { runLocationAnalysisWorkflow, runLocationFinderWorkflow, runMeetingCheckerWorkflow } from '@/lib/chat/locationWorkflow';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date ) {
      return NextResponse.json({ error: 'Invalid parameters. Requires date' }, { status: 400 });
    }

    // 1. Check if we already have the reason in the DB
    const dayRecord = await getDailyRecordByDate(date);

    // 2. If not, ask the LLM Agent
    console.log(`[Meeting Checker] Checking possibility for a meeting in ${date}...`);
    const answer = await runMeetingCheckerWorkflow(date);

    // 3. Write the result to the database
    const dbValue = dayRecord?.met_venetia ? true : false;
    if (answer && answer?.reason?.probability !== "unknown") {
      if (answer.met !== dbValue) {
        console.log(`[Meeting Checker] Possible conflict found. DB says met_venetia=${dbValue}, LLM answer is ${answer.met}. Updating record...`);
        await updateDailyRecordWithMetVenetia(date, answer);
      }
    }

    return NextResponse.json({ conflict: (dbValue !== answer.met), answer, source: 'agent' });

  } catch (error) {
    console.error('Error in location_reason API:', error);
    return NextResponse.json({ error: 'Failed to determine location reason' }, { status: 500 });
  }
}
