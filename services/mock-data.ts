/**
 * Mock data service for development and testing
 */

import { Hukamnama, ReadingHistoryItem, Raag, Author } from "@/types";

/**
 * Today's mock Hukamnama
 */
export const getMockHukamnama = (): Hukamnama => {
  return {
    date: new Date().toISOString(),
    angNumber: 296,
    gurmukhi: "ਸਲੋਕੁ ॥\nਨਾਨਕ ਨਾਮੁ ਨ ਚੇਤਨੀ ਅਵਗਣ ਜੀਅ ਭਰੀਅਹਿ ॥\nਜੰਮਣੁ ਮਰਣੁ ਨ ਚੁਕਈ ਮਨਮੁਖਿ ਘਾਣਿ ਘਰੀਅਹਿ ॥੧॥",
    transliteration: "Salok.\nNanak naam na chetanee avgan jeea bhareeahi.\nJamman maran na chukaee manmukh ghaan ghareeahi. ||1||",
    translation: "Slok: O Nanak, those who do not remember the Naam, the Name of the Lord, are filled with faults and demerits. Birth and death do not end for the self-willed manmukhs; they are ruined and destroyed. ||1||",
    raag: Raag.GAURI,
    author: Author.GURU_AMAR_DAS,
  };
};

/**
 * Mock reading history
 */
export const getMockReadingHistory = (): ReadingHistoryItem[] => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  return [
    {
      id: "1",
      angNumber: 296,
      timestamp: now - oneDay * 0.5,
      title: "Ang 296 - Raag Gauri",
      preview: "ਨਾਨਕ ਨਾਮੁ ਨ ਚੇਤਨੀ ਅਵਗਣ ਜੀਅ ਭਰੀਅਹਿ...",
    },
    {
      id: "2",
      angNumber: 8,
      timestamp: now - oneDay * 1,
      title: "Ang 8 - Japji Sahib",
      preview: "ਸੁਣਿਐ ਸਿਧ ਪੀਰ ਸੁਰਿ ਨਾਥ...",
    },
    {
      id: "3",
      angNumber: 917,
      timestamp: now - oneDay * 2,
      title: "Ang 917 - Raag Ramkali",
      preview: "ਰਾਮਕਲੀ ਮਹਲਾ ੩ ਅਨੰਦੁ...",
    },
    {
      id: "4",
      angNumber: 1,
      timestamp: now - oneDay * 3,
      title: "Ang 1 - Japji Sahib",
      preview: "ਇਕ ਓਅੰਕਾਰ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ...",
    },
  ];
};

/**
 * Get mock Ang data by number
 */
export const getMockAngData = (angNumber: number) => {
  return {
    id: angNumber,
    gurmukhi: `ਅੰਗ ${angNumber}\n\nਇਹ ਪਲੇਸਹੋਲਡਰ ਟੈਕਸਟ ਹੈ।\nਅਸਲੀ ਗੁਰਬਾਣੀ ਜਲਦੀ ਹੀ ਸ਼ਾਮਲ ਕੀਤੀ ਜਾਵੇਗੀ।`,
    transliteration: `Ang ${angNumber}\n\nThis is placeholder text.\nReal Gurbani will be added soon.`,
    translation: `Page ${angNumber}\n\nThis is placeholder text.\nReal translations will be added soon.`,
    raag: Raag.GAURI,
    author: Author.GURU_NANAK,
  };
};

/**
 * Generate random Ang number (1-1430)
 */
export const getRandomAngNumber = (): number => {
  return Math.floor(Math.random() * 1430) + 1;
};

/**
 * Format timestamp to relative time
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
};
