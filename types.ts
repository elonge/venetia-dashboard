// types/index.ts
import { ObjectId } from "mongodb";
export { ProbabilityEnum, LocationReasonAnswerSchema } from './lib/schemas';
export type { LocationReasonAnswer } from './lib/schemas';
import type { LocationReasonAnswer } from './lib/schemas';

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

export interface Context {
  public_hansard?: string;
  secret_churchill?: string;
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

export interface AsquithVenetiaProximity {
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
}

export interface DailyRecordDocument {
  _id?: ObjectId;
  date: string | Date ;
  date_string: string;
  pm_activities?: string[] | null;
  venetia_activities?: string[] | null;
  pm_location?: DailyRecordLocation | null;
  venetia_location?: DailyRecordLocation | null;
  met_venetia?: boolean | null;
  meeting_reference?: string | null;
  meeting_details?: string | null;
  asquith_venetia_proximity?: AsquithVenetiaProximity | null;
  venetia_location_reason?: LocationReasonAnswer | null;
  pm_location_reason?: LocationReasonAnswer | null;
  letters?: DailyRecordLetter[] | null;
  politics?: DailyRecordPolitics | null;
  diaries?: DailyRecordDiary[] | null;
  weather_short?: DailyRecordWeatherShort | null;
  weather?: string | null;
  total_number_letters?: number | null;
}
