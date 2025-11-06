/**
 * Custom hook for search functionality
 * Handles search state, API calls, caching, and debouncing
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { GurbaniAPI, GurbaniAPIError } from "@/services/gurbani-api";
import { CacheService } from "@/services/cache";
import { transformSearchResults } from "@/services/transformers";
import { SearchFilters } from "@/types/api";
import { SearchResultWithContext } from "@/types/index";

const DEBOUNCE_DELAY = 500; // milliseconds

interface UseSearchResult {
  results: SearchResultWithContext[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  search: (query: string, filters?: SearchFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  clear: () => void;
  isFromCache: boolean;
}

export function useSearch(): UseSearchResult {
  const [results, setResults] = useState<SearchResultWithContext[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  const [skip, setSkip] = useState(0);
  const [isFromCache, setIsFromCache] = useState(false);

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Has more results to load
  const hasMore = results.length < totalCount;

  /**
   * Perform search with caching
   */
  const performSearch = useCallback(
    async (query: string, filters: SearchFilters = {}, skipOffset: number = 0) => {
      if (!query || query.trim().length === 0) {
        setResults([]);
        setTotalCount(0);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchFilters = {
          ...filters,
          skip: skipOffset,
          results: 20,
        };

        // Check cache first
        const cached = await CacheService.getCachedSearch(query, searchFilters);

        if (cached) {
          const transformed = transformSearchResults(cached);
          if (skipOffset === 0) {
            setResults(transformed);
          } else {
            setResults((prev) => [...prev, ...transformed]);
          }
          setTotalCount(cached.count);
          setIsFromCache(true);
          setLoading(false);
          return;
        }

        // Fetch from API
        setIsFromCache(false);
        const response = await GurbaniAPI.search(query, searchFilters);

        // Cache the results
        await CacheService.cacheSearch(query, searchFilters, response);

        // Transform and update state
        const transformed = transformSearchResults(response);
        if (skipOffset === 0) {
          setResults(transformed);
        } else {
          setResults((prev) => [...prev, ...transformed]);
        }
        setTotalCount(response.count);
      } catch (err) {
        if (err instanceof GurbaniAPIError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
        if (skipOffset === 0) {
          setResults([]);
          setTotalCount(0);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Search with debouncing
   */
  const search = useCallback(
    async (query: string, filters: SearchFilters = {}) => {
      // Clear any existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Update current query and filters
      setCurrentQuery(query);
      setCurrentFilters(filters);
      setSkip(0);

      // If query is empty, clear immediately
      if (!query || query.trim().length === 0) {
        setResults([]);
        setTotalCount(0);
        setError(null);
        return;
      }

      // Debounce the search
      debounceTimerRef.current = setTimeout(() => {
        performSearch(query, filters, 0);
      }, DEBOUNCE_DELAY);
    },
    [performSearch]
  );

  /**
   * Load more results (pagination)
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !currentQuery) return;

    const newSkip = skip + 20;
    setSkip(newSkip);
    await performSearch(currentQuery, currentFilters, newSkip);
  }, [hasMore, loading, currentQuery, currentFilters, skip, performSearch]);

  /**
   * Clear search results
   */
  const clear = useCallback(() => {
    setResults([]);
    setTotalCount(0);
    setError(null);
    setCurrentQuery("");
    setCurrentFilters({});
    setSkip(0);
    setIsFromCache(false);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    results,
    totalCount,
    loading,
    error,
    hasMore,
    search,
    loadMore,
    clear,
    isFromCache,
  };
}
