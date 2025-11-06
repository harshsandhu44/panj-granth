/**
 * Persistent cache service using AsyncStorage
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiAngResponse, ApiHukamnamaResponse, ApiSearchResponse } from "@/types/api";

const CACHE_KEY_PREFIX = "@panj_granth_cache:";
const ANG_CACHE_KEY = `${CACHE_KEY_PREFIX}ang:`;
const HUKAMNAMA_CACHE_KEY = `${CACHE_KEY_PREFIX}hukamnama:`;
const SEARCH_CACHE_KEY = `${CACHE_KEY_PREFIX}search:`;
const MAX_ANG_CACHE_SIZE = 50;
const MAX_SEARCH_CACHE_SIZE = 20;
const ANG_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
const HUKAMNAMA_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const SEARCH_CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheMetadata {
  angKeys: string[];
  searchKeys: string[];
  lastAccess: Record<string, number>;
}

/**
 * Cache Service for Gurbani data
 */
export class CacheService {
  /**
   * Get cache metadata
   */
  private static async getMetadata(): Promise<CacheMetadata> {
    try {
      const metadataStr = await AsyncStorage.getItem(
        `${CACHE_KEY_PREFIX}metadata`
      );
      if (metadataStr) {
        return JSON.parse(metadataStr);
      }
    } catch (error) {
      console.error("Error reading cache metadata:", error);
    }
    return { angKeys: [], searchKeys: [], lastAccess: {} };
  }

  /**
   * Save cache metadata
   */
  private static async saveMetadata(metadata: CacheMetadata): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${CACHE_KEY_PREFIX}metadata`,
        JSON.stringify(metadata)
      );
    } catch (error) {
      console.error("Error saving cache metadata:", error);
    }
  }

  /**
   * Check if cache entry is expired
   */
  private static isExpired(timestamp: number, ttl: number): boolean {
    return Date.now() - timestamp > ttl;
  }

  /**
   * Evict least recently used Ang from cache
   */
  private static async evictLRU(): Promise<void> {
    const metadata = await this.getMetadata();
    if (metadata.angKeys.length === 0) return;

    // Find LRU key
    let lruKey = metadata.angKeys[0];
    let lruTime = metadata.lastAccess[lruKey] || 0;

    for (const key of metadata.angKeys) {
      const accessTime = metadata.lastAccess[key] || 0;
      if (accessTime < lruTime) {
        lruKey = key;
        lruTime = accessTime;
      }
    }

    // Remove from cache
    try {
      await AsyncStorage.removeItem(`${ANG_CACHE_KEY}${lruKey}`);
      metadata.angKeys = metadata.angKeys.filter((k) => k !== lruKey);
      delete metadata.lastAccess[lruKey];
      await this.saveMetadata(metadata);
    } catch (error) {
      console.error("Error evicting LRU cache entry:", error);
    }
  }

  /**
   * Cache an Ang
   */
  static async cacheAng(
    pageNumber: number,
    data: ApiAngResponse
  ): Promise<void> {
    try {
      const entry: CacheEntry<ApiAngResponse> = {
        data,
        timestamp: Date.now(),
      };

      const metadata = await this.getMetadata();

      // Check if we need to evict
      if (
        metadata.angKeys.length >= MAX_ANG_CACHE_SIZE &&
        !metadata.angKeys.includes(pageNumber.toString())
      ) {
        await this.evictLRU();
      }

      // Save the cache entry
      await AsyncStorage.setItem(
        `${ANG_CACHE_KEY}${pageNumber}`,
        JSON.stringify(entry)
      );

      // Update metadata
      if (!metadata.angKeys.includes(pageNumber.toString())) {
        metadata.angKeys.push(pageNumber.toString());
      }
      metadata.lastAccess[pageNumber] = Date.now();
      await this.saveMetadata(metadata);
    } catch (error) {
      console.error("Error caching Ang:", error);
    }
  }

  /**
   * Get cached Ang
   */
  static async getCachedAng(
    pageNumber: number
  ): Promise<ApiAngResponse | null> {
    try {
      const cachedStr = await AsyncStorage.getItem(
        `${ANG_CACHE_KEY}${pageNumber}`
      );
      if (!cachedStr) return null;

      const entry: CacheEntry<ApiAngResponse> = JSON.parse(cachedStr);

      // Check if expired
      if (this.isExpired(entry.timestamp, ANG_CACHE_TTL)) {
        await this.clearAng(pageNumber);
        return null;
      }

      // Update last access time
      const metadata = await this.getMetadata();
      metadata.lastAccess[pageNumber] = Date.now();
      await this.saveMetadata(metadata);

      return entry.data;
    } catch (error) {
      console.error("Error getting cached Ang:", error);
      return null;
    }
  }

  /**
   * Clear specific Ang from cache
   */
  static async clearAng(pageNumber: number): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${ANG_CACHE_KEY}${pageNumber}`);
      const metadata = await this.getMetadata();
      metadata.angKeys = metadata.angKeys.filter(
        (k) => k !== pageNumber.toString()
      );
      delete metadata.lastAccess[pageNumber];
      await this.saveMetadata(metadata);
    } catch (error) {
      console.error("Error clearing Ang cache:", error);
    }
  }

  /**
   * Cache Hukamnama
   */
  static async cacheHukamnama(
    date: string,
    data: ApiHukamnamaResponse
  ): Promise<void> {
    try {
      const entry: CacheEntry<ApiHukamnamaResponse> = {
        data,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(
        `${HUKAMNAMA_CACHE_KEY}${date}`,
        JSON.stringify(entry)
      );
    } catch (error) {
      console.error("Error caching Hukamnama:", error);
    }
  }

  /**
   * Get cached Hukamnama
   */
  static async getCachedHukamnama(
    date: string
  ): Promise<ApiHukamnamaResponse | null> {
    try {
      const cachedStr = await AsyncStorage.getItem(
        `${HUKAMNAMA_CACHE_KEY}${date}`
      );
      if (!cachedStr) return null;

      const entry: CacheEntry<ApiHukamnamaResponse> = JSON.parse(cachedStr);

      // Check if expired
      if (this.isExpired(entry.timestamp, HUKAMNAMA_CACHE_TTL)) {
        await this.clearHukamnama(date);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error("Error getting cached Hukamnama:", error);
      return null;
    }
  }

  /**
   * Clear specific Hukamnama from cache
   */
  static async clearHukamnama(date: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${HUKAMNAMA_CACHE_KEY}${date}`);
    } catch (error) {
      console.error("Error clearing Hukamnama cache:", error);
    }
  }

  /**
   * Clear all cache
   */
  static async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith(CACHE_KEY_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error("Error clearing all cache:", error);
    }
  }

  /**
   * Create cache hash for search query
   */
  private static createSearchHash(query: string, filters: any): string {
    const filterStr = JSON.stringify(filters);
    return `${query}:${filterStr}`;
  }

  /**
   * Evict least recently used search from cache
   */
  private static async evictSearchLRU(): Promise<void> {
    const metadata = await this.getMetadata();
    if (metadata.searchKeys.length === 0) return;

    // Find LRU key
    let lruKey = metadata.searchKeys[0];
    let lruTime = metadata.lastAccess[`search:${lruKey}`] || 0;

    for (const key of metadata.searchKeys) {
      const accessTime = metadata.lastAccess[`search:${key}`] || 0;
      if (accessTime < lruTime) {
        lruKey = key;
        lruTime = accessTime;
      }
    }

    // Remove from cache
    try {
      await AsyncStorage.removeItem(`${SEARCH_CACHE_KEY}${lruKey}`);
      metadata.searchKeys = metadata.searchKeys.filter((k) => k !== lruKey);
      delete metadata.lastAccess[`search:${lruKey}`];
      await this.saveMetadata(metadata);
    } catch (error) {
      console.error("Error evicting LRU search cache entry:", error);
    }
  }

  /**
   * Cache search results
   */
  static async cacheSearch(
    query: string,
    filters: any,
    data: ApiSearchResponse
  ): Promise<void> {
    try {
      const hash = this.createSearchHash(query, filters);
      const entry: CacheEntry<ApiSearchResponse> = {
        data,
        timestamp: Date.now(),
      };

      const metadata = await this.getMetadata();

      // Check if we need to evict
      if (
        metadata.searchKeys.length >= MAX_SEARCH_CACHE_SIZE &&
        !metadata.searchKeys.includes(hash)
      ) {
        await this.evictSearchLRU();
      }

      // Save the cache entry
      await AsyncStorage.setItem(
        `${SEARCH_CACHE_KEY}${hash}`,
        JSON.stringify(entry)
      );

      // Update metadata
      if (!metadata.searchKeys.includes(hash)) {
        metadata.searchKeys.push(hash);
      }
      metadata.lastAccess[`search:${hash}`] = Date.now();
      await this.saveMetadata(metadata);
    } catch (error) {
      console.error("Error caching search:", error);
    }
  }

  /**
   * Get cached search results
   */
  static async getCachedSearch(
    query: string,
    filters: any
  ): Promise<ApiSearchResponse | null> {
    try {
      const hash = this.createSearchHash(query, filters);
      const cachedStr = await AsyncStorage.getItem(`${SEARCH_CACHE_KEY}${hash}`);
      if (!cachedStr) return null;

      const entry: CacheEntry<ApiSearchResponse> = JSON.parse(cachedStr);

      // Check if expired
      if (this.isExpired(entry.timestamp, SEARCH_CACHE_TTL)) {
        await this.clearSearch(query, filters);
        return null;
      }

      // Update last access time
      const metadata = await this.getMetadata();
      metadata.lastAccess[`search:${hash}`] = Date.now();
      await this.saveMetadata(metadata);

      return entry.data;
    } catch (error) {
      console.error("Error getting cached search:", error);
      return null;
    }
  }

  /**
   * Clear specific search from cache
   */
  static async clearSearch(query: string, filters: any): Promise<void> {
    try {
      const hash = this.createSearchHash(query, filters);
      await AsyncStorage.removeItem(`${SEARCH_CACHE_KEY}${hash}`);
      const metadata = await this.getMetadata();
      metadata.searchKeys = metadata.searchKeys.filter((k) => k !== hash);
      delete metadata.lastAccess[`search:${hash}`];
      await this.saveMetadata(metadata);
    } catch (error) {
      console.error("Error clearing search cache:", error);
    }
  }

  /**
   * Get cache statistics
   */
  static async getStats(): Promise<{
    angCount: number;
    hukamnamaCount: number;
    searchCount: number;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const angCount = keys.filter((key) =>
        key.startsWith(ANG_CACHE_KEY)
      ).length;
      const hukamnamaCount = keys.filter((key) =>
        key.startsWith(HUKAMNAMA_CACHE_KEY)
      ).length;
      const searchCount = keys.filter((key) =>
        key.startsWith(SEARCH_CACHE_KEY)
      ).length;
      return { angCount, hukamnamaCount, searchCount };
    } catch (error) {
      console.error("Error getting cache stats:", error);
      return { angCount: 0, hukamnamaCount: 0, searchCount: 0 };
    }
  }
}
