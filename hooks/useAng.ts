/**
 * Custom hook for fetching and caching Ang data
 */

import { useState, useEffect } from "react";
import { GurbaniAPI, GurbaniAPIError } from "@/services/gurbani-api";
import { CacheService } from "@/services/cache";
import { transformAng, TransformedAng } from "@/services/transformers";

interface UseAngResult {
  ang: TransformedAng | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isFromCache: boolean;
}

export function useAng(pageNumber: number): UseAngResult {
  const [ang, setAng] = useState<TransformedAng | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const fetchAng = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try cache first
      const cached = await CacheService.getCachedAng(pageNumber);
      if (cached) {
        const transformed = transformAng(cached);
        setAng(transformed);
        setIsFromCache(true);
        setLoading(false);
        return;
      }

      // Fetch from API
      setIsFromCache(false);
      const apiResponse = await GurbaniAPI.fetchAng(pageNumber);
      const transformed = transformAng(apiResponse);

      // Cache the response
      await CacheService.cacheAng(pageNumber, apiResponse);

      setAng(transformed);
    } catch (err) {
      if (err instanceof GurbaniAPIError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setAng(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAng();
  }, [pageNumber]);

  return {
    ang,
    loading,
    error,
    refetch: fetchAng,
    isFromCache,
  };
}
