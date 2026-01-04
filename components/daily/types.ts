import { LocationReasonAnswer, AsquithVenetiaProximity as BaseProximity } from '@/types';

export interface DailyLetter {
  summary: string;
  excerpt?: string;
  topics?: string[];
  letter_number?: number;
  time_of_day?: string;
  people_mentioned?: string[];
  scores?: {
    romantic_adoration?: number;
    political_unburdening?: number;
    emotional_desolation?: number;
  };
}

export interface DiarySummary {
  writer: string;
  excerpt: string;
  summary?: string;
}

export interface DayData {
  date: string;
  letters?: DailyLetter[];
  pm_activities?: string;
  pm_location?: string;
  venetia_activities?: string;
  venetia_location?: string;
  meeting_details?: string;
  asquith_venetia_proximity?: BaseProximity | any;
  venetia_location_reason?: LocationReasonAnswer | string;
  pm_location_reason?: LocationReasonAnswer | string;
  politics?: {
    parliament?: string;
    cabinet?: string;
  };
  diaries_summary?: DiarySummary[];
  weather?: string;
  met_venetia?: boolean;
  meeting_reason?: LocationReasonAnswer | null;
  total_number_letters?: number;
  
  // Optional fields used in UI
  pm_mood_witness?: string;
  major_event?: string;
}

export type AsquithVenetiaProximity = BaseProximity;
