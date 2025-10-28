
export enum SearchState {
  IDLE = 'IDLE',
  SEARCHING_PAGES = 'SEARCHING_PAGES',
  ANALYZING_POSTS = 'ANALYZING_POSTS',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export interface EventInfo {
  title: string;
  dtstart: string; // ISO 8601 format: YYYY-MM-DDTHH:mm:ss
  location: string;
  description: string;
}

export interface InstagramPage {
  handle: string;
  url: string;
  description: string;
  confidence: number;
  status: 'pending' | 'analyzing' | 'done' | 'error';
  event?: EventInfo | null;
}
