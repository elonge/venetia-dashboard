import { NextResponse } from 'next/server';
import { getAllTimelineDays } from '@/lib/timeline_days';
import { getAsquithVenetiaProximitySeries } from '@/lib/daily_records';

// Mock data for the Data Room
// TODO: Replace with actual database queries later

export interface SentimentData {
  tension: Array<{ x: number; y: number; date?: string }>;
  warmth: Array<{ x: number; y: number; date?: string }>;
  anxiety: Array<{ x: number; y: number; date?: string }>;
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
  weeks: Array<{ weekStartDate: string; letterCount: number }>; // Weekly data with dates for react-chrono
}

export interface PeopleData {
  name: string;
  count: number;
}

export interface MeetingDatesData {
  dates: Array<{ date: string; meeting_details: string }>;
  total: number;
  dateRange: { start: string; end: string };
  timeline: Array<{ x: number; date: string }>; // x coordinate and date for timeline visualization
}

export interface AsquithVenetiaProximityData {
  points: Array<{
    date: string;
    distance_km: number;
    status?: string;
    calculated_from?: { pm?: string; venetia?: string };
    geo_coords: { pm: { lat: number; lng: number }; venetia: { lat: number; lng: number } };
  }>;
  dateRange: { start: string; end: string };
  maxDistanceKm: number;
}

export interface DataRoomData {
  sentiment: SentimentData;
  topics: TopicData[];
  dailyLetterCount: DailyLetterCountData;
  people: PeopleData[];
  meetingDates: MeetingDatesData;
  asquithVenetiaProximity: AsquithVenetiaProximityData;
}

export async function GET() {
  try {
    // Generate sentiment data from timeline_days collection using scores field
    const generateSentimentData = async (): Promise<SentimentData> => {
      const allDays = await getAllTimelineDays();
      console.log('[DEBUG] Sentiment Data Generation - Total days fetched:', allDays.length);
      
      // Fixed date range: 1910 to 1915 (based on original mock data)
      const graphStartDateString = '1910-01-01';
      const graphEndDateString = '1915-12-31';
      
      // Filter days to only include dates within the graph range
      const filteredDays = allDays.filter(day => {
        return day.date_string >= graphStartDateString && day.date_string <= graphEndDateString;
      });
      
      console.log('[DEBUG] Sentiment Data Generation - Filtered days (1910-1915):', filteredDays.length);
      
      if (filteredDays.length === 0) {
        console.log('[DEBUG] Sentiment Data Generation - No days in range, returning empty data');
        return {
          tension: [],
          warmth: [],
          anxiety: [],
          dateRange: { start: '1910', end: '1915' }
        };
      }
      
      // Sort by date_string to ensure chronological order
      filteredDays.sort((a, b) => a.date_string.localeCompare(b.date_string));
      
      // Debug: Log sample scores from first few days
      console.log('[DEBUG] Sentiment Data Generation - Sample scores (first 5 days):');
      filteredDays.slice(0, 5).forEach((day, idx) => {
        console.log(`  Day ${idx + 1} (${day.date_string}):`, {
          political_unburdening: day.scores?.political_unburdening,
          romantic_adoration: day.scores?.romantic_adoration,
          emotional_desolation: day.scores?.emotional_desolation,
          rawScores: day.scores,
          scoresType: typeof day.scores,
          scoresKeys: day.scores ? Object.keys(day.scores) : 'no scores'
        });
      });
      
      // Debug: Check for non-zero scores and find min/max
      const allTensionScores: number[] = [];
      const allWarmthScores: number[] = [];
      const allAnxietyScores: number[] = [];
      
      filteredDays.forEach(day => {
        const scores = day.scores || {};
        if (scores.political_unburdening !== undefined) {
          allTensionScores.push(scores.political_unburdening);
        }
        if (scores.romantic_adoration !== undefined) {
          allWarmthScores.push(scores.romantic_adoration);
        }
        if (scores.emotional_desolation !== undefined) {
          allAnxietyScores.push(scores.emotional_desolation);
        }
      });
      
      console.log('[DEBUG] Score statistics:');
      console.log('  Tension (political_unburdening):', {
        count: allTensionScores.length,
        min: allTensionScores.length > 0 ? Math.min(...allTensionScores) : 'N/A',
        max: allTensionScores.length > 0 ? Math.max(...allTensionScores) : 'N/A',
        nonZeroCount: allTensionScores.filter(s => s > 0).length,
        sampleNonZero: allTensionScores.filter(s => s > 0).slice(0, 5)
      });
      console.log('  Warmth (romantic_adoration):', {
        count: allWarmthScores.length,
        min: allWarmthScores.length > 0 ? Math.min(...allWarmthScores) : 'N/A',
        max: allWarmthScores.length > 0 ? Math.max(...allWarmthScores) : 'N/A',
        nonZeroCount: allWarmthScores.filter(s => s > 0).length,
        sampleNonZero: allWarmthScores.filter(s => s > 0).slice(0, 5)
      });
      console.log('  Anxiety (emotional_desolation):', {
        count: allAnxietyScores.length,
        min: allAnxietyScores.length > 0 ? Math.min(...allAnxietyScores) : 'N/A',
        max: allAnxietyScores.length > 0 ? Math.max(...allAnxietyScores) : 'N/A',
        nonZeroCount: allAnxietyScores.filter(s => s > 0).length,
        sampleNonZero: allAnxietyScores.filter(s => s > 0).slice(0, 5)
      });
      
      // Debug: Find and log days with non-zero scores
      const daysWithNonZeroScores = filteredDays.filter(day => {
        const scores = day.scores || {};
        return (scores.political_unburdening && scores.political_unburdening > 0) ||
               (scores.romantic_adoration && scores.romantic_adoration > 0) ||
               (scores.emotional_desolation && scores.emotional_desolation > 0);
      });
      
      console.log('[DEBUG] Days with non-zero scores:', daysWithNonZeroScores.length);
      if (daysWithNonZeroScores.length > 0) {
        console.log('[DEBUG] Sample days with non-zero scores (first 5):');
        daysWithNonZeroScores.slice(0, 5).forEach((day, idx) => {
          console.log(`  Day ${idx + 1} (${day.date_string}):`, {
            political_unburdening: day.scores?.political_unburdening,
            romantic_adoration: day.scores?.romantic_adoration,
            emotional_desolation: day.scores?.emotional_desolation,
          });
        });
      }
      
      // Debug: Sample from different parts of dataset
      const midPoint = Math.floor(filteredDays.length / 2);
      const endPoint = Math.max(0, filteredDays.length - 5);
      console.log('[DEBUG] Sample scores from middle of dataset (around index', midPoint, '):');
      filteredDays.slice(midPoint, midPoint + 3).forEach((day, idx) => {
        console.log(`  Day ${midPoint + idx} (${day.date_string}):`, {
          political_unburdening: day.scores?.political_unburdening,
          romantic_adoration: day.scores?.romantic_adoration,
          emotional_desolation: day.scores?.emotional_desolation,
        });
      });
      console.log('[DEBUG] Sample scores from end of dataset (last 3):');
      filteredDays.slice(endPoint).forEach((day, idx) => {
        console.log(`  Day ${endPoint + idx} (${day.date_string}):`, {
          political_unburdening: day.scores?.political_unburdening,
          romantic_adoration: day.scores?.romantic_adoration,
          emotional_desolation: day.scores?.emotional_desolation,
        });
      });
      
      // Use fixed start date for calculating x coordinates
      const [startYearNum, startMonth, startDay] = graphStartDateString.split('-').map(Number);
      const startDate = new Date(startYearNum, startMonth - 1, startDay);
      
      // Helper function to get days since start from date_string
      const getDaysSinceStart = (dateString: string): number => {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const diffTime = date.getTime() - startDate.getTime();
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
      };
      
      // Calculate total days in the range
      const [endYearNum, endMonthNum, endDayNum] = graphEndDateString.split('-').map(Number);
      const endDate = new Date(endYearNum, endMonthNum - 1, endDayNum);
      const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate actual data range (first day to last day in filtered data)
      const firstDataDay = filteredDays[0]?.date_string;
      const lastDataDay = filteredDays[filteredDays.length - 1]?.date_string;
      const firstDataDate = firstDataDay ? (() => {
        const [y, m, d] = firstDataDay.split('-').map(Number);
        return new Date(y, m - 1, d);
      })() : startDate;
      const lastDataDate = lastDataDay ? (() => {
        const [y, m, d] = lastDataDay.split('-').map(Number);
        return new Date(y, m - 1, d);
      })() : endDate;
      const actualDataRangeDays = Math.floor((lastDataDate.getTime() - firstDataDate.getTime()) / (1000 * 60 * 60 * 24));
      
      console.log('[DEBUG] Data range calculation:');
      console.log('  Full range (1910-1915):', totalDays, 'days');
      console.log('  Actual data range:', actualDataRangeDays, 'days');
      console.log('  First data day:', firstDataDay);
      console.log('  Last data day:', lastDataDay);
      
      // SVG viewBox dimensions
      const viewBoxWidth = 200;
      const viewBoxHeight = 80;
      const yPadding = 10;
      const yTop = yPadding;
      const yBottom = viewBoxHeight - yPadding;
      
      // Fixed score range: all scores are between 0 and 10
      const scoreMin = 0;
      const scoreMax = 10;
      
      // Helper function to scale score to y coordinate (inverted: higher score = lower y)
      // score 0 -> yBottom (bottom of graph)
      // score 10 -> yTop (top of graph)
      const scaleScore = (score: number): number => {
        // Clamp score to 0-10 range
        const clampedScore = Math.max(scoreMin, Math.min(scoreMax, score));
        // Normalize to 0-1
        const normalized = clampedScore / scoreMax;
        // Map to y coordinate (inverted: 0 at bottom, 1 at top)
        return yBottom - (normalized * (yBottom - yTop));
      };
      
      // Build data points for each sentiment
      const tensionPoints: Array<{ x: number; y: number; date?: string }> = [];
      const warmthPoints: Array<{ x: number; y: number; date?: string }> = [];
      const anxietyPoints: Array<{ x: number; y: number; date?: string }> = [];
      
      // Store points with metadata for debugging
      const tensionPointsWithScores: Array<{ x: number; y: number; score: number; date: string }> = [];
      const warmthPointsWithScores: Array<{ x: number; y: number; score: number; date: string }> = [];
      const anxietyPointsWithScores: Array<{ x: number; y: number; score: number; date: string }> = [];
      
      let daysWithTension = 0;
      let daysWithWarmth = 0;
      let daysWithAnxiety = 0;
      
      // Calculate days since first data day for the first data point (should be 0)
      const firstDataDaysSinceStart = firstDataDay ? getDaysSinceStart(firstDataDay) : 0;
      
      for (const day of filteredDays) {
        // Calculate x based on actual data range (first day to last day)
        // This ensures the graph spans from x=0 to x=200
        const daysSinceFirstData = getDaysSinceStart(day.date_string) - firstDataDaysSinceStart;
        const scaledX = actualDataRangeDays > 0 ? (daysSinceFirstData / actualDataRangeDays) * viewBoxWidth : 0;
        
        const scores = day.scores || {};
        
        // Tension (political_unburdening)
        if (scores.political_unburdening !== undefined) {
          const scaledY = scaleScore(scores.political_unburdening);
          tensionPoints.push({ x: scaledX, y: scaledY, date: day.date_string });
          tensionPointsWithScores.push({ x: scaledX, y: scaledY, score: scores.political_unburdening, date: day.date_string });
          daysWithTension++;
        }
        
        // Warmth (romantic_adoration)
        if (scores.romantic_adoration !== undefined) {
          const scaledY = scaleScore(scores.romantic_adoration);
          warmthPoints.push({ x: scaledX, y: scaledY, date: day.date_string });
          warmthPointsWithScores.push({ x: scaledX, y: scaledY, score: scores.romantic_adoration, date: day.date_string });
          daysWithWarmth++;
        }
        
        // Anxiety (emotional_desolation)
        if (scores.emotional_desolation !== undefined) {
          const scaledY = scaleScore(scores.emotional_desolation);
          anxietyPoints.push({ x: scaledX, y: scaledY, date: day.date_string });
          anxietyPointsWithScores.push({ x: scaledX, y: scaledY, score: scores.emotional_desolation, date: day.date_string });
          daysWithAnxiety++;
        }
      }
      
      // Debug: Log summary statistics
      console.log('[DEBUG] Sentiment Data Generation - Summary:');
      console.log('  Total days processed:', filteredDays.length);
      console.log('  Days with tension (political_unburdening):', daysWithTension);
      console.log('  Days with warmth (romantic_adoration):', daysWithWarmth);
      console.log('  Days with anxiety (emotional_desolation):', daysWithAnxiety);
      console.log('  Tension points generated:', tensionPoints.length);
      console.log('  Warmth points generated:', warmthPoints.length);
      console.log('  Anxiety points generated:', anxietyPoints.length);
      
      // Debug: Log sample data points
      if (tensionPoints.length > 0) {
        console.log('[DEBUG] Sample tension points (first 3):', tensionPoints.slice(0, 3));
      }
      if (warmthPoints.length > 0) {
        console.log('[DEBUG] Sample warmth points (first 3):', warmthPoints.slice(0, 3));
      }
      if (anxietyPoints.length > 0) {
        console.log('[DEBUG] Sample anxiety points (first 3):', anxietyPoints.slice(0, 3));
      }
      
      // Debug: Log points with non-zero scores to verify scaling
      const nonZeroTension = tensionPointsWithScores.filter(p => p.score > 0).slice(0, 5);
      const nonZeroWarmth = warmthPointsWithScores.filter(p => p.score > 0).slice(0, 5);
      const nonZeroAnxiety = anxietyPointsWithScores.filter(p => p.score > 0).slice(0, 5);
      
      console.log('[DEBUG] Sample tension points with non-zero scores (first 5):');
      nonZeroTension.forEach(p => {
        console.log(`  Date: ${p.date}, Score: ${p.score}, Scaled: {x: ${p.x.toFixed(2)}, y: ${p.y.toFixed(2)}}`);
      });
      
      console.log('[DEBUG] Sample warmth points with non-zero scores (first 5):');
      nonZeroWarmth.forEach(p => {
        console.log(`  Date: ${p.date}, Score: ${p.score}, Scaled: {x: ${p.x.toFixed(2)}, y: ${p.y.toFixed(2)}}`);
      });
      
      console.log('[DEBUG] Sample anxiety points with non-zero scores (first 5):');
      nonZeroAnxiety.forEach(p => {
        console.log(`  Date: ${p.date}, Score: ${p.score}, Scaled: {x: ${p.x.toFixed(2)}, y: ${p.y.toFixed(2)}}`);
      });
      
      // Debug: Test scaling function with known values
      console.log('[DEBUG] Scaling function test:');
      console.log(`  Score 0 -> y: ${scaleScore(0).toFixed(2)} (should be ${yBottom})`);
      console.log(`  Score 5 -> y: ${scaleScore(5).toFixed(2)} (should be ${(yTop + yBottom) / 2})`);
      console.log(`  Score 10 -> y: ${scaleScore(10).toFixed(2)} (should be ${yTop})`);
      
      // Debug: Check score distribution - find max scores for each sentiment
      if (tensionPointsWithScores.length > 0 && warmthPointsWithScores.length > 0 && anxietyPointsWithScores.length > 0) {
        const maxTension = Math.max(...tensionPointsWithScores.map(p => p.score));
        const maxWarmth = Math.max(...warmthPointsWithScores.map(p => p.score));
        const maxAnxiety = Math.max(...anxietyPointsWithScores.map(p => p.score));
        
        const anxietyAtMax = anxietyPointsWithScores.filter(p => p.score === 10).length;
        const warmthAtMax = warmthPointsWithScores.filter(p => p.score === 10).length;
        const tensionAtMax = tensionPointsWithScores.filter(p => p.score === 10).length;
        
        const avgTension = tensionPointsWithScores.reduce((sum, p) => sum + p.score, 0) / tensionPointsWithScores.length;
        const avgWarmth = warmthPointsWithScores.reduce((sum, p) => sum + p.score, 0) / warmthPointsWithScores.length;
        const avgAnxiety = anxietyPointsWithScores.reduce((sum, p) => sum + p.score, 0) / anxietyPointsWithScores.length;
        
        console.log('[DEBUG] Score analysis:');
        console.log('  Max scores - Tension:', maxTension, 'Warmth:', maxWarmth, 'Anxiety:', maxAnxiety);
        console.log('  Points at score 10 - Tension:', tensionAtMax, 'Warmth:', warmthAtMax, 'Anxiety:', anxietyAtMax);
        console.log('  Average scores - Tension:', avgTension.toFixed(2), 'Warmth:', avgWarmth.toFixed(2), 'Anxiety:', avgAnxiety.toFixed(2));
        
        // Check score distribution over time
        const earlyAnxiety = anxietyPointsWithScores.slice(0, 50);
        const midAnxiety = anxietyPointsWithScores.slice(Math.floor(anxietyPointsWithScores.length / 2) - 25, Math.floor(anxietyPointsWithScores.length / 2) + 25);
        const lateAnxiety = anxietyPointsWithScores.slice(-50);
        
        const avgEarlyAnxiety = earlyAnxiety.reduce((sum, p) => sum + p.score, 0) / earlyAnxiety.length;
        const avgMidAnxiety = midAnxiety.reduce((sum, p) => sum + p.score, 0) / midAnxiety.length;
        const avgLateAnxiety = lateAnxiety.reduce((sum, p) => sum + p.score, 0) / lateAnxiety.length;
        
        console.log('[DEBUG] Anxiety score over time:');
        console.log('  Early (first 50 points):', avgEarlyAnxiety.toFixed(2));
        console.log('  Middle (50 points around center):', avgMidAnxiety.toFixed(2));
        console.log('  Late (last 50 points):', avgLateAnxiety.toFixed(2));
      }
      
      // Debug: Log scaling info
      console.log('[DEBUG] Scaling parameters:');
      console.log('  Total days in range:', totalDays);
      console.log('  ViewBox dimensions:', { width: viewBoxWidth, height: viewBoxHeight });
      console.log('  Y-axis range:', { top: yTop, bottom: yBottom });
      console.log('  Score range:', { min: scoreMin, max: scoreMax });
      
      return {
        tension: tensionPoints,
        warmth: warmthPoints,
        anxiety: anxietyPoints,
        dateRange: { start: '1910', end: '1915' }
      };
    };
    
    const sentimentData = await generateSentimentData();
    console.log('[DEBUG] Sentiment data generated successfully:', {
      tensionCount: sentimentData.tension.length,
      warmthCount: sentimentData.warmth.length,
      anxietyCount: sentimentData.anxiety.length,
      dateRange: sentimentData.dateRange
    });

    // Generate topics frequency data from timeline_days collection
    const generateTopicsData = async () => {
      console.log('[DEBUG] Topics Data Generation - Starting...');
      const allDays = await getAllTimelineDays();
      console.log('[DEBUG] Topics Data Generation - Total days fetched:', allDays.length);
      
      // Map to track how many letters contain each topic (not occurrences)
      const topicLetterCount = new Map<string, number>();
      let totalDaysProcessed = 0;
      let daysWithLetters = 0;
      let totalLettersProcessed = 0;
      let lettersWithTopics = 0;
      let totalTopicsExtracted = 0;
      let emptyTopicsCount = 0;
      let duplicateTopicsInLetter = 0;
      
      // Extract topics from all letters in all timeline days
      // Count each topic once per letter (even if it appears multiple times in the same letter)
      for (const day of allDays) {
        totalDaysProcessed++;
        const letters = day.prime_minister?.letters || [];
        
        if (letters.length > 0) {
          daysWithLetters++;
        }
        
        for (const letter of letters) {
          totalLettersProcessed++;
          const topics = letter.topics || [];
          
          if (topics.length > 0) {
            lettersWithTopics++;
            totalTopicsExtracted += topics.length;
            
            // Track unique topics in this letter (to count each topic once per letter)
            const uniqueTopicsInLetter = new Set<string>();
            
            for (const topic of topics) {
              if (topic && topic.trim()) {
                const normalizedTopic = topic.trim();
                
                if (uniqueTopicsInLetter.has(normalizedTopic)) {
                  duplicateTopicsInLetter++;
                } else {
                  uniqueTopicsInLetter.add(normalizedTopic);
                  // Count this topic for this letter (increment letter count, not occurrence count)
                  topicLetterCount.set(
                    normalizedTopic,
                    (topicLetterCount.get(normalizedTopic) || 0) + 1
                  );
                }
              } else {
                emptyTopicsCount++;
              }
            }
          }
        }
      }
      
      console.log('[DEBUG] Topics Data Generation - Processing Summary:');
      console.log('  Total days processed:', totalDaysProcessed);
      console.log('  Days with letters:', daysWithLetters);
      console.log('  Total letters processed:', totalLettersProcessed);
      console.log('  Letters with topics:', lettersWithTopics);
      console.log('  Total topics extracted:', totalTopicsExtracted);
      console.log('  Empty/null topics skipped:', emptyTopicsCount);
      console.log('  Duplicate topics within same letter:', duplicateTopicsInLetter);
      console.log('  Unique topics found:', topicLetterCount.size);
      
      // Log sample of topic letter count map
      if (topicLetterCount.size > 0) {
        const sampleTopics = Array.from(topicLetterCount.entries()).slice(0, 10);
        console.log('[DEBUG] Topics Data Generation - Sample topics (first 10):');
        sampleTopics.forEach(([topic, count]) => {
          console.log(`    "${topic}": appears in ${count} letter(s)`);
        });
      } else {
        console.log('[DEBUG] Topics Data Generation - WARNING: No topics found in any letters!');
      }
      
      // Convert to array and sort by letter count (descending)
      const topicsArray = Array.from(topicLetterCount.entries())
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count);
      
      console.log('[DEBUG] Topics Data Generation - After sorting:');
      console.log('  Total unique topics:', topicsArray.length);
      if (topicsArray.length > 0) {
        console.log('  Top 10 topics by letter count:');
        topicsArray.slice(0, 10).forEach((item, idx) => {
          console.log(`    ${idx + 1}. "${item.topic}": appears in ${item.count} letter(s)`);
        });
      }
      
      // Calculate percentage based on letters with topics (not total occurrences)
      // This way percentages won't sum to 100% if letters have multiple topics
      console.log('[DEBUG] Topics Data Generation - Total letters with topics:', lettersWithTopics);
      
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
      // Percentage = (letters with this topic / total letters with topics) * 100
      // Note: Percentages may sum to more than 100% because letters can have multiple topics
      const topicsData: TopicData[] = topicsArray
        .slice(0, 10) // Top 10 topics
        .map((item, index) => {
          const percentage = lettersWithTopics > 0 
            ? Math.round((item.count / lettersWithTopics) * 100) 
            : 0;
          return {
            topic: item.topic,
            value: percentage,
            color: colors[index % colors.length],
          };
        });
      
      // Calculate sum of percentages for debugging
      const sumOfPercentages = topicsData.reduce((sum, item) => sum + item.value, 0);
      
      console.log('[DEBUG] Topics Data Generation - Final output:');
      console.log('  Topics to return:', topicsData.length);
      console.log('  Total letters with topics:', lettersWithTopics);
      console.log('  Sum of percentages (may be > 100% if letters have multiple topics):', sumOfPercentages + '%');
      topicsData.forEach((item, idx) => {
        console.log(`    ${idx + 1}. "${item.topic}": ${item.value}% (appears in ${topicsArray[idx].count} letter(s), color: ${item.color})`);
      });
      
      // Debug: Check for potential issues
      if (topicsData.length === 0) {
        console.log('[DEBUG] Topics Data Generation - WARNING: No topics data to return!');
        console.log('[DEBUG] Topics Data Generation - Debugging info:');
        console.log('  - Check if letters have topics field');
        console.log('  - Check if topics array is populated');
        console.log('  - Check if topics are non-empty strings');
      }
      
      // Debug: Sample a few days with letters to see structure
      if (daysWithLetters > 0) {
        const sampleDays = allDays.filter(day => (day.prime_minister?.letters || []).length > 0).slice(0, 3);
        console.log('[DEBUG] Topics Data Generation - Sample days with letters (first 3):');
        sampleDays.forEach((day, idx) => {
          const letters = day.prime_minister?.letters || [];
          console.log(`  Day ${idx + 1} (${day.date_string}):`);
          console.log(`    Letters: ${letters.length}`);
          letters.slice(0, 2).forEach((letter, letterIdx) => {
            const topics = letter.topics || [];
            console.log(`      Letter ${letterIdx + 1}: ${topics.length} topic(s)`, topics);
          });
        });
      }
      
      return topicsData;
    };
    
    const topicsData = await generateTopicsData();
    console.log('[DEBUG] Topics data generated successfully:', {
      count: topicsData.length,
      topics: topicsData.map(t => ({ topic: t.topic, value: t.value, color: t.color }))
    });

    // Generate weekly letter count data from timeline_days collection
    // Each data point represents a week with total letter count
    // x = week number, y = total number of letters for that week
    // Graph covers 1/1/1912 to end of 1915
    const generateDailyLetterData = async () => {
      const allDays = await getAllTimelineDays();
      
      // Fixed date range: 1/1/1912 to 12/31/1915
      const graphStartDateString = '1912-01-01';
      const graphEndDateString = '1915-12-31';
      
      // Filter days to only include dates within the graph range
      const filteredDays = allDays.filter(day => {
        return day.date_string >= graphStartDateString && day.date_string <= graphEndDateString;
      });
      
      if (filteredDays.length === 0) {
        return {
          data: [],
          peak: { date: '', count: 0 },
          dateRange: { start: '1912', end: '1915' },
          weeks: []
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
      
      // Group days by week and sum letter counts
      const weeklyData = new Map<number, { totalLetters: number; weekStartDate: string }>();
      
      let totalLettersFromDB = 0;
      let daysWithLetters = 0;
      
      // Process each day and aggregate by week
      for (const day of filteredDays) {
        const letterCount = day.prime_minister?.letters?.length || 0;
        totalLettersFromDB += letterCount;
        
        const weekNumber = getWeekNumber(day.date_string);
        
        if (letterCount > 0) {
          daysWithLetters++;
        }
        
        if (!weeklyData.has(weekNumber)) {
          weeklyData.set(weekNumber, { totalLetters: 0, weekStartDate: day.date_string });
        }
        
        const weekData = weeklyData.get(weekNumber)!;
        weekData.totalLetters += letterCount;
      }
      
      // Convert weekly data to array format - include ALL weeks (even with 0 letters)
      const data: Array<{ x: number; y: number }> = [];
      let maxCount = 0;
      let peakWeekNumber = 0;
      let minCount = Infinity;
      let weeksWithData = 0;
      let weeksWithZero = 0;
      
      // Iterate through all weeks from 0 to totalWeeks
      for (let weekNumber = 0; weekNumber <= totalWeeks; weekNumber++) {
        const weekData = weeklyData.get(weekNumber);
        const letterCount = weekData?.totalLetters || 0;
        
        data.push({ x: weekNumber, y: letterCount });
        
        if (letterCount > 0) {
          weeksWithData++;
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
      
      // Create weekly data array with dates for react-chrono
      const weeks: Array<{ weekStartDate: string; letterCount: number }> = [];
      for (let weekNumber = 0; weekNumber <= totalWeeks; weekNumber++) {
        const weekData = weeklyData.get(weekNumber);
        const letterCount = weekData?.totalLetters || 0;
        const weekStartDate = weekData?.weekStartDate || '';
        
        // Only include weeks with letters for the timeline
        if (letterCount > 0 && weekStartDate) {
          weeks.push({
            weekStartDate,
            letterCount
          });
        }
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
        },
        weeks
      };
      
      return result;
    };
    
    const dailyLetterCountData = await generateDailyLetterData();

    // Generate people data from timeline_days collection
    const generatePeopleData = async (): Promise<PeopleData[]> => {
      const allDays = await getAllTimelineDays();
      const peopleFrequency = new Map<string, number>();
      
      // Aggregate all people_mentioned arrays from all timeline days
      for (const day of allDays) {
        const peopleMentioned = day.people_mentioned || [];
        for (const person of peopleMentioned) {
          if (person && person.trim()) {
            const normalizedPerson = person.trim();
            peopleFrequency.set(
              normalizedPerson,
              (peopleFrequency.get(normalizedPerson) || 0) + 1
            );
          }
        }
      }
      
      // Convert to array and sort by frequency (descending)
      const peopleArray = Array.from(peopleFrequency.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 50); // Return top 50 for modal view
      
      return peopleArray;
    };
    
    const peopleData = await generatePeopleData();

    // Generate meeting dates data from timeline_days collection
    const generateMeetingDatesData = async (): Promise<MeetingDatesData> => {
      const allDays = await getAllTimelineDays();
      
      // Filter days where they met
      const meetingDays = allDays.filter(day => 
        day.prime_minister?.meeting_with_venetia === true
      );
      
      // Extract dates with meeting details and sort by date
      const meetingDates = meetingDays
        .map(day => ({
          date: day.date_string,
          meeting_details: day.prime_minister?.meeting_details || ''
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
      
      // Find date range
      const dateRange = meetingDates.length > 0
        ? {
            start: meetingDates[0].date.split('-')[0], // Year only
            end: meetingDates[meetingDates.length - 1].date.split('-')[0] // Year only
          }
        : { start: '', end: '' };
      
      // Generate timeline data points for visualization
      // Similar to other visualizations, use viewBox width of 200
      const viewBoxWidth = 200;
      const timeline: Array<{ x: number; date: string }> = [];
      
      if (meetingDates.length > 0) {
        // Calculate date range for scaling
        const firstDate = meetingDates[0].date;
        const lastDate = meetingDates[meetingDates.length - 1].date;
        
        const [startYear, startMonth, startDay] = firstDate.split('-').map(Number);
        const [endYear, endMonth, endDay] = lastDate.split('-').map(Number);
        
        const startDate = new Date(startYear, startMonth - 1, startDay);
        const endDate = new Date(endYear, endMonth - 1, endDay);
        const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Helper function to get days since start
        const getDaysSinceStart = (dateString: string): number => {
          const [year, month, day] = dateString.split('-').map(Number);
          const date = new Date(year, month - 1, day);
          const diffTime = date.getTime() - startDate.getTime();
          return Math.floor(diffTime / (1000 * 60 * 60 * 24));
        };
        
        // Scale each meeting date to x coordinate
        for (const meeting of meetingDates) {
          const daysSinceStart = getDaysSinceStart(meeting.date);
          const scaledX = totalDays > 0 ? (daysSinceStart / totalDays) * viewBoxWidth : 0;
          timeline.push({ x: scaledX, date: meeting.date });
        }
      }
      
      return {
        dates: meetingDates,
        total: meetingDates.length,
        dateRange,
        timeline
      };
    };
    
    const meetingDatesData = await generateMeetingDatesData();

    const generateAsquithVenetiaProximityData =
      async (): Promise<AsquithVenetiaProximityData> => {
        const points = await getAsquithVenetiaProximitySeries();
        const dateRange =
          points.length > 0
            ? {
                start: points[0].date.slice(0, 4),
                end: points[points.length - 1].date.slice(0, 4),
              }
            : { start: '', end: '' };
        const maxDistanceKm =
          points.length > 0 ? Math.max(...points.map((p) => p.distance_km)) : 0;

        return { points, dateRange, maxDistanceKm };
      };

    const asquithVenetiaProximityData = await generateAsquithVenetiaProximityData();

    const dataRoomData: DataRoomData = {
      sentiment: sentimentData,
      topics: topicsData,
      dailyLetterCount: dailyLetterCountData,
      people: peopleData,
      meetingDates: meetingDatesData,
      asquithVenetiaProximity: asquithVenetiaProximityData,
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
