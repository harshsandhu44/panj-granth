/**
 * Reference data for Writers and Raags
 * Source: Gurbani Now API
 */

export interface WriterOption {
  id: number;
  label: string;
}

export interface RaagOption {
  id: number;
  label: string;
}

export interface SearchTypeOption {
  value: number;
  label: string;
  description: string;
}

/**
 * Writers in Guru Granth Sahib (Partial list - most common)
 */
export const WRITERS: WriterOption[] = [
  { id: 1, label: "Guru Nanak Dev Ji" },
  { id: 2, label: "Guru Angad Dev Ji" },
  { id: 3, label: "Guru Amar Daas Ji" },
  { id: 4, label: "Guru Raam Daas Ji" },
  { id: 5, label: "Guru Arjan Dev Ji" },
  { id: 6, label: "Guru Tegh Bahaadur Ji" },
  { id: 12, label: "Bhagat Kabeer Ji" },
  { id: 13, label: "Bhagat Naam Dev Ji" },
  { id: 16, label: "Bhagat Ravi Daas Ji" },
  { id: 21, label: "Bhagat Sheikh Fareed Ji" },
  { id: 14, label: "Bhagat Trilochan Ji" },
  { id: 15, label: "Bhagat Baynee Ji" },
  { id: 17, label: "Bhagat Dhanna Ji" },
  { id: 18, label: "Bhagat Peepa Ji" },
  { id: 19, label: "Bhagat Sain Ji" },
  { id: 20, label: "Bhagat Bheekan Ji" },
  { id: 22, label: "Bhagat Jaidev Ji" },
  { id: 23, label: "Bhagat Parmanand Ji" },
  { id: 24, label: "Bhagat Sadhna Ji" },
  { id: 25, label: "Bhagat Surdas Ji" },
];

/**
 * Raags (Musical measures) in Guru Granth Sahib
 */
export const RAAGS: RaagOption[] = [
  { id: 1, label: "Jap" },
  { id: 5, label: "Siree Raag" },
  { id: 6, label: "Raag Maajh" },
  { id: 7, label: "Raag Gauree" },
  { id: 8, label: "Raag Aasaa" },
  { id: 9, label: "Raag Goojaree" },
  { id: 10, label: "Raag Dayv Gandhaaree" },
  { id: 11, label: "Raag Bihaagaraa" },
  { id: 12, label: "Raag Vadhans" },
  { id: 13, label: "Raag Sorath" },
  { id: 14, label: "Raag Dhanaasaree" },
  { id: 15, label: "Raag Jaitsree" },
  { id: 16, label: "Raag Todee" },
  { id: 17, label: "Raag Bairaaree" },
  { id: 18, label: "Raag Tilang" },
  { id: 19, label: "Raag Soohee" },
  { id: 20, label: "Raag Bilaaval" },
  { id: 21, label: "Raag Gond" },
  { id: 22, label: "Raag Raamkalee" },
  { id: 23, label: "Raag Nat Naaraain" },
  { id: 24, label: "Raag Maalee Gauraa" },
  { id: 25, label: "Raag Maaroo" },
  { id: 26, label: "Raag Tukhaari" },
  { id: 27, label: "Raag Kaydaaraa" },
  { id: 28, label: "Raag Bhairao" },
  { id: 29, label: "Raag Basant" },
  { id: 30, label: "Raag Saarang" },
  { id: 31, label: "Raag Malaar" },
  { id: 32, label: "Raag Kaanraa" },
  { id: 33, label: "Raag Kalyaan" },
  { id: 34, label: "Raag Prabhaatee" },
  { id: 35, label: "Raag Jaijaavantee" },
];

/**
 * Search type options with user-friendly descriptions
 */
export const SEARCH_TYPES: SearchTypeOption[] = [
  {
    value: 0,
    label: "First Letter Start (Gurmukhi)",
    description: "Match words starting with these letters in Gurmukhi",
  },
  {
    value: 1,
    label: "First Letter Anywhere (Gurmukhi)",
    description: "Find these first letters anywhere in the line (Gurmukhi)",
  },
  {
    value: 2,
    label: "Full Word (Gurmukhi)",
    description: "Exact match of Gurmukhi text",
  },
  {
    value: 3,
    label: "Full Word (English)",
    description: "Exact match in English translation",
  },
  {
    value: 4,
    label: "All Words (Gurmukhi)",
    description: "All words must be present in Gurmukhi text",
  },
  {
    value: 5,
    label: "All Words (English)",
    description: "All words must be present in English translation",
  },
  {
    value: 6,
    label: "Any Words (Gurmukhi)",
    description: "Any word can match in Gurmukhi text",
  },
  {
    value: 7,
    label: "Any Words (English)",
    description: "Any word can match in English translation",
  },
];
