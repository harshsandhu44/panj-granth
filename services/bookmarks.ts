/**
 * Bookmark Service
 * Manages bookmarks with AsyncStorage persistence
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Bookmark, BookmarkSortOption } from "@/types/index";
import { TransformedAng } from "@/types/index";

const BOOKMARKS_KEY = "@panj_granth_bookmarks";
const MAX_BOOKMARKS = 500;

export class BookmarkService {
  /**
   * Add a new bookmark
   */
  static async addBookmark(
    ang: TransformedAng,
    note?: string
  ): Promise<void> {
    try {
      const bookmarks = await this.getAllBookmarks();

      // Check if already bookmarked
      const existing = bookmarks.find((b) => b.angNumber === ang.pageNumber);
      if (existing) {
        // Update existing bookmark
        await this.updateNote(ang.pageNumber, note || "");
        return;
      }

      // Check max limit
      if (bookmarks.length >= MAX_BOOKMARKS) {
        throw new Error(
          `Maximum ${MAX_BOOKMARKS} bookmarks reached. Please remove some bookmarks first.`
        );
      }

      // Extract metadata
      const title = this.extractTitle(ang);
      const preview = this.extractPreview(ang);

      // Create new bookmark
      const newBookmark: Bookmark = {
        id: `ang-${ang.pageNumber}-${Date.now()}`,
        angNumber: ang.pageNumber,
        timestamp: Date.now(),
        title,
        preview,
        note,
        raag: ang.raag,
        writer: ang.writer,
      };

      // Add to beginning (most recent first)
      const updatedBookmarks = [newBookmark, ...bookmarks];

      // Save to storage
      await AsyncStorage.setItem(
        BOOKMARKS_KEY,
        JSON.stringify(updatedBookmarks)
      );
    } catch (error) {
      console.error("Error adding bookmark:", error);
      throw error;
    }
  }

  /**
   * Remove a bookmark by Ang number
   */
  static async removeBookmark(angNumber: number): Promise<void> {
    try {
      const bookmarks = await this.getAllBookmarks();
      const updatedBookmarks = bookmarks.filter(
        (b) => b.angNumber !== angNumber
      );

      await AsyncStorage.setItem(
        BOOKMARKS_KEY,
        JSON.stringify(updatedBookmarks)
      );
    } catch (error) {
      console.error("Error removing bookmark:", error);
      throw error;
    }
  }

  /**
   * Update the note of an existing bookmark
   */
  static async updateNote(angNumber: number, note: string): Promise<void> {
    try {
      const bookmarks = await this.getAllBookmarks();
      const bookmarkIndex = bookmarks.findIndex(
        (b) => b.angNumber === angNumber
      );

      if (bookmarkIndex === -1) {
        throw new Error("Bookmark not found");
      }

      // Update the note
      bookmarks[bookmarkIndex].note = note;

      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error("Error updating bookmark note:", error);
      throw error;
    }
  }

  /**
   * Get all bookmarks
   */
  static async getAllBookmarks(): Promise<Bookmark[]> {
    try {
      const data = await AsyncStorage.getItem(BOOKMARKS_KEY);

      if (!data) {
        return [];
      }

      const bookmarks = JSON.parse(data) as Bookmark[];

      // Validate data structure
      if (!Array.isArray(bookmarks)) {
        console.warn("Invalid bookmarks data, resetting");
        await this.clearAllBookmarks();
        return [];
      }

      return bookmarks;
    } catch (error) {
      console.error("Error getting bookmarks:", error);
      return [];
    }
  }

  /**
   * Get a specific bookmark by Ang number
   */
  static async getBookmark(angNumber: number): Promise<Bookmark | undefined> {
    const bookmarks = await this.getAllBookmarks();
    return bookmarks.find((b) => b.angNumber === angNumber);
  }

  /**
   * Check if an Ang is bookmarked
   */
  static async isBookmarked(angNumber: number): Promise<boolean> {
    const bookmark = await this.getBookmark(angNumber);
    return bookmark !== undefined;
  }

  /**
   * Clear all bookmarks
   */
  static async clearAllBookmarks(): Promise<void> {
    try {
      await AsyncStorage.removeItem(BOOKMARKS_KEY);
    } catch (error) {
      console.error("Error clearing bookmarks:", error);
      throw error;
    }
  }

  /**
   * Restore a deleted bookmark (for undo functionality)
   */
  static async restoreBookmark(bookmark: Bookmark): Promise<void> {
    try {
      const bookmarks = await this.getAllBookmarks();

      // Check if it doesn't already exist
      const exists = bookmarks.some((b) => b.angNumber === bookmark.angNumber);
      if (exists) {
        return; // Already exists, no need to restore
      }

      // Add back to beginning
      const updatedBookmarks = [bookmark, ...bookmarks];

      await AsyncStorage.setItem(
        BOOKMARKS_KEY,
        JSON.stringify(updatedBookmarks)
      );
    } catch (error) {
      console.error("Error restoring bookmark:", error);
      throw error;
    }
  }

  /**
   * Sort bookmarks
   */
  static sortBookmarks(
    bookmarks: Bookmark[],
    sortBy: BookmarkSortOption
  ): Bookmark[] {
    const sorted = [...bookmarks];

    switch (sortBy) {
      case "date":
        // Newest first
        return sorted.sort((a, b) => b.timestamp - a.timestamp);

      case "angNumber":
        // Ascending Ang number
        return sorted.sort((a, b) => a.angNumber - b.angNumber);

      case "raag":
        // Alphabetical by raag
        return sorted.sort((a, b) => {
          const raagA = a.raag || "";
          const raagB = b.raag || "";
          return raagA.localeCompare(raagB);
        });

      case "writer":
        // Alphabetical by writer
        return sorted.sort((a, b) => {
          const writerA = a.writer || "";
          const writerB = b.writer || "";
          return writerA.localeCompare(writerB);
        });

      default:
        return sorted;
    }
  }

  /**
   * Search bookmarks by title, preview, or note
   */
  static searchBookmarks(query: string, bookmarks: Bookmark[]): Bookmark[] {
    if (!query || query.trim().length === 0) {
      return bookmarks;
    }

    const lowerQuery = query.toLowerCase();

    return bookmarks.filter((bookmark) => {
      const titleMatch = bookmark.title.toLowerCase().includes(lowerQuery);
      const previewMatch =
        bookmark.preview?.toLowerCase().includes(lowerQuery) || false;
      const noteMatch =
        bookmark.note?.toLowerCase().includes(lowerQuery) || false;
      const raagMatch =
        bookmark.raag?.toLowerCase().includes(lowerQuery) || false;
      const writerMatch =
        bookmark.writer?.toLowerCase().includes(lowerQuery) || false;

      return (
        titleMatch || previewMatch || noteMatch || raagMatch || writerMatch
      );
    });
  }

  /**
   * Extract title from Ang metadata
   */
  private static extractTitle(ang: TransformedAng): string {
    const parts: string[] = [`Ang ${ang.pageNumber}`];

    if (ang.writer) {
      parts.push(ang.writer);
    }

    if (ang.raag) {
      parts.push(ang.raag);
    }

    return parts.join(" - ");
  }

  /**
   * Extract preview text from first line
   */
  private static extractPreview(ang: TransformedAng): string {
    if (ang.lines.length === 0) {
      return "";
    }

    const firstLine = ang.lines[0];
    const text = firstLine.gurmukhi || "";

    // Limit to ~80 characters
    if (text.length > 80) {
      return text.substring(0, 80) + "...";
    }

    return text;
  }
}
