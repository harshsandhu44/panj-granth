/**
 * Reading History Service
 * Manages persistent reading history using AsyncStorage
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReadingHistoryItem } from "@/types/index";
import { TransformedAng } from "@/types/index";

const READING_HISTORY_KEY = "@panj_granth_reading_history";
const MAX_HISTORY_SIZE = 50;

export class ReadingHistoryService {
  /**
   * Add or update an Ang in reading history
   * If Ang already exists, update timestamp and move to top
   */
  static async addToHistory(ang: TransformedAng): Promise<void> {
    try {
      const history = await this.getHistory();

      // Extract title from metadata
      const title = this.extractTitle(ang);

      // Extract preview from first line
      const preview = this.extractPreview(ang);

      // Create new history item
      const newItem: ReadingHistoryItem = {
        id: `${ang.pageNumber}-${Date.now()}`,
        angNumber: ang.pageNumber,
        timestamp: Date.now(),
        title,
        preview,
      };

      // Remove existing entry for this Ang (if any)
      const filteredHistory = history.filter(
        (item) => item.angNumber !== ang.pageNumber
      );

      // Add new item at the beginning
      const updatedHistory = [newItem, ...filteredHistory];

      // Keep only MAX_HISTORY_SIZE most recent entries
      const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_SIZE);

      // Save to storage
      await AsyncStorage.setItem(
        READING_HISTORY_KEY,
        JSON.stringify(trimmedHistory)
      );
    } catch (error) {
      console.error("Error adding to reading history:", error);
      // Fail silently - don't crash the app
    }
  }

  /**
   * Get all reading history (sorted by most recent first)
   */
  static async getHistory(): Promise<ReadingHistoryItem[]> {
    try {
      const data = await AsyncStorage.getItem(READING_HISTORY_KEY);

      if (!data) {
        return [];
      }

      const history = JSON.parse(data) as ReadingHistoryItem[];

      // Validate data structure
      if (!Array.isArray(history)) {
        console.warn("Invalid reading history data, resetting");
        await this.clearHistory();
        return [];
      }

      return history;
    } catch (error) {
      console.error("Error getting reading history:", error);
      return [];
    }
  }

  /**
   * Get the most recently read Ang number
   * Returns null if no history exists
   */
  static async getLatestAng(): Promise<number | null> {
    try {
      const history = await this.getHistory();

      if (history.length === 0) {
        return null;
      }

      return history[0].angNumber;
    } catch (error) {
      console.error("Error getting latest Ang:", error);
      return null;
    }
  }

  /**
   * Clear all reading history
   */
  static async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(READING_HISTORY_KEY);
    } catch (error) {
      console.error("Error clearing reading history:", error);
    }
  }

  /**
   * Remove a specific Ang from reading history
   */
  static async removeFromHistory(angNumber: number): Promise<void> {
    try {
      const history = await this.getHistory();
      const updatedHistory = history.filter(
        (item) => item.angNumber !== angNumber
      );
      await AsyncStorage.setItem(
        READING_HISTORY_KEY,
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error("Error removing from reading history:", error);
    }
  }

  /**
   * Extract title from Ang metadata
   */
  private static extractTitle(ang: TransformedAng): string {
    const parts: string[] = [`Ang ${ang.pageNumber}`];

    // Add writer if available
    if (ang.writer) {
      parts.push(ang.writer);
    }

    // Add raag if available
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
