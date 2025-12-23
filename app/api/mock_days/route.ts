import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { DayData } from '@/components/daily/types';

/**
 * API endpoint to serve mock_days.json with proper date formatting
 * Converts datetime(1913, 1, 15) format to "1913-01-15"
 */
export async function GET() {
  try {
    const filePath = join(process.cwd(), 'mock_days.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    
    // Replace datetime(year, month, day) with "YYYY-MM-DD" format
    const processedContent = fileContent.replace(
      /datetime\((\d+),\s*(\d+),\s*(\d+)\)/g,
      (match, year, month, day) => {
        const monthStr = String(month).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        return `"${year}-${monthStr}-${dayStr}"`;
      }
    );
    
    const days: DayData[] = JSON.parse(processedContent);
    
    return NextResponse.json(days);
  } catch (error) {
    console.error('Error loading mock_days.json:', error);
    return NextResponse.json(
      { error: 'Failed to load mock days data' },
      { status: 500 }
    );
  }
}
