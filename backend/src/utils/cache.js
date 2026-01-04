/**
 * Simple in-memory cache with TTL (Time To Live)
 * Provides basic caching functionality for frequently accessed data
 */

class SimpleCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  /**
   * Set a value in the cache with optional TTL
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (default: 60000 = 1 minute)
   */
  set(key, value, ttl = 60000) {
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Store the value with expiry timestamp
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });

    // Set up automatic cleanup after TTL
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);

    this.timers.set(key, timer);

    return true;
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or null if not found/expired
   */
  get(key) {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiry) {
      this.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Check if a key exists in cache and is not expired
   * @param {string} key - Cache key
   * @returns {boolean} True if exists and valid
   */
  has(key) {
    const item = this.cache.get(key);

    if (!item) {
      return false;
    }

    // Check if expired
    if (Date.now() > item.expiry) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a specific key from cache
   * @param {string} key - Cache key to delete
   * @returns {boolean} True if deleted, false if not found
   */
  delete(key) {
    // Clear timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }

    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }

    this.cache.clear();
    this.timers.clear();
  }

  /**
   * Get the number of items in cache
   * @returns {number} Number of cached items
   */
  size() {
    return this.cache.size;
  }

  /**
   * Get all keys in cache
   * @returns {Array} Array of cache keys
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  stats() {
    const now = Date.now();
    const items = Array.from(this.cache.entries());
    const expired = items.filter(([, item]) => item.expiry < now).length;
    const valid = items.length - expired;

    return {
      total: items.length,
      valid,
      expired,
      size: this.size(),
    };
  }
}

// Create cache instances for different purposes
export const tickerCache = new SimpleCache();
export const eventCache = new SimpleCache();
export const opportunityCache = new SimpleCache();

// Export the class for custom instances
export default SimpleCache;
