// types/index.ts
import { ObjectId } from "mongodb";

export interface Scores {
  romantic_adoration?: number;
  political_unburdening?: number;
  emotional_desolation?: number;
}

export interface Letter {
  summary: string;
  topics: string[];
  count?: number;
  source_ref?: string;
}

export interface EdwinLetter {
  summary: string;
  topics: string[];
  mood?: string;
  pm_mentioned?: boolean;
  feelings_about_pm?: string;
  pm_feelings_observed?: string;
  source?: string;
}

export interface Metrics {
  emotional_score?: number;
  sharing_score?: number;
}

export interface PrimeMinister {
  location?: string;
  meeting_with_venetia?: boolean;
  meeting_details?: string;
  letters_count?: number;
  letters: Letter[];
  metrics?: Metrics;
}

export interface Venetia {
  location?: string;
  activities?: string;
  letters_to_edwin?: EdwinLetter[];
  inferred_letter_to_pm?: boolean;
}

export interface Context {
  public_hansard?: string;
  secret_churchill?: string;
}

export interface DiaryEntry {
  author: string;
  is_diary_entry: boolean;
  location?: string;
  entry: string;
  pm_mood_observation?: string;
  venetia_mention?: string;
  source?: string;
}

export interface TimelineDayDocument {
  _id: string; // Serialized from ObjectId
  date: string; // Serialized from Date
  date_string: string;
  prime_minister: PrimeMinister;
  venetia: Venetia;
  context: Context;
  diaries?: DiaryEntry[];
  excerpt?: string;
  people_mentioned?: string[];
  scores: Scores;
}

export interface DailyRecordLocation {
  full_string?: string | null;
  venue?: string | null;
  area?: string | null;
  context?: string | null;
}

export interface DailyRecordLetterPerson {
  name?: string | null;
  note_or_realname?: string | null;
}

export interface DailyRecordLetter {
  letter_summary?: string | null;
  letter_excerpt?: string | null;
  topics_mentioned?: string[] | null;
  scores?: Scores | null;
  letter_id?: {
    sequence_id?: number | null;
    type?: string | null;
  } | null;
  time_data?: {
    part_of_day?: string | null;
    exact_time?: string | null;
    context?: string | null;
  } | null;
  people_mentioned?: DailyRecordLetterPerson[] | null;
}

export interface DailyRecordPolitics {
  parliament?: {
    session?: boolean | null;
    topics_discussed?: string[] | null;
  } | null;
  cabinet?: {
    meeting?: boolean | null;
    topics_discussed?: string[] | null;
  } | null;
}

export interface DailyRecordDiary {
  writer?: string | null;
  recipient?: string | null;
  summary?: string | null;
  excerpt?: string | null;
}

export interface DailyRecordWeatherShort {
  oxford?: string | null;
  london?: string | null;
}

export interface DailyRecordDocument {
  _id?: ObjectId;
  date?: string | Date | null;
  date_string?: string | null;
  pm_activities?: string[] | null;
  venetia_activities?: string[] | null;
  pm_location?: DailyRecordLocation | null;
  venetia_location?: DailyRecordLocation | null;
  meeting_reference?: string | null;
  asquith_venetia_proximity?: {
    distance_km?: number | null;
    status?: string | null;
    calculated_from?: {
      pm?: string | null;
      venetia?: string | null;
    } | null;
    geo_coords?: {
      pm?: { lat?: number | null; lng?: number | null } | null;
      venetia?: { lat?: number | null; lng?: number | null } | null;
    } | null;
  } | null;
  letters?: DailyRecordLetter[] | null;
  politics?: DailyRecordPolitics | null;
  diaries?: DailyRecordDiary[] | null;
  weather_short?: DailyRecordWeatherShort | null;
  weather?: string | null;
}
