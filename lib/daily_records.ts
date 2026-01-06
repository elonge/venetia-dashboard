import clientPromise from './mongodb';
import type { DayData } from '@/components/daily/types';
import type { DailyRecordDocument, LocationReasonAnswer } from '@/types';
import { LocationActivitiesAnswer, MeetingCheckerAnswer } from './schemas';
import { majorDailyEvents } from '@/major_daily_events';

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
    value = value.area || value.venue || value.full_string || "";
    return value ? cleanString(value) : undefined;
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
        : 'No';

  const topicsList = asStringArray(topics);
  const topicsText = topicsList?.length ? `Topics: ${topicsList.join(', ')}` : undefined;
  return joinNonEmpty([label, status, topicsText], ' — ');
}

export function mapDailyRecordToDayData(doc: DailyRecordDocument | unknown): DayData {
  const record: UnknownRecord = isRecord(doc) ? doc : {};
  const date = cleanString(record.date_string) ?? cleanString(record.date) ?? '';

  const pmActivitiesRaw = record.pm_activities;
  const pmActivities = Array.isArray(pmActivitiesRaw)
    ? joinNonEmpty(pmActivitiesRaw.map((v) => cleanString(v)), '. ')
    : cleanString(pmActivitiesRaw);

  const venetiaActivitiesRaw = record.venetia_activities;
  const venetiaActivities = Array.isArray(venetiaActivitiesRaw)
    ? joinNonEmpty(venetiaActivitiesRaw.map((v) => cleanString(v)), '. ')
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
  const totalNumberLetters = asNumber(record.total_number_letters);
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

  const venetiaLocationReasonsRecord = isRecord(record.venetia_location_reason) ? record.venetia_location_reason : undefined;
  const pmLocationReasonsRecord = isRecord(record.pm_location_reason) ? record.pm_location_reason : undefined;
  const meetingReasonRecord = isRecord(record.meeting_reason) ? record.meeting_reason : undefined;
  const event = majorDailyEvents.find(e => e.date === date);

  return {
    date,
    letters,
    pm_activities: pmActivities,
    pm_location: getLocationString(record.pm_location),
    venetia_activities: venetiaActivities,
    venetia_location: getLocationString(record.venetia_location),
    meeting_details: cleanString(record.meeting_details),
    asquith_venetia_proximity: isRecord(record.asquith_venetia_proximity) ? record.asquith_venetia_proximity as any : undefined,
    venetia_location_reason: venetiaLocationReasonsRecord as LocationReasonAnswer | string | undefined,
    pm_location_reason: pmLocationReasonsRecord as LocationReasonAnswer | string | undefined,
    politics,
    diaries_summary: diariesSummary?.length ? diariesSummary : undefined,
    weather,
    met_venetia: record.met_venetia === true,
    meeting_reason: meetingReasonRecord as LocationReasonAnswer | null | undefined,
    total_number_letters: totalNumberLetters ? totalNumberLetters : letters?.length || 0,
    major_event: event 
      ? (Array.isArray(event.news) ? event.news.join(". ") : event.news as string) 
      : undefined,
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
        projection: DAILY_RECORD_PROJECTION,
      }
    )
    .sort({ date_string: 1 })
    .toArray();

  return docs.map(mapDailyRecordToDayData);
}

type ProximityCoords = { lat: number; lng: number };
type ProximityPoint = {
  date: string;
  distance_km: number;
  status?: string;
  calculated_from?: { pm?: string; venetia?: string };
  geo_coords: { pm: ProximityCoords; venetia: ProximityCoords };
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function asProximityCoords(value: unknown): ProximityCoords | null {
  if (!isRecord(value)) return null;
  const lat = asNumber(value.lat);
  const lng = asNumber(value.lng);
  if (!isFiniteNumber(lat) || !isFiniteNumber(lng)) return null;
  return { lat, lng };
}

export async function getAsquithVenetiaProximitySeries(): Promise<ProximityPoint[]> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const col = db.collection<DailyRecordDocument>(COLLECTION_NAME);

  const docs = await col
    .find(
      { asquith_venetia_proximity: { $exists: true } },
      {
        projection: {
          _id: 0,
          date_string: 1,
          asquith_venetia_proximity: 1,
        },
      }
    )
    .sort({ date_string: 1 })
    .toArray();

  const points: ProximityPoint[] = [];
  for (const doc of docs) {
    const date = cleanString(doc.date_string);
    if (!date) continue;

    const prox = isRecord(doc.asquith_venetia_proximity)
      ? (doc.asquith_venetia_proximity as UnknownRecord)
      : null;
    if (!prox) continue;

    const distance_km = asNumber(prox.distance_km);
    if (!isFiniteNumber(distance_km)) continue;

    const geo = isRecord(prox.geo_coords) ? (prox.geo_coords as UnknownRecord) : null;
    if (!geo) continue;

    const pmCoords = asProximityCoords(geo.pm);
    const venetiaCoords = asProximityCoords(geo.venetia);
    if (!pmCoords || !venetiaCoords) continue;

    const calculatedFrom = isRecord(prox.calculated_from)
      ? (prox.calculated_from as UnknownRecord)
      : null;

    points.push({
      date,
      distance_km,
      status: cleanString(prox.status),
      calculated_from: calculatedFrom
        ? {
            pm: cleanString(calculatedFrom.pm),
            venetia: cleanString(calculatedFrom.venetia),
          }
        : undefined,
      geo_coords: { pm: pmCoords, venetia: venetiaCoords },
    });
  }

  return points;
}

export async function getDailyRecordByDate(dateString: string): Promise<DayData | null> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const col = db.collection<DailyRecordDocument>(COLLECTION_NAME);

  const doc = await col.findOne(
    { date_string: dateString },
    {
      projection: DAILY_RECORD_PROJECTION,
    }
  );

  console.log("Fetched Daily Record Doc for date", dateString, ":");
  if (!doc) return null;
  return mapDailyRecordToDayData(doc);
}

export async function updateDailyRecordLocationReason(
  dateString: string, 
  person: 'pm' | 'venetia', 
  reason: LocationReasonAnswer
): Promise<void> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const col = db.collection<DailyRecordDocument>(COLLECTION_NAME);

  const updateField = person === 'pm' ? 'pm_location_reason' : 'venetia_location_reason';
  
  await col.updateOne(
    { date_string: dateString },
    { $set: { [updateField]: reason } }
  );
}

export async function updateDailyRecordLocationActivity(
  dateString: string, 
  person: 'pm' | 'venetia', 
  data: LocationActivitiesAnswer
): Promise<void> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const col = db.collection<DailyRecordDocument>(COLLECTION_NAME);

  const updateFields: Record<string, unknown> = {};
  if (person === 'pm') {
    updateFields['pm_location'] = data.location;
    if (data.activities) {
      updateFields['pm_activities'] = data.activities;
    }
    if (data.reason) {
      updateFields['pm_location_reason'] = data.reason;
    }
  } else {
    updateFields['venetia_location'] = data.location;
    if (data.activities) {
      updateFields['venetia_activities'] = data.activities;
    }
    if (data.reason) {
      updateFields['venetia_location_reason'] = data.reason;
    }
  }
  
  await col.updateOne(
    { date_string: dateString },
    { $set: updateFields }
  );
}

export async function updateDailyRecordWithMetVenetia(
  dateString: string, 
  data: MeetingCheckerAnswer
): Promise<void> {  
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const col = db.collection<DailyRecordDocument>(COLLECTION_NAME);

  const updateFields: Record<string, unknown> = {};
  updateFields['met_venetia'] = data.met;
  updateFields['meeting_reason'] = data.reason;
  
  await col.updateOne(
    { date_string: dateString },
    { $set: updateFields }
  );
}
const DAILY_RECORD_PROJECTION = {
  _id: 0,
  date: 1,
  date_string: 1,
  pm_activities: 1,
  venetia_activities: 1,
  pm_location: 1,
  venetia_location: 1,
  meeting_details: 1,
  letters: 1,
  politics: 1,
  diaries: 1,
  weather: 1,
  weather_short: 1,
  met_venetia: 1,
  meeting_reason: 1,
  total_number_letters: 1,
  asquith_venetia_proximity: 1,
  venetia_location_reason: 1,
  pm_location_reason: 1,
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
