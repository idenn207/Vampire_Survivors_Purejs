/**
 * @fileoverview Provider wrapper for dependency injection
 * @module nest-js-lite/core/Provider
 */

import { Scope } from './Scope.js';

/**
 * Provider types
 * @enum {string}
 */
export const ProviderType = Object.freeze({
  CLASS: 'class',
  FACTORY: 'factory',
  VALUE: 'value',
  EXISTING: 'existing'
});

/**
 * Wraps a provider configuration and manages instance creation/caching
 */
export class Provider {
  /**
   * @param {Object} config - Provider configuration
   * @param {string} config.token - Unique identifier for this provider
   * @param {string} [config.type='class'] - Provider type (class, factory, value, existing)
   * @param {Function} [config.class] - Class constructor (for type=class)
   * @param {Function} [config.factory] - Factory function (for type=factory)
   * @param {*} [config.value] - Literal value (for type=value)
   * @param {string} [config.useExisting] - Alias to another token (for type=existing)
   * @param {string[]} [config.dependencies=[]] - Tokens of required dependencies
   * @param {string} [config.scope='singleton'] - Provider scope
   * @param {number} [config.priority=0] - Initialization priority (lower = earlier)
   * @param {Object} [config.lifecycle={}] - Lifecycle hook method names
   * @param {string[]} [config.tags=[]] - Tags for batch queries
   * @param {string} [config.module] - Module this provider belongs to
   */
  constructor(config) {
    this._token = config.token;
    this._type = config.type || ProviderType.CLASS;
    this._class = config.class;
    this._factory = config.factory;
    this._value = config.value;
    this._useExisting = config.useExisting;
    this._dependencies = config.dependencies || [];
    this._scope = config.scope || Scope.SINGLETON;
    this._priority = config.priority !== undefined ? config.priority : 0;
    this._lifecycle = config.lifecycle || {};
    this._tags = config.tags || [];
    this._module = config.module || null;

    // Instance cache (for singleton scope)
    this._instance = null;
    this._isInitialized = false;

    // Request-scoped instances (keyed by request ID)
    this._requestInstances = new Map();

    this._validate();
  }

  /**
   * Validate provider configuration
   * @private
   */
  _validate() {
    if (!this._token) {
      throw new Error('[Provider] Token is required');
    }

    switch (this._type) {
      case ProviderType.CLASS:
        if (!this._class || typeof this._class !== 'function') {
          throw new Error(`[Provider:${this._token}] Class constructor required for type=class`);
        }
        break;
      case ProviderType.FACTORY:
        if (!this._factory || typeof this._factory !== 'function') {
          throw new Error(`[Provider:${this._token}] Factory function required for type=factory`);
        }
        break;
      case ProviderType.VALUE:
        // Value can be anything, including undefined
        break;
      case ProviderType.EXISTING:
        if (!this._useExisting) {
          throw new Error(`[Provider:${this._token}] useExisting token required for type=existing`);
        }
        break;
      default:
        throw new Error(`[Provider:${this._token}] Unknown provider type: ${this._type}`);
    }
  }

  /**
   * Create a new instance with resolved dependencies
   * @param {Array} resolvedDeps - Resolved dependency instances
   * @param {Object} container - Container reference for factory providers
   * @returns {*} New instance
   */
  createInstance(resolvedDeps, container) {
    switch (this._type) {
      case ProviderType.CLASS:
        return this._createClassInstance(resolvedDeps);
      case ProviderType.FACTORY:
        return this._factory(container, ...resolvedDeps);
      case ProviderType.VALUE:
        return this._value;
      case ProviderType.EXISTING:
        // Handled by injector - should not reach here
        throw new Error(`[Provider:${this._token}] EXISTING type should be resolved by injector`);
      default:
        throw new Error(`[Provider:${this._token}] Unknown type: ${this._type}`);
    }
  }

  /**
   * Create class instance with dependencies
   * @private
   * @param {Array} resolvedDeps
   * @returns {Object}
   */
  _createClassInstance(resolvedDeps) {
    const instance = new this._class();

    // Auto-inject dependencies via setters or direct assignment
    for (let i = 0; i < this._dependencies.length; i++) {
      const depToken = this._dependencies[i];
      const depInstance = resolvedDeps[i];

      // Try setter first: setDependencyName()
      const setterName = 'set' + depToken.charAt(0).toUpperCase() + depToken.slice(1);
      if (typeof instance[setterName] === 'function') {
        instance[setterName](depInstance);
      } else {
        // Try direct property assignment with underscore prefix
        const propName = '_' + depToken.charAt(0).toLowerCase() + depToken.slice(1);
        if (propName in instance) {
          instance[propName] = depInstance;
        }
      }
    }

    return instance;
  }

  /**
   * Get cached singleton instance
   * @returns {*|null}
   */
  getInstance() {
    return this._instance;
  }

  /**
   * Set cached singleton instance
   * @param {*} instance
   */
  setInstance(instance) {
    this._instance = instance;
  }

  /**
   * Get request-scoped instance
   * @param {string} requestId
   * @returns {*|null}
   */
  getRequestInstance(requestId) {
    return this._requestInstances.get(requestId) || null;
  }

  /**
   * Set request-scoped instance
   * @param {string} requestId
   * @param {*} instance
   */
  setRequestInstance(requestId, instance) {
    this._requestInstances.set(requestId, instance);
  }

  /**
   * Clear request-scoped instance
   * @param {string} requestId
   */
  clearRequestInstance(requestId) {
    this._requestInstances.delete(requestId);
  }

  /**
   * Clear all request-scoped instances
   */
  clearAllRequestInstances() {
    this._requestInstances.clear();
  }

  /**
   * Check if provider has a specific tag
   * @param {string} tag
   * @returns {boolean}
   */
  hasTag(tag) {
    return this._tags.includes(tag);
  }

  // Getters
  get token() { return this._token; }
  get type() { return this._type; }
  get dependencies() { return this._dependencies; }
  get scope() { return this._scope; }
  get priority() { return this._priority; }
  get lifecycle() { return this._lifecycle; }
  get tags() { return this._tags; }
  get module() { return this._module; }
  get isInitialized() { return this._isInitialized; }
  set isInitialized(value) { this._isInitialized = value; }
}

export default Provider;
