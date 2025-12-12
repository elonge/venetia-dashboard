// types/index.ts
import { ObjectId } from "mongodb";

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
}