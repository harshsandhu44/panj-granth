/**
 * Type definitions for Panj Granth app
 */

/**
 * Represents a single page (Ang) of Guru Granth Sahib
 */
export interface Ang {
  id: number; // Ang number (1-1430)
  gurmukhi: string; // Original Gurmukhi text
  transliteration?: string; // Roman transliteration
  translation?: string; // English translation
  raag?: Raag; // Musical measure
  author?: Author; // Composer
}

/**
 * Represents a single Shabad (hymn)
 */
export interface Shabad {
  id: string;
  angNumber: number;
  gurmukhi: string;
  transliteration?: string;
  translation?: string;
  raag: Raag;
  author: Author;
  lineCount: number;
}

/**
 * Daily Hukamnama (divine command)
 */
export interface Hukamnama {
  date: string; // ISO date string
  angNumber: number;
  gurmukhi: string;
  transliteration?: string;
  translation?: string;
  raag: Raag;
  author: Author;
}

/**
 * Reading history entry
 */
export interface ReadingHistoryItem {
  id: string;
  angNumber: number;
  timestamp: number; // Unix timestamp
  title: string; // Display title (e.g., "Ang 123 - Raag Asa")
  preview?: string; // Short preview text
}

/**
 * Bookmark entry
 */
export interface Bookmark {
  id: string;
  angNumber: number;
  title: string;
  note?: string;
  createdAt: number;
}

/**
 * Musical measures (Raags) in Guru Granth Sahib
 */
export enum Raag {
  SRI = "Sri",
  MAJH = "Majh",
  GAURI = "Gauri",
  ASA = "Asa",
  GUJRI = "Gujri",
  DEVGANDHARI = "Devgandhari",
  BIHAGRA = "Bihagra",
  WADAHANS = "Wadahans",
  SORATH = "Sorath",
  DHANASARI = "Dhanasari",
  JAITSRI = "Jaitsri",
  TODI = "Todi",
  BAIRARI = "Bairari",
  TILANG = "Tilang",
  SUHI = "Suhi",
  BILAWAL = "Bilawal",
  GOND = "Gond",
  RAMKALI = "Ramkali",
  NATNARAIN = "Nat Narain",
  MALIHGAURA = "Mali Gaura",
  MARU = "Maru",
  TUKHARI = "Tukhari",
  KEDARA = "Kedara",
  BHAIRAV = "Bhairav",
  BASANT = "Basant",
  SARANG = "Sarang",
  MALAR = "Malar",
  KANRA = "Kanra",
  KALYAN = "Kalyan",
  PRABHATI = "Prabhati",
  JAIJAVANTI = "Jaijavanti",
}

/**
 * Authors/Composers in Guru Granth Sahib
 */
export enum Author {
  GURU_NANAK = "Guru Nanak Dev Ji",
  GURU_ANGAD = "Guru Angad Dev Ji",
  GURU_AMAR_DAS = "Guru Amar Das Ji",
  GURU_RAM_DAS = "Guru Ram Das Ji",
  GURU_ARJAN = "Guru Arjan Dev Ji",
  GURU_TEGH_BAHADUR = "Guru Tegh Bahadur Ji",
  BHAGAT_KABIR = "Bhagat Kabir Ji",
  BHAGAT_NAMDEV = "Bhagat Namdev Ji",
  BHAGAT_RAVIDAS = "Bhagat Ravidas Ji",
  BHAGAT_FARID = "Bhagat Farid Ji",
  // Add more as needed
}

/**
 * Main sections of Guru Granth Sahib
 */
export enum Section {
  JAPJI_SAHIB = "Japji Sahib",
  SODAR_REHRAS = "Sodar Rehras",
  KIRTAN_SOHILA = "Kirtan Sohila",
  ANAND_SAHIB = "Anand Sahib",
  // Add more as needed
}

/**
 * Search-related types
 */
export interface SearchLine {
  id: string;
  angNumber: number;
  lineNumber: number;
  shabadId: string;
  gurmukhi: string;
  translation?: {
    english?: string;
    punjabi?: string;
  };
  transliteration?: {
    english?: string;
    devanagari?: string;
  };
  writer?: string;
  raag?: string;
}

export interface SearchResultWithContext {
  matchedLine: SearchLine;
  contextBefore: SearchLine[]; // Lines before the match
  contextAfter: SearchLine[]; // Lines after the match
}

export interface SearchState {
  query: string;
  results: SearchResultWithContext[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean; // For pagination
  skip: number; // Current pagination offset
}
