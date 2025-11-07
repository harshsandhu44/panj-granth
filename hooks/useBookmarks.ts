/**
 * Custom hook for bookmarks
 * Provides access to bookmarks with React state management
 */

import { useState, useEffect, useCallback } from "react";
import { BookmarkService } from "@/services/bookmarks";
import { Bookmark } from "@/types/index";
import { TransformedAng } from "@/types/index";

interface UseBookmarksResult {
  bookmarks: Bookmark[];
  loading: boolean;
  isBookmarked: (angNumber: number) => boolean;
  getBookmark: (angNumber: number) => Bookmark | undefined;
  addBookmark: (ang: TransformedAng, note?: string) => Promise<void>;
  removeBookmark: (angNumber: number) => Promise<void>;
  updateNote: (angNumber: number, note: string) => Promise<void>;
  clearAllBookmarks: () => Promise<void>;
  refresh: () => Promise<void>;
  bookmarkCount: number;
}

export function useBookmarks(): UseBookmarksResult {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load bookmarks from storage
   */
  const loadBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await BookmarkService.getAllBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if an Ang is bookmarked
   */
  const isBookmarked = useCallback(
    (angNumber: number): boolean => {
      return bookmarks.some((b) => b.angNumber === angNumber);
    },
    [bookmarks]
  );

  /**
   * Get a specific bookmark
   */
  const getBookmark = useCallback(
    (angNumber: number): Bookmark | undefined => {
      return bookmarks.find((b) => b.angNumber === angNumber);
    },
    [bookmarks]
  );

  /**
   * Add a new bookmark
   */
  const addBookmark = useCallback(
    async (ang: TransformedAng, note?: string) => {
      await BookmarkService.addBookmark(ang, note);
      await loadBookmarks();
    },
    [loadBookmarks]
  );

  /**
   * Remove a bookmark
   */
  const removeBookmark = useCallback(
    async (angNumber: number) => {
      await BookmarkService.removeBookmark(angNumber);
      await loadBookmarks();
    },
    [loadBookmarks]
  );

  /**
   * Update bookmark note
   */
  const updateNote = useCallback(
    async (angNumber: number, note: string) => {
      await BookmarkService.updateNote(angNumber, note);
      await loadBookmarks();
    },
    [loadBookmarks]
  );

  /**
   * Clear all bookmarks
   */
  const clearAllBookmarks = useCallback(async () => {
    await BookmarkService.clearAllBookmarks();
    await loadBookmarks();
  }, [loadBookmarks]);

  /**
   * Refresh bookmarks from storage
   */
  const refresh = useCallback(async () => {
    await loadBookmarks();
  }, [loadBookmarks]);

  // Load bookmarks on mount
  useEffect(() => {
    loadBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return {
    bookmarks,
    loading,
    isBookmarked,
    getBookmark,
    addBookmark,
    removeBookmark,
    updateNote,
    clearAllBookmarks,
    refresh,
    bookmarkCount: bookmarks.length,
  };
}
