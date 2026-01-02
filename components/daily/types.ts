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

export interface DayData {
  date: string; // Format: "1913-01-15" or datetime(1913, 1, 15) string
  letters?: Array<{
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
  }>;
  pm_activities?: string;
  pm_location?: string;
  venetia_activities?: string;
  venetia_location?: string;
  meeting_reference?: string;
  meeting_details?: string;
  asquith_venetia_proximity?: AsquithVenetiaProximity | null;
  politics?: {
    parliament?: string;
    cabinet?: string;
  };
  pm_mood_witness?: string;
  diaries_summary?: Array<{
    writer: string;
    excerpt: string;
    summary?: string;
  }>;
  weather?: string;
  major_event?: string;
  met_venetia?: boolean;
  total_number_letters?: number;
}

