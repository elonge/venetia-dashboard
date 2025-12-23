import clientPromise from './mongodb';
import type { DayData } from '@/components/daily/types';
import type { DailyRecordDocument } from '@/types';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'daily_records';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (isRecord(value) && typeof value.$numberInt === 'string') {
    const n = Number.parseInt(value.$numberInt, 10);
    return Number.isFinite(n) ? n : undefined;
  }
  if (isRecord(value) && typeof value.$numberDouble === 'string') {
    const n = Number.parseFloat(value.$numberDouble);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function cleanString(value: unknown): string | undefined {
  if (value instanceof Date) {
    const iso = value.toISOString();
    return iso.slice(0, 10);
  }
  if (isRecord(value)) {
    if (typeof value.$date === 'string') return value.$date.slice(0, 10);
    if (isRecord(value.$date) && typeof value.$date.$numberLong === 'string') {
      const ms = Number(value.$date.$numberLong);
      if (Number.isFinite(ms)) return new Date(ms).toISOString().slice(0, 10);
    }
  }
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function joinNonEmpty(values: Array<string | undefined>, delimiter: string): string | undefined {
  const cleaned = values.map(cleanString).filter(Boolean) as string[];
  if (cleaned.length === 0) return undefined;
  return cleaned.join(delimiter);
}

function getLocationString(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return cleanString(value);
  if (isRecord(value)) {
    return (
      cleanString(value.full_string) ??
      joinNonEmpty(
        [
          cleanString(value.venue),
          cleanString(value.area),
          cleanString(value.context),
        ],
        ', '
      ) ??
      undefined
    );
  }
  return undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const out = value
    .map((v) => (typeof v === 'string' ? v.trim() : ''))
    .filter(Boolean);
  return out.length ? out : undefined;
}

function buildPoliticsLine(
  label: string,
  flags: { session?: unknown; meeting?: unknown },
  topics: unknown
): string | undefined {
  const status =
    flags.session === true || flags.meeting === true
      ? 'Yes'
      : flags.session === false || flags.meeting === false
        ? 'No'
        : undefined;

  const topicsList = asStringArray(topics);
  const topicsText = topicsList?.length ? `Topics: ${topicsList.join(', ')}` : undefined;
  return joinNonEmpty([label, status, topicsText], ' — ');
}

export function mapDailyRecordToDayData(doc: DailyRecordDocument | unknown): DayData {
  const record: UnknownRecord = isRecord(doc) ? doc : {};
  const date = cleanString(record.date_string) ?? cleanString(record.date) ?? '';

  const pmActivitiesRaw = record.pm_activities;
  const pmActivities = Array.isArray(pmActivitiesRaw)
    ? joinNonEmpty(pmActivitiesRaw.map((v) => cleanString(v)), ' ')
    : cleanString(pmActivitiesRaw);

  const venetiaActivitiesRaw = record.venetia_activities;
  const venetiaActivities = Array.isArray(venetiaActivitiesRaw)
    ? joinNonEmpty(venetiaActivitiesRaw.map((v) => cleanString(v)), ' ')
    : cleanString(venetiaActivitiesRaw);

  const lettersRaw = record.letters;
  const letters = Array.isArray(lettersRaw)
    ? lettersRaw.map((l) => {
        const letterRecord: UnknownRecord = isRecord(l) ? l : {};
        const peopleMentionedRaw = letterRecord.people_mentioned;
        const peopleMentioned = Array.isArray(peopleMentionedRaw)
          ? (peopleMentionedRaw
              .map((p) => {
                if (typeof p === 'string') return cleanString(p);
                if (!isRecord(p)) return undefined;
                return cleanString(p.name);
              })
              .filter(Boolean) as string[])
          : undefined;

        const letterId = isRecord(letterRecord.letter_id) ? letterRecord.letter_id : undefined;
        const letterNumber = asNumber(letterId?.sequence_id) ?? asNumber(letterRecord.letter_number);

        const timeData = isRecord(letterRecord.time_data) ? letterRecord.time_data : undefined;

        const scoresRecord = isRecord(letterRecord.scores) ? letterRecord.scores : undefined;
        const scores = scoresRecord
          ? {
              romantic_adoration: asNumber(scoresRecord.romantic_adoration),
              political_unburdening: asNumber(scoresRecord.political_unburdening),
              emotional_desolation: asNumber(scoresRecord.emotional_desolation),
            }
          : undefined;

        return {
          summary: cleanString(letterRecord.letter_summary) ?? cleanString(letterRecord.summary) ?? 'Letter',
          excerpt: cleanString(letterRecord.letter_excerpt) ?? cleanString(letterRecord.excerpt),
          topics: asStringArray(letterRecord.topics_mentioned) ?? asStringArray(letterRecord.topics),
          letter_number: letterNumber,
          time_of_day: cleanString(timeData?.part_of_day) ?? cleanString(letterRecord.time_of_day),
          people_mentioned: peopleMentioned?.length ? peopleMentioned : undefined,
          scores,
        };
      })
    : undefined;

  const diariesRaw = record.diaries;
  const diariesSummary = Array.isArray(diariesRaw)
    ? (diariesRaw
        .map((d) => {
          if (!isRecord(d)) return null;
          const writer = cleanString(d.writer) ?? cleanString(d.author);
          const excerpt = cleanString(d.excerpt) ?? cleanString(d.entry) ?? cleanString(d.summary);
          if (!writer || !excerpt) return null;
          return { writer, excerpt };
        })
        .filter(Boolean) as Array<{ writer: string; excerpt: string }>)
    : undefined;

  const politicsRecord = isRecord(record.politics) ? record.politics : undefined;
  const parliament = isRecord(politicsRecord?.parliament) ? politicsRecord.parliament : undefined;
  const cabinet = isRecord(politicsRecord?.cabinet) ? politicsRecord.cabinet : undefined;
  const politics = politicsRecord
    ? {
        parliament: buildPoliticsLine('Parliament', { session: parliament?.session }, parliament?.topics_discussed),
        cabinet: buildPoliticsLine('Cabinet', { meeting: cabinet?.meeting }, cabinet?.topics_discussed),
      }
    : undefined;

  const weather =
    cleanString(record.weather) ??
    (isRecord(record.weather_short) ? cleanString(record.weather_short.london) : undefined) ??
    (isRecord(record.weather_short) ? cleanString(record.weather_short.oxford) : undefined) ??
    undefined;

  return {
    date,
    letters,
    pm_activities: pmActivities,
    pm_location: getLocationString(record.pm_location),
    venetia_activities: venetiaActivities,
    venetia_location: getLocationString(record.venetia_location),
    meeting_reference: cleanString(record.meeting_reference),
    politics,
    diaries_summary: diariesSummary?.length ? diariesSummary : undefined,
    weather,
    met_venetia: record.met_venetia === true,
  };
}

export async function getAllDailyRecords(): Promise<DayData[]> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const col = db.collection<DailyRecordDocument>(COLLECTION_NAME);

  const docs = await col
    .find(
      {},
      {
        projection: {
          _id: 0,
          date: 1,
          date_string: 1,
          pm_activities: 1,
          venetia_activities: 1,
          pm_location: 1,
          venetia_location: 1,
          meeting_reference: 1,
          letters: 1,
          politics: 1,
          diaries: 1,
          weather: 1,
          weather_short: 1,
          met_venetia: 1,
        },
      }
    )
    .sort({ date_string: 1 })
    .toArray();

  return docs.map(mapDailyRecordToDayData);
}

export async function getDailyRecordByDate(dateString: string): Promise<DayData | null> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const col = db.collection<DailyRecordDocument>(COLLECTION_NAME);

  const doc = await col.findOne(
    { date_string: dateString },
    {
      projection: {
        _id: 0,
        date: 1,
        date_string: 1,
        pm_activities: 1,
        venetia_activities: 1,
        pm_location: 1,
        venetia_location: 1,
        meeting_reference: 1,
        letters: 1,
        politics: 1,
        diaries: 1,
        weather: 1,
        weather_short: 1,
        met_venetia: 1,
      },
    }
  );

  if (!doc) return null;
  return mapDailyRecordToDayData(doc);
}

const DAILY_RECORD_PROJECTION = {
  _id: 0,
  date: 1,
  date_string: 1,
  pm_activities: 1,
  venetia_activities: 1,
  pm_location: 1,
  venetia_location: 1,
  meeting_reference: 1,
  letters: 1,
  politics: 1,
  diaries: 1,
  weather: 1,
  weather_short: 1,
  met_venetia: 1,
} as const;

export async function getNextDailyRecordByDate(dateString: string): Promise<DayData | null> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const col = db.collection<DailyRecordDocument>(COLLECTION_NAME);

  const doc = await col.findOne(
    { date_string: { $gt: dateString } },
    { sort: { date_string: 1 }, projection: DAILY_RECORD_PROJECTION }
  );

  if (!doc) return null;
  return mapDailyRecordToDayData(doc);
}

export async function getPreviousDailyRecordByDate(dateString: string): Promise<DayData | null> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const col = db.collection<DailyRecordDocument>(COLLECTION_NAME);

  const doc = await col.findOne(
    { date_string: { $lt: dateString } },
    { sort: { date_string: -1 }, projection: DAILY_RECORD_PROJECTION }
  );

  if (!doc) return null;
  return mapDailyRecordToDayData(doc);
}
