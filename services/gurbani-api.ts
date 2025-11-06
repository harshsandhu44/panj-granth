/**
 * Gurbani Now API Service
 * Documentation: https://github.com/montydhanjal/api
 */

import {
  ApiAngResponse,
  ApiHukamnamaResponse,
  ApiSearchResponse,
  ApiError,
  ApiResponse,
  SearchFilters,
} from "@/types/api";

const API_BASE_URL = "https://api.gurbaninow.com/v2";
const REQUEST_TIMEOUT = 10000; // 10 seconds

class GurbaniAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "GurbaniAPIError";
  }
}

/**
 * Check if response is an error
 */
function isApiError(response: any): response is ApiError {
  return response && response.error === true;
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new GurbaniAPIError("Request timed out");
    }
    throw error;
  }
}

/**
 * Gurbani API Service
 */
export class GurbaniAPI {
  /**
   * Fetch a specific Ang (page) from Guru Granth Sahib
   * @param pageNumber - Page number (1-1430)
   * @param source - Source ID (default: 'G' for Guru Granth Sahib)
   * @returns Promise<ApiAngResponse>
   */
  static async fetchAng(
    pageNumber: number,
    source: string = "G"
  ): Promise<ApiAngResponse> {
    if (pageNumber < 1 || pageNumber > 1430) {
      throw new GurbaniAPIError(
        `Invalid Ang number: ${pageNumber}. Must be between 1 and 1430.`
      );
    }

    const url = `${API_BASE_URL}/ang/${pageNumber}/${source}`;

    try {
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        throw new GurbaniAPIError(
          `Failed to fetch Ang ${pageNumber}`,
          response.status
        );
      }

      const data: ApiResponse<ApiAngResponse> = await response.json();

      if (isApiError(data)) {
        throw new GurbaniAPIError(
          data.message || `Error fetching Ang ${pageNumber}`
        );
      }

      return data;
    } catch (error) {
      if (error instanceof GurbaniAPIError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new GurbaniAPIError(
          `Network error while fetching Ang ${pageNumber}: ${error.message}`
        );
      }
      throw new GurbaniAPIError("Unknown error occurred");
    }
  }

  /**
   * Fetch today's Hukamnama
   * @returns Promise<ApiHukamnamaResponse>
   */
  static async fetchTodayHukamnama(): Promise<ApiHukamnamaResponse> {
    const url = `${API_BASE_URL}/hukamnama/today`;

    try {
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        throw new GurbaniAPIError(
          "Failed to fetch today's Hukamnama",
          response.status
        );
      }

      const data: ApiResponse<ApiHukamnamaResponse> = await response.json();

      if (isApiError(data)) {
        throw new GurbaniAPIError(
          data.message || "Error fetching Hukamnama"
        );
      }

      return data;
    } catch (error) {
      if (error instanceof GurbaniAPIError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new GurbaniAPIError(
          `Network error while fetching Hukamnama: ${error.message}`
        );
      }
      throw new GurbaniAPIError("Unknown error occurred");
    }
  }

  /**
   * Fetch Hukamnama for a specific date
   * @param year - Year (YYYY)
   * @param month - Month (1-12)
   * @param day - Day (1-31)
   * @returns Promise<ApiHukamnamaResponse>
   */
  static async fetchHukamnamaByDate(
    year: number,
    month: number,
    day: number
  ): Promise<ApiHukamnamaResponse> {
    const url = `${API_BASE_URL}/hukamnama/${year}/${month}/${day}`;

    try {
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        throw new GurbaniAPIError(
          `Failed to fetch Hukamnama for ${year}-${month}-${day}`,
          response.status
        );
      }

      const data: ApiResponse<ApiHukamnamaResponse> = await response.json();

      if (isApiError(data)) {
        throw new GurbaniAPIError(
          data.message || "Error fetching Hukamnama"
        );
      }

      return data;
    } catch (error) {
      if (error instanceof GurbaniAPIError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new GurbaniAPIError(
          `Network error while fetching Hukamnama: ${error.message}`
        );
      }
      throw new GurbaniAPIError("Unknown error occurred");
    }
  }

  /**
   * Search Guru Granth Sahib
   * @param query - Search query (URL-encoded automatically)
   * @param filters - Optional search filters
   * @returns Promise<ApiSearchResponse>
   */
  static async search(
    query: string,
    filters: SearchFilters = {}
  ): Promise<ApiSearchResponse> {
    if (!query || query.trim().length === 0) {
      throw new GurbaniAPIError("Search query cannot be empty");
    }

    // Build query parameters
    const params = new URLSearchParams();

    // Default filters
    const searchType = filters.searchType ?? 3; // Default: Full Word (English)
    const source = filters.source ?? "G"; // Default: Guru Granth Sahib
    const results = Math.min(filters.results ?? 20, 100); // Max 100
    const skip = filters.skip ?? 0;

    params.append("searchtype", searchType.toString());
    params.append("source", source);
    params.append("results", results.toString());
    params.append("skip", skip.toString());

    // Optional filters
    if (filters.writer !== undefined) {
      params.append("writer", filters.writer.toString());
    }
    if (filters.raag !== undefined) {
      params.append("raag", filters.raag.toString());
    }
    if (filters.ang !== undefined) {
      params.append("ang", filters.ang.toString());
    }

    // Encode query for URL
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `${API_BASE_URL}/search/${encodedQuery}?${params.toString()}`;

    try {
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        throw new GurbaniAPIError(
          `Failed to search for "${query}"`,
          response.status
        );
      }

      const data: ApiResponse<ApiSearchResponse> = await response.json();

      if (isApiError(data)) {
        throw new GurbaniAPIError(
          data.message || `Error searching for "${query}"`
        );
      }

      return data;
    } catch (error) {
      if (error instanceof GurbaniAPIError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new GurbaniAPIError(
          `Network error while searching: ${error.message}`
        );
      }
      throw new GurbaniAPIError("Unknown error occurred");
    }
  }
}

export { GurbaniAPIError };
