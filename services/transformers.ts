/**
 * Data transformation utilities
 * Convert API responses to app-friendly formats
 */

import {
  ApiAngResponse,
  ApiHukamnamaResponse,
  ApiSearchResponse,
  ApiSearchResult,
  ApiLine,
} from "@/types/api";
import { SearchLine, SearchResultWithContext } from "@/types/index";

export interface TransformedLine {
  id: string;
  type: number;
  gurmukhi: string;
  gurmukhiLarivaar?: string;
  englishTranslation?: string;
  punjabiTranslation?: string;
  transliteration?: string;
  transliterationDevanagari?: string;
  lineNumber: number;
  shabadId: string;
}

export interface TransformedAng {
  pageNumber: number;
  lines: TransformedLine[];
  writer?: string;
  raag?: string;
  count: number;
}

export interface TransformedHukamnama {
  date: {
    gregorian: string; // Formatted string
    nanakshahi: string; // Formatted string
  };
  pageNumber: number;
  lines: TransformedLine[];
  writer?: string;
  raag?: string;
  count: number;
}

/**
 * Transform API line to app format
 */
export function transformLine(apiLine: ApiLine): TransformedLine {
  return {
    id: apiLine.id,
    type: apiLine.type,
    gurmukhi: apiLine.gurmukhi.unicode,
    gurmukhiLarivaar: apiLine.larivaar?.unicode,
    englishTranslation: apiLine.translation?.english?.default,
    punjabiTranslation: apiLine.translation?.punjabi?.default?.unicode,
    transliteration: apiLine.transliteration?.english?.text,
    transliterationDevanagari: apiLine.transliteration?.devanagari?.text,
    lineNumber: apiLine.lineno,
    shabadId: apiLine.shabadid,
  };
}

/**
 * Transform Ang API response to app format
 */
export function transformAng(apiResponse: ApiAngResponse): TransformedAng {
  const lines = apiResponse.page.map((pageItem) =>
    transformLine(pageItem.line)
  );

  // Get writer and raag from first line (they're usually the same for the whole Ang)
  const firstLine = apiResponse.page[0]?.line;

  return {
    pageNumber: apiResponse.pageno,
    lines,
    writer: firstLine?.writer?.english,
    raag: firstLine?.raag?.english,
    count: apiResponse.count,
  };
}

/**
 * Transform Hukamnama API response to app format
 */
export function transformHukamnama(
  apiResponse: ApiHukamnamaResponse
): TransformedHukamnama {
  const lines = apiResponse.hukamnama.map((item) => transformLine(item.line));

  const gregorianDate = apiResponse.date.gregorian;
  const nanakshahiDate = apiResponse.date.nanakshahi.english;

  return {
    date: {
      gregorian: `${gregorianDate.day}, ${gregorianDate.month} ${gregorianDate.date}, ${gregorianDate.year}`,
      nanakshahi: `${nanakshahiDate.day}, ${nanakshahiDate.month} ${nanakshahiDate.date}, ${nanakshahiDate.year}`,
    },
    pageNumber: apiResponse.hukamnamainfo.pageno,
    lines,
    writer: apiResponse.hukamnamainfo.writer.english,
    raag: apiResponse.hukamnamainfo.raag.english,
    count: apiResponse.hukamnamainfo.count,
  };
}

/**
 * Get preview text from lines (first few words)
 */
export function getPreviewText(
  lines: TransformedLine[],
  maxLength: number = 100
): string {
  if (lines.length === 0) return "";

  let preview = "";
  for (const line of lines) {
    if (preview.length >= maxLength) break;
    preview += line.gurmukhi + " ";
  }

  return preview.length > maxLength
    ? preview.substring(0, maxLength) + "..."
    : preview.trim();
}

/**
 * Get formatted date string for today
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Format date for cache key
 */
export function formatDateForCache(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Transform API line to SearchLine format
 */
export function transformSearchLine(apiLine: ApiLine): SearchLine {
  return {
    id: apiLine.id,
    angNumber: apiLine.pageno,
    lineNumber: apiLine.lineno,
    shabadId: apiLine.shabadid,
    gurmukhi: apiLine.gurmukhi.unicode,
    translation: {
      english: apiLine.translation?.english?.default,
      punjabi: apiLine.translation?.punjabi?.default?.unicode,
    },
    transliteration: {
      english: apiLine.transliteration?.english?.text,
      devanagari: apiLine.transliteration?.devanagari?.text,
    },
    writer: apiLine.writer?.english,
    raag: apiLine.raag?.english,
  };
}

/**
 * Transform search results with context
 * Note: API doesn't provide context lines, so we return empty arrays
 * Context could be fetched separately by fetching the full Ang if needed
 */
export function transformSearchResults(
  apiResponse: ApiSearchResponse
): SearchResultWithContext[] {
  return apiResponse.results.map((result: ApiSearchResult) => ({
    matchedLine: transformSearchLine(result.line),
    contextBefore: [], // Would need separate API call to fetch context
    contextAfter: [], // Would need separate API call to fetch context
  }));
}
