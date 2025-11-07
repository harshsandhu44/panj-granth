/**
 * Custom hook for reading history
 * Provides access to reading history with React state management
 */

import { useState, useEffect, useCallback } from "react";
import { ReadingHistoryService } from "@/services/reading-history";
import { ReadingHistoryItem, TransformedAng } from "@/types/index";

interface UseReadingHistoryResult {
  history: ReadingHistoryItem[];
  latestAng: number | null;
  loading: boolean;
  addToHistory: (ang: TransformedAng) => Promise<void>;
  clearHistory: () => Promise<void>;
  removeFromHistory: (angNumber: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useReadingHistory(): UseReadingHistoryResult {
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [latestAng, setLatestAng] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load reading history from storage
   */
  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const [historyData, latest] = await Promise.all([
        ReadingHistoryService.getHistory(),
        ReadingHistoryService.getLatestAng(),
      ]);

      setHistory(historyData);
      setLatestAng(latest);
    } catch (error) {
      console.error("Error loading reading history:", error);
      setHistory([]);
      setLatestAng(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add Ang to reading history
   */
  const addToHistory = useCallback(
    async (ang: TransformedAng) => {
      await ReadingHistoryService.addToHistory(ang);
      await loadHistory();
    },
    [loadHistory]
  );

  /**
   * Clear all reading history
   */
  const clearHistory = useCallback(async () => {
    await ReadingHistoryService.clearHistory();
    await loadHistory();
  }, [loadHistory]);

  /**
   * Remove specific Ang from reading history
   */
  const removeFromHistory = useCallback(
    async (angNumber: number) => {
      await ReadingHistoryService.removeFromHistory(angNumber);
      await loadHistory();
    },
    [loadHistory]
  );

  /**
   * Refresh history from storage
   */
  const refresh = useCallback(async () => {
    await loadHistory();
  }, [loadHistory]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return {
    history,
    latestAng,
    loading,
    addToHistory,
    clearHistory,
    removeFromHistory,
    refresh,
  };
}
