/**
 * Type definitions for Gurbani Now API responses
 * API Base: https://api.gurbaninow.com/v2
 */

export interface ApiSource {
  id: string;
  unicode: string;
  english: string;
  length?: number;
  pageName?: {
    unicode: string;
    english: string;
  };
}

export interface ApiWriter {
  id: number;
  english: string;
  unicode: string;
  punjabi?: {
    akhar: string;
    unicode: string;
  };
}

export interface ApiRaag {
  id: number;
  english: string;
  unicode: string;
  punjabi?: {
    akhar: string;
    unicode: string;
  };
  startang?: number;
  endang?: number;
}

export interface ApiGurmukhi {
  akhar: string;
  unicode: string;
}

export interface ApiLarivaar {
  akhar: string;
  unicode: string;
}

export interface ApiTranslation {
  english?: {
    default: string;
  };
  punjabi?: {
    default: {
      akhar: string;
      unicode: string;
    };
  };
  spanish?: string;
}

export interface ApiTransliteration {
  english?: {
    text: string;
    larivaar: string;
  };
  devanagari?: {
    text: string;
    larivaar: string;
  };
}

export interface ApiFirstLetters {
  akhar: string;
  unicode: string;
}

export interface ApiLine {
  id: string;
  type: number;
  shabadid: string;
  gurmukhi: ApiGurmukhi;
  larivaar: ApiLarivaar;
  translation: ApiTranslation;
  transliteration: ApiTransliteration;
  writer: ApiWriter;
  raag: ApiRaag;
  pageno: number;
  lineno: number;
  firstletters: ApiFirstLetters;
}

export interface ApiPageLine {
  line: ApiLine;
}

export interface ApiAngResponse {
  pageno: number;
  source: ApiSource;
  count: number;
  page: ApiPageLine[];
  error: boolean;
}

export interface ApiGregorianDate {
  month: string;
  monthno: number;
  date: number;
  year: number;
  day: string;
}

export interface ApiNanakshahiDate {
  english: {
    month: string;
    monthno: number;
    date: number;
    year: number;
    day: string;
  };
  punjabi: {
    month: {
      akhar: string;
      unicode: string;
    };
    monthno: number;
    date: number;
    year: number;
    day: {
      akhar: string;
      unicode: string;
    };
  };
}

export interface ApiDate {
  gregorian: ApiGregorianDate;
  nanakshahi: ApiNanakshahiDate;
}

export interface ApiHukamnamaInfo {
  shabadid: string[];
  pageno: number;
  source: ApiSource;
  writer: ApiWriter;
  raag: ApiRaag;
  count: number;
}

export interface ApiHukamnamaLine {
  line: ApiLine;
}

export interface ApiHukamnamaResponse {
  date: ApiDate;
  hukamnamainfo: ApiHukamnamaInfo;
  hukamnama: ApiHukamnamaLine[];
  error: boolean;
}

export interface ApiError {
  error: true;
  message?: string;
}

export type ApiResponse<T> = T | ApiError;

/**
 * Search API Types
 */
export interface SearchFilters {
  searchType?: number; // 0-7: Different search algorithms
  source?: string; // G, D, B, N, A, U
  writer?: number; // Writer ID (1-49)
  raag?: number; // Raag ID (1-35)
  ang?: number; // Specific Ang number
  results?: number; // Number of results (max 100)
  skip?: number; // Pagination offset
}

export interface ApiSearchResult {
  line: ApiLine;
}

export interface ApiSearchResponse {
  count: number;
  results: ApiSearchResult[];
  error: boolean;
}
