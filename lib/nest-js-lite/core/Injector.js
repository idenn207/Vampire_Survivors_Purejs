/**
 * @fileoverview Dependency injector with circular dependency detection
 * @module nest-js-lite/core/Injector
 */

import { Scope } from './Scope.js';
import { ProviderType } from './Provider.js';

/**
 * Resolves dependencies with circular dependency detection
 */
export class Injector {
  /**
   * @param {Container} container - Parent container
   */
  constructor(container) {
    this._container = container;

    // Track current resolution chain for circular dependency detection
    this._resolutionStack = [];

    // Current request context ID (for request-scoped providers)
    this._currentRequestId = null;
  }

  /**
   * Resolve a provider by token
   * @param {string} token - Provider token to resolve
   * @returns {*} Resolved instance
   * @throws {Error} If circular dependency detected or provider not found
   */
  resolve(token) {
    // Check for circular dependency
    if (this._resolutionStack.includes(token)) {
      const cycle = [...this._resolutionStack, token].join(' -> ');
      throw new Error(`[Injector] Circular dependency detected: ${cycle}`);
    }

    this._resolutionStack.push(token);

    try {
      return this._resolveInternal(token);
    } finally {
      this._resolutionStack.pop();
    }
  }

  /**
   * Internal resolution logic
   * @private
   * @param {string} token
   * @returns {*}
   */
  _resolveInternal(token) {
    const provider = this._container.getProvider(token);

    if (!provider) {
      throw new Error(`[Injector] No provider registered for token: ${token}`);
    }

    // Handle EXISTING type (alias)
    if (provider.type === ProviderType.EXISTING) {
      return this.resolve(provider._useExisting);
    }

    // Check for cached instance based on scope
    const cachedInstance = this._getCachedInstance(provider);
    if (cachedInstance !== null) {
      return cachedInstance;
    }

    // Resolve all dependencies first
    const resolvedDeps = provider.dependencies.map(depToken => this.resolve(depToken));

    // Create instance
    const instance = provider.createInstance(resolvedDeps, this._container);

    // Cache based on scope
    this._cacheInstance(provider, instance);

    return instance;
  }

  /**
   * Get cached instance based on scope
   * @private
   * @param {Provider} provider
   * @returns {*|null}
   */
  _getCachedInstance(provider) {
    switch (provider.scope) {
      case Scope.SINGLETON:
        return provider.getInstance();

      case Scope.REQUEST:
        if (!this._currentRequestId) {
          throw new Error(
            `[Injector] Cannot resolve request-scoped provider "${provider.token}" outside of request context`
          );
        }
        return provider.getRequestInstance(this._currentRequestId);

      case Scope.TRANSIENT:
        // Always create new instance
        return null;

      default:
        return null;
    }
  }

  /**
   * Cache instance based on scope
   * @private
   * @param {Provider} provider
   * @param {*} instance
   */
  _cacheInstance(provider, instance) {
    switch (provider.scope) {
      case Scope.SINGLETON:
        provider.setInstance(instance);
        break;

      case Scope.REQUEST:
        if (this._currentRequestId) {
          provider.setRequestInstance(this._currentRequestId, instance);
        }
        break;

      case Scope.TRANSIENT:
        // Don't cache
        break;
    }
  }

  /**
   * Set current request context
   * @param {string} requestId
   */
  setRequestContext(requestId) {
    this._currentRequestId = requestId;
  }

  /**
   * Clear current request context
   */
  clearRequestContext() {
    this._currentRequestId = null;
  }

  /**
   * Get current request context ID
   * @returns {string|null}
   */
  getRequestContext() {
    return this._currentRequestId;
  }

  /**
   * Clear all request-scoped instances for a specific request
   * @param {string} requestId
   */
  clearRequestInstances(requestId) {
    for (const provider of this._container.getProviders()) {
      if (provider.scope === Scope.REQUEST) {
        provider.clearRequestInstance(requestId);
      }
    }
  }

  /**
   * Check if resolving a token would cause circular dependency
   * @param {string} token
   * @returns {boolean}
   */
  wouldCauseCircular(token) {
    return this._resolutionStack.includes(token);
  }

  /**
   * Get current resolution stack (for debugging)
   * @returns {string[]}
   */
  getResolutionStack() {
    return [...this._resolutionStack];
  }
}

export default Injector;
