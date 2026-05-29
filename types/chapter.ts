export interface Location {
  name: string;
  lat: number;
  long: number;
}

export interface ChapterPerspectives {
  [key: string]: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
}

export interface Chapter {
  _id: string;
  chapter_id: string;
  slug: string;
  chapter_title: string;
  date_range?: string;
  thematic_subtitle?: string;
  main_story: string;
  perspectives: ChapterPerspectives;
  fun_fact: string;
  locations: Location[];
  timeline?: TimelineEvent[];
  sources: string[];
  letters?: {
    date: string;
    context: string;
    image_url: string;  
  }[];
}
