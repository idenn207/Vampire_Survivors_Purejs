/**
 * @fileoverview Manages provider lifecycle hooks
 * @module nest-js-lite/core/LifecycleManager
 */

import { Scope } from './Scope.js';

/**
 * Manages lifecycle hooks for all providers
 */
export class LifecycleManager {
  /**
   * @param {Container} container - Parent container
   */
  constructor(container) {
    this._container = container;

    // Track initialization order for proper cleanup
    this._initOrder = [];

    // Providers with update hooks (cached for performance)
    this._beforeUpdateProviders = [];
    this._afterUpdateProviders = [];

    // Initialization state
    this._isInitialized = false;
  }

  /**
   * Initialize all singleton providers in priority order
   * @param {Object} [initArgs={}] - Additional arguments to pass to onInit
   * @returns {Promise<void>}
   */
  async initializeAll(initArgs = {}) {
    if (this._isInitialized) {
      console.warn('[LifecycleManager] Already initialized');
      return;
    }

    // Get all singleton providers
    const providers = [];
    for (const provider of this._container.getProviders()) {
      if (provider.scope === Scope.SINGLETON) {
        providers.push(provider);
      }
    }

    // Sort by priority (lower = earlier)
    providers.sort((a, b) => a.priority - b.priority);

    // Initialize each provider
    for (const provider of providers) {
      await this._initializeProvider(provider, initArgs);
    }

    // Cache update hooks for performance
    this._cacheUpdateHooks();

    this._isInitialized = true;
  }

  /**
   * Initialize a single provider
   * @private
   * @param {Provider} provider
   * @param {Object} initArgs
   */
  async _initializeProvider(provider, initArgs) {
    if (provider.isInitialized) {
      return;
    }

    // Resolve the instance (this creates it if needed)
    const instance = this._container.resolve(provider.token);

    // Call onInit lifecycle hook if defined
    const onInitMethod = provider.lifecycle.onInit;
    if (onInitMethod && typeof instance[onInitMethod] === 'function') {
      const result = instance[onInitMethod](
        initArgs.game,
        initArgs.entityManager,
        ...Object.values(initArgs).slice(2)
      );

      // Support async initialization
      if (result instanceof Promise) {
        await result;
      }
    }

    provider.isInitialized = true;
    this._initOrder.push(provider.token);
  }

  /**
   * Cache providers with update hooks for fast iteration
   * @private
   */
  _cacheUpdateHooks() {
    this._beforeUpdateProviders = [];
    this._afterUpdateProviders = [];

    // Get all providers sorted by priority
    const providers = [...this._container.getProviders()];
    providers.sort((a, b) => a.priority - b.priority);

    for (const provider of providers) {
      if (provider.scope !== Scope.SINGLETON) continue;

      if (provider.lifecycle.beforeUpdate) {
        this._beforeUpdateProviders.push(provider);
      }
      if (provider.lifecycle.afterUpdate) {
        this._afterUpdateProviders.push(provider);
      }
    }
  }

  /**
   * Call beforeUpdate on all providers with this hook
   * @param {number} deltaTime
   */
  beforeUpdate(deltaTime) {
    for (const provider of this._beforeUpdateProviders) {
      const instance = provider.getInstance();
      if (instance && typeof instance[provider.lifecycle.beforeUpdate] === 'function') {
        instance[provider.lifecycle.beforeUpdate](deltaTime);
      }
    }
  }

  /**
   * Call afterUpdate on all providers with this hook
   * @param {number} deltaTime
   */
  afterUpdate(deltaTime) {
    for (const provider of this._afterUpdateProviders) {
      const instance = provider.getInstance();
      if (instance && typeof instance[provider.lifecycle.afterUpdate] === 'function') {
        instance[provider.lifecycle.afterUpdate](deltaTime);
      }
    }
  }

  /**
   * Destroy all providers in reverse initialization order
   * @returns {Promise<void>}
   */
  async destroyAll() {
    // Destroy in reverse order
    for (let i = this._initOrder.length - 1; i >= 0; i--) {
      const token = this._initOrder[i];
      await this._destroyProvider(token);
    }

    this._initOrder = [];
    this._beforeUpdateProviders = [];
    this._afterUpdateProviders = [];
    this._isInitialized = false;
  }

  /**
   * Destroy a single provider
   * @private
   * @param {string} token
   */
  async _destroyProvider(token) {
    const provider = this._container.getProvider(token);
    if (!provider || !provider.isInitialized) {
      return;
    }

    const instance = provider.getInstance();
    if (!instance) {
      return;
    }

    // Call onDestroy lifecycle hook if defined
    const onDestroyMethod = provider.lifecycle.onDestroy;
    if (onDestroyMethod && typeof instance[onDestroyMethod] === 'function') {
      const result = instance[onDestroyMethod]();

      // Support async destruction
      if (result instanceof Promise) {
        await result;
      }
    }

    provider.isInitialized = false;
  }

  /**
   * Check if lifecycle manager is initialized
   * @returns {boolean}
   */
  get isInitialized() {
    return this._isInitialized;
  }

  /**
   * Get initialization order (for debugging)
   * @returns {string[]}
   */
  getInitOrder() {
    return [...this._initOrder];
  }
}

export default LifecycleManager;
