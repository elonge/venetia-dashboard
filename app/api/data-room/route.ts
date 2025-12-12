import { NextResponse } from 'next/server';
import { getAllTimelineDays } from '@/lib/timeline_days';

// Mock data for the Data Room
// TODO: Replace with actual database queries later

export interface SentimentData {
  tension: Array<{ x: number; y: number }>;
  warmth: Array<{ x: number; y: number }>;
  anxiety: Array<{ x: number; y: number }>;
  dateRange: { start: string; end: string };
}

export interface TopicData {
  topic: string;
  value: number;
  color: string;
}

export interface DailyLetterCountData {
  data: Array<{ x: number; y: number }>;
  peak: { date: string; count: number };
  dateRange: { start: string; end: string };
}

export interface PeopleData {
  name: string;
  count: number;
}

export interface DataRoomData {
  sentiment: SentimentData;
  topics: TopicData[];
  dailyLetterCount: DailyLetterCountData;
  people: PeopleData[];
}

export async function GET() {
  try {
    // Mock sentiment data (SVG path coordinates converted to data points)
    const sentimentData: SentimentData = {
      tension: [
        { x: 0, y: 80 }, { x: 30, y: 75 }, { x: 50, y: 60 },
        { x: 100, y: 40 }, { x: 150, y: 35 }, { x: 200, y: 50 }
      ],
      warmth: [
        { x: 0, y: 60 }, { x: 30, y: 50 }, { x: 50, y: 45 },
        { x: 100, y: 50 }, { x: 150, y: 70 }, { x: 200, y: 65 }
      ],
      anxiety: [
        { x: 0, y: 70 }, { x: 30, y: 65 }, { x: 50, y: 50 },
        { x: 100, y: 30 }, { x: 150, y: 25 }, { x: 200, y: 35 }
      ],
      dateRange: { start: '1910', end: '1915' }
    };

    // Generate topics frequency data from timeline_days collection
    const generateTopicsData = async () => {
      const allDays = await getAllTimelineDays();
      const topicFrequency = new Map<string, number>();
      
      // Extract topics from all letters in all timeline days
      for (const day of allDays) {
        const letters = day.prime_minister?.letters || [];
        for (const letter of letters) {
          const topics = letter.topics || [];
          for (const topic of topics) {
            if (topic && topic.trim()) {
              const normalizedTopic = topic.trim();
              topicFrequency.set(
                normalizedTopic,
                (topicFrequency.get(normalizedTopic) || 0) + 1
              );
            }
          }
        }
      }
      
      // Convert to array and sort by frequency (descending)
      const topicsArray = Array.from(topicFrequency.entries())
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count);
      
      // Calculate total occurrences for percentage calculation
      const totalOccurrences = topicsArray.reduce((sum, item) => sum + item.count, 0);
      
      // Color palette for topics
      const colors = [
        '#DC2626', // Red
        '#F59E0B', // Orange
        '#4A7C59', // Green
        '#6366F1', // Indigo
        '#EC4899', // Pink
        '#10B981', // Emerald
        '#3B82F6', // Blue
        '#8B5CF6', // Purple
        '#EF4444', // Light Red
        '#F97316', // Light Orange
      ];
      
      // Convert to TopicData format with percentages
      const topicsData: TopicData[] = topicsArray
        .slice(0, 10) // Top 10 topics
        .map((item, index) => ({
          topic: item.topic,
          value: totalOccurrences > 0 
            ? Math.round((item.count / totalOccurrences) * 100) 
            : 0,
          color: colors[index % colors.length],
        }));
      
      console.log(`[DEBUG] Topics frequency calculation:`);
      console.log(`[DEBUG]   Total timeline days processed: ${allDays.length}`);
      console.log(`[DEBUG]   Total topic occurrences: ${totalOccurrences}`);
      console.log(`[DEBUG]   Unique topics found: ${topicFrequency.size}`);
      console.log(`[DEBUG]   Top 10 topics:`, topicsData.map(t => `${t.topic} (${t.value}%)`).join(', '));
      
      return topicsData;
    };
    
    const topicsData = await generateTopicsData();

    // Generate weekly letter count data from timeline_days collection
    // Each data point represents a week with total letter count
    // x = week number, y = total number of letters for that week
    // Graph covers 1/1/1912 to end of 1915
    const generateDailyLetterData = async () => {
      const allDays = await getAllTimelineDays();
      console.log(`[DEBUG] Total days fetched from DB: ${allDays.length}`);
      
      // Fixed date range: 1/1/1912 to 12/31/1915
      const graphStartDateString = '1912-01-01';
      const graphEndDateString = '1915-12-31';
      
      // Filter days to only include dates within the graph range
      const filteredDays = allDays.filter(day => {
        return day.date_string >= graphStartDateString && day.date_string <= graphEndDateString;
      });
      
      console.log(`[DEBUG] Filtered days in range (1912-01-01 to 1915-12-31): ${filteredDays.length}`);
      
      if (filteredDays.length === 0) {
        return {
          data: [],
          peak: { date: '', count: 0 },
          dateRange: { start: '1912', end: '1915' }
        };
      }
      
      // Sort by date_string to ensure chronological order
      filteredDays.sort((a, b) => a.date_string.localeCompare(b.date_string));
      
      // Use fixed start date (1/1/1912) for calculating week numbers
      const [startYearNum, startMonth, startDay] = graphStartDateString.split('-').map(Number);
      const startDate = new Date(startYearNum, startMonth - 1, startDay);
      
      // Helper function to get week number from date_string
      const getWeekNumber = (dateString: string): number => {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const diffTime = date.getTime() - startDate.getTime();
        const daysDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return Math.floor(daysDiff / 7);
      };
      
      // Helper function to format date for peak display
      const formatDateForDisplay = (dateString: string): string => {
        const [year, month, day] = dateString.split('-').map(Number);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[month - 1]} ${year}`;
      };
      
      // Calculate total number of weeks in the range
      const [endYearNum, endMonthNum, endDayNum] = graphEndDateString.split('-').map(Number);
      const endDate = new Date(endYearNum, endMonthNum - 1, endDayNum);
      const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.ceil(totalDays / 7);
      
      console.log(`[DEBUG] Date range calculation:`);
      console.log(`[DEBUG]   Start date: ${graphStartDateString} = ${startDate.toISOString()}`);
      console.log(`[DEBUG]   End date: ${graphEndDateString} = ${endDate.toISOString()}`);
      console.log(`[DEBUG]   Total days: ${totalDays}`);
      console.log(`[DEBUG]   Total weeks: ${totalWeeks}`);
      
      // Debug: Show first and last few days
      if (filteredDays.length > 0) {
        console.log(`[DEBUG] First day: ${filteredDays[0].date_string}, Week: ${getWeekNumber(filteredDays[0].date_string)}, Letters: ${filteredDays[0].prime_minister?.letters?.length || 0}`);
        console.log(`[DEBUG] Last day: ${filteredDays[filteredDays.length - 1].date_string}, Week: ${getWeekNumber(filteredDays[filteredDays.length - 1].date_string)}, Letters: ${filteredDays[filteredDays.length - 1].prime_minister?.letters?.length || 0}`);
      }
      
      // Group days by week and sum letter counts
      const weeklyData = new Map<number, { totalLetters: number; weekStartDate: string }>();
      
      let totalLettersFromDB = 0;
      let daysWithLetters = 0;
      
      // Process each day and aggregate by week
      console.log(`[DEBUG] Processing ${filteredDays.length} days and aggregating by week...`);
      let processedCount = 0;
      
      for (const day of filteredDays) {
        const letterCount = day.prime_minister?.letters?.length || 0;
        totalLettersFromDB += letterCount;
        
        const weekNumber = getWeekNumber(day.date_string);
        
        if (letterCount > 0) {
          daysWithLetters++;
          if (processedCount < 10 || processedCount % 50 === 0) {
            console.log(`[DEBUG] Day ${day.date_string}: ${letterCount} letters -> Week ${weekNumber}`);
          }
        }
        
        if (!weeklyData.has(weekNumber)) {
          weeklyData.set(weekNumber, { totalLetters: 0, weekStartDate: day.date_string });
        }
        
        const weekData = weeklyData.get(weekNumber)!;
        const beforeCount = weekData.totalLetters;
        weekData.totalLetters += letterCount;
        
        if (letterCount > 0 && processedCount < 10) {
          console.log(`[DEBUG]   Week ${weekNumber} total: ${beforeCount} + ${letterCount} = ${weekData.totalLetters}`);
        }
        
        processedCount++;
      }
      
      console.log(`[DEBUG] Processed ${processedCount} days total`);
      
      console.log(`[DEBUG] Total letters from DB: ${totalLettersFromDB}`);
      console.log(`[DEBUG] Days with letters: ${daysWithLetters} out of ${filteredDays.length} total days`);
      console.log(`[DEBUG] Number of weeks with data: ${weeklyData.size}`);
      
      // Convert weekly data to array format - include ALL weeks (even with 0 letters)
      const data: Array<{ x: number; y: number }> = [];
      let maxCount = 0;
      let peakWeekNumber = 0;
      let minCount = Infinity;
      let weeksWithData = 0;
      let weeksWithZero = 0;
      
      console.log(`[DEBUG] Generating data points for weeks 0 to ${totalWeeks}...`);
      
      // Iterate through all weeks from 0 to totalWeeks
      for (let weekNumber = 0; weekNumber <= totalWeeks; weekNumber++) {
        const weekData = weeklyData.get(weekNumber);
        const letterCount = weekData?.totalLetters || 0;
        
        data.push({ x: weekNumber, y: letterCount });
        
        if (letterCount > 0) {
          weeksWithData++;
          console.log(`[DEBUG] Week ${weekNumber} (starting ${weekData?.weekStartDate || 'N/A'}): ${letterCount} total letters -> x:${weekNumber}, y:${letterCount}`);
        } else {
          weeksWithZero++;
        }
        
        if (letterCount > maxCount) {
          maxCount = letterCount;
          peakWeekNumber = weekNumber;
        }
        if (letterCount < minCount) {
          minCount = letterCount;
        }
      }
      
      // Find the date for the peak week
      const peakWeekData = weeklyData.get(peakWeekNumber);
      const peakDateString = peakWeekData?.weekStartDate || '';
      
      console.log(`[DEBUG] Data generation summary:`);
      console.log(`[DEBUG]   Total data points: ${data.length} (should be ${totalWeeks + 1})`);
      console.log(`[DEBUG]   Weeks with data: ${weeksWithData}`);
      console.log(`[DEBUG]   Weeks with zero: ${weeksWithZero}`);
      console.log(`[DEBUG]   Min letter count: ${minCount}`);
      console.log(`[DEBUG]   Max letter count: ${maxCount}`);
      console.log(`[DEBUG]   Peak week: Week ${peakWeekNumber} with ${maxCount} letters (date: ${peakDateString})`);
      
      // Show first 10 and last 10 data points
      console.log(`[DEBUG] First 10 data points:`);
      for (let i = 0; i < Math.min(10, data.length); i++) {
        console.log(`[DEBUG]   [${i}] x:${data[i].x}, y:${data[i].y}`);
      }
      console.log(`[DEBUG] Last 10 data points:`);
      for (let i = Math.max(0, data.length - 10); i < data.length; i++) {
        console.log(`[DEBUG]   [${i}] x:${data[i].x}, y:${data[i].y}`);
      }
      
      // Show sample of weeks with data
      const sampleWeeks = Array.from(weeklyData.entries()).slice(0, 5);
      console.log(`[DEBUG] Sample weeks with data (first 5):`);
      for (const [weekNum, weekInfo] of sampleWeeks) {
        console.log(`[DEBUG]   Week ${weekNum}: ${weekInfo.totalLetters} letters, start date: ${weekInfo.weekStartDate}`);
      }
      
      // Scale data to fit SVG viewBox (0 0 200 80)
      // x: scale from [0, totalWeeks] to [0, 200]
      // y: scale from [0, maxCount] to [70, 10] (INVERTED: 0 letters at bottom, max at top, with padding)
      // In SVG, y=0 is at top, so smaller y values = higher on screen
      const viewBoxWidth = 200;
      const viewBoxHeight = 80;
      const yPadding = 10; // Padding from top and bottom
      const yTop = yPadding; // Top of graph (for maxCount letters) - smaller y value
      const yBottom = viewBoxHeight - yPadding; // Bottom of graph (for 0 letters) - larger y value
      
      const scaledData = data.map((point, index) => {
        // Scale x: [0, totalWeeks] -> [0, viewBoxWidth]
        const scaledX = totalWeeks > 0 ? (point.x / totalWeeks) * viewBoxWidth : 0;
        
        // Scale y: [0, maxCount] -> [yBottom, yTop] (INVERTED: 0 letters at bottom, maxCount at top)
        // If maxCount is 0, all points should be at yBottom (bottom)
        const scaledY = maxCount > 0 
          ? yBottom - ((point.y / maxCount) * (yBottom - yTop))
          : yBottom;
        
        return { x: scaledX, y: scaledY };
      });
      
      console.log(`[DEBUG] Scaling data to fit viewBox (0 0 ${viewBoxWidth} ${viewBoxHeight}):`);
      console.log(`[DEBUG]   X range: [0, ${totalWeeks}] -> [0, ${viewBoxWidth}]`);
      console.log(`[DEBUG]   Y range: [0, ${maxCount}] -> [${yBottom}, ${yTop}] (INVERTED: 0 letters at bottom y=${yBottom}, ${maxCount} at top y=${yTop})`);
      console.log(`[DEBUG]   First scaled point: x:${scaledData[0].x.toFixed(2)}, y:${scaledData[0].y.toFixed(2)} (original: x:${data[0].x}, y:${data[0].y})`);
      console.log(`[DEBUG]   Last scaled point: x:${scaledData[scaledData.length - 1].x.toFixed(2)}, y:${scaledData[scaledData.length - 1].y.toFixed(2)} (original: x:${data[data.length - 1].x}, y:${data[data.length - 1].y})`);
      
      // Show sample of scaled points with non-zero values
      console.log(`[DEBUG] Sample scaled points with letters (first 10):`);
      let sampleCount = 0;
      for (let i = 0; i < scaledData.length && sampleCount < 10; i++) {
        if (data[i].y > 0) {
          console.log(`[DEBUG]   [${i}] scaled: x:${scaledData[i].x.toFixed(2)}, y:${scaledData[i].y.toFixed(2)} | original: x:${data[i].x}, y:${data[i].y}`);
          sampleCount++;
        }
      }
      
      if (maxCount > 0) {
        const peakIndex = data.findIndex(p => p.y === maxCount);
        if (peakIndex >= 0) {
          const peakScaledPoint = scaledData[peakIndex];
          console.log(`[DEBUG]   Peak scaled point: x:${peakScaledPoint.x.toFixed(2)}, y:${peakScaledPoint.y.toFixed(2)} (original: x:${data[peakIndex].x}, y:${data[peakIndex].y})`);
        }
        
        // Show min/max y values in scaled data
        const scaledYValues = scaledData.map(p => p.y);
        const minScaledY = Math.min(...scaledYValues);
        const maxScaledY = Math.max(...scaledYValues);
        console.log(`[DEBUG]   Scaled Y range: [${minScaledY.toFixed(2)}, ${maxScaledY.toFixed(2)}] (should be [${yBottom}, ${yTop}])`);
        
        // Show min/max x values in scaled data
        const scaledXValues = scaledData.map(p => p.x);
        const minScaledX = Math.min(...scaledXValues);
        const maxScaledX = Math.max(...scaledXValues);
        console.log(`[DEBUG]   Scaled X range: [${minScaledX.toFixed(2)}, ${maxScaledX.toFixed(2)}] (should be [0, ${viewBoxWidth}])`);
      }
      
      const result = {
        data: scaledData,
        peak: {
          date: peakDateString ? formatDateForDisplay(peakDateString) : '',
          count: maxCount
        },
        dateRange: {
          start: '1912',
          end: '1915'
        }
      };
      
      console.log(`[DEBUG] Final return object:`);
      console.log(`[DEBUG]   data.length: ${result.data.length}`);
      console.log(`[DEBUG]   peak: ${JSON.stringify(result.peak)}`);
      console.log(`[DEBUG]   dateRange: ${JSON.stringify(result.dateRange)}`);
      
      return result;
    };
    
    const dailyLetterCountData = await generateDailyLetterData();
    console.log(`[DEBUG] ===== FINAL RESPONSE DATA =====`);
    console.log(`[DEBUG] dailyLetterCountData.data.length: ${dailyLetterCountData.data.length}`);
    console.log(`[DEBUG] dailyLetterCountData.peak: ${JSON.stringify(dailyLetterCountData.peak)}`);
    console.log(`[DEBUG] dailyLetterCountData.dateRange: ${JSON.stringify(dailyLetterCountData.dateRange)}`);

    // Mock people data
    const peopleData: PeopleData[] = [
      { name: 'Lloyd George', count: 287 },
      { name: 'Churchill', count: 214 },
      { name: 'Violet Asquith', count: 189 },
      { name: 'Margot Asquith', count: 156 },
      { name: 'Edwin Montagu', count: 142 }
    ];

    const dataRoomData: DataRoomData = {
      sentiment: sentimentData,
      topics: topicsData,
      dailyLetterCount: dailyLetterCountData,
      people: peopleData
    };

    return NextResponse.json(dataRoomData);
  } catch (error) {
    console.error('Error in data room API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data room data' },
      { status: 500 }
    );
  }
}

