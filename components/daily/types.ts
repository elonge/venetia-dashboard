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
  politics?: {
    parliament?: string;
    cabinet?: string;
  };
  pm_mood_witness?: string;
  diaries_summary?: Array<{
    writer: string;
    excerpt: string;
  }>;
  weather?: string;
  met_venetia?: boolean;
}

