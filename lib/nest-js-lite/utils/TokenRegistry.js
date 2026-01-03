/**
 * @fileoverview Token registry for managing provider identifiers
 * @module nest-js-lite/utils/TokenRegistry
 */

/**
 * Manages unique tokens for providers
 * Provides utilities for token generation and validation
 */
export class TokenRegistry {
  constructor() {
    this._tokens = new Set();
    this._prefixCounters = new Map();
  }

  /**
   * Register a token
   * @param {string} token
   * @returns {boolean} True if token was registered (not duplicate)
   */
  register(token) {
    if (this._tokens.has(token)) {
      return false;
    }
    this._tokens.add(token);
    return true;
  }

  /**
   * Check if a token is registered
   * @param {string} token
   * @returns {boolean}
   */
  has(token) {
    return this._tokens.has(token);
  }

  /**
   * Unregister a token
   * @param {string} token
   * @returns {boolean} True if token was removed
   */
  unregister(token) {
    return this._tokens.delete(token);
  }

  /**
   * Generate a unique token with prefix
   * @param {string} prefix
   * @returns {string}
   */
  generateUnique(prefix = 'token') {
    const count = this._prefixCounters.get(prefix) || 0;
    this._prefixCounters.set(prefix, count + 1);

    let token = `${prefix}_${count}`;
    while (this._tokens.has(token)) {
      this._prefixCounters.set(prefix, this._prefixCounters.get(prefix) + 1);
      token = `${prefix}_${this._prefixCounters.get(prefix)}`;
    }

    this._tokens.add(token);
    return token;
  }

  /**
   * Get all registered tokens
   * @returns {string[]}
   */
  getAll() {
    return [...this._tokens];
  }

  /**
   * Clear all tokens
   */
  clear() {
    this._tokens.clear();
    this._prefixCounters.clear();
  }

  /**
   * Get token count
   * @returns {number}
   */
  get size() {
    return this._tokens.size;
  }
}

/**
 * Validate a token string
 * @param {string} token
 * @returns {boolean}
 */
export function isValidToken(token) {
  if (typeof token !== 'string') return false;
  if (token.length === 0) return false;
  if (token.length > 256) return false;

  // Allow alphanumeric, underscores, and dots
  return /^[a-zA-Z_][a-zA-Z0-9_.:]*$/.test(token);
}

/**
 * Normalize a class name to a token
 * @param {string|Function} classOrName
 * @returns {string}
 */
export function classToToken(classOrName) {
  if (typeof classOrName === 'function') {
    return classOrName.name || 'AnonymousClass';
  }
  return String(classOrName);
}

/**
 * Create a namespaced token
 * @param {string} namespace
 * @param {string} name
 * @returns {string}
 */
export function namespacedToken(namespace, name) {
  return `${namespace}.${name}`;
}

export default TokenRegistry;
