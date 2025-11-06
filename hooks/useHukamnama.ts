/**
 * Custom hook for fetching and caching Hukamnama data
 */

import { useState, useEffect } from "react";
import { GurbaniAPI, GurbaniAPIError } from "@/services/gurbani-api";
import { CacheService } from "@/services/cache";
import {
  transformHukamnama,
  TransformedHukamnama,
  getTodayDateString,
} from "@/services/transformers";

interface UseHukamnamaResult {
  hukamnama: TransformedHukamnama | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isFromCache: boolean;
}

export function useHukamnama(): UseHukamnamaResult {
  const [hukamnama, setHukamnama] = useState<TransformedHukamnama | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const fetchHukamnama = async () => {
    try {
      setLoading(true);
      setError(null);

      const todayKey = getTodayDateString();

      // Try cache first
      const cached = await CacheService.getCachedHukamnama(todayKey);
      if (cached) {
        const transformed = transformHukamnama(cached);
        setHukamnama(transformed);
        setIsFromCache(true);
        setLoading(false);
        return;
      }

      // Fetch from API
      setIsFromCache(false);
      const apiResponse = await GurbaniAPI.fetchTodayHukamnama();
      const transformed = transformHukamnama(apiResponse);

      // Cache the response
      await CacheService.cacheHukamnama(todayKey, apiResponse);

      setHukamnama(transformed);
    } catch (err) {
      if (err instanceof GurbaniAPIError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setHukamnama(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHukamnama();
  }, []);

  return {
    hukamnama,
    loading,
    error,
    refetch: fetchHukamnama,
    isFromCache,
  };
}
