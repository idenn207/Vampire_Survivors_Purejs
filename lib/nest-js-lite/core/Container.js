/**
 * @fileoverview Dependency Injection Container
 * @module nest-js-lite/core/Container
 */

import { Provider, ProviderType } from './Provider.js';
import { Injector } from './Injector.js';
import { LifecycleManager } from './LifecycleManager.js';
import { Module } from './Module.js';
import { Scope } from './Scope.js';

/**
 * Main DI Container - manages all providers and modules
 */
export class Container {
  constructor() {
    // Provider registry (token -> Provider)
    this._providers = new Map();

    // Module registry (name -> Module)
    this._modules = new Map();

    // Global modules (available to all)
    this._globalModules = new Set();

    // Core services
    this._injector = new Injector(this);
    this._lifecycleManager = new LifecycleManager(this);

    // Request context counter for unique IDs
    this._requestCounter = 0;
  }

  // ============================================
  // Registration Methods
  // ============================================

  /**
   * Register a module with its providers
   * @param {Object} moduleDefinition - Module definition from defineModule()
   * @returns {Container} this (for chaining)
   */
  register(moduleDefinition) {
    if (!moduleDefinition || !moduleDefinition._isModule) {
      throw new Error('[Container] Invalid module definition. Use defineModule() to create modules.');
    }

    // Check for duplicate module
    if (this._modules.has(moduleDefinition.name)) {
      console.warn(`[Container] Module "${moduleDefinition.name}" already registered, skipping`);
      return this;
    }

    // Create Module instance
    const module = new Module(moduleDefinition);
    this._modules.set(module.name, module);

    // Track global modules
    if (module.isGlobal) {
      this._globalModules.add(module.name);
    }

    // Register all providers from this module
    for (const providerConfig of module.getProviders()) {
      this._registerProviderFromModule(providerConfig, module);
    }

    return this;
  }

  /**
   * Register a provider from a module
   * @private
   * @param {Object} config
   * @param {Module} module
   */
  _registerProviderFromModule(config, module) {
    // Check for duplicate provider
    if (this._providers.has(config.token)) {
      const existing = this._providers.get(config.token);
      console.warn(
        `[Container] Provider "${config.token}" already registered by module "${existing.module}", ` +
        `ignoring registration from "${module.name}"`
      );
      return;
    }

    const provider = new Provider({
      ...config,
      module: module.name
    });

    this._providers.set(config.token, provider);
  }

  /**
   * Register a standalone provider (not part of a module)
   * @param {string} token - Provider token
   * @param {Object} config - Provider configuration
   * @returns {Container} this (for chaining)
   */
  registerProvider(token, config) {
    if (this._providers.has(token)) {
      console.warn(`[Container] Provider "${token}" already registered, overwriting`);
    }

    const provider = new Provider({
      ...config,
      token: token
    });

    this._providers.set(token, provider);
    return this;
  }

  /**
   * Register a value provider (shorthand)
   * @param {string} token
   * @param {*} value
   * @returns {Container}
   */
  registerValue(token, value) {
    return this.registerProvider(token, {
      type: ProviderType.VALUE,
      value: value
    });
  }

  /**
   * Register a factory provider (shorthand)
   * @param {string} token
   * @param {Function} factory
   * @param {string[]} [dependencies=[]]
   * @returns {Container}
   */
  registerFactory(token, factory, dependencies = []) {
    return this.registerProvider(token, {
      type: ProviderType.FACTORY,
      factory: factory,
      dependencies: dependencies
    });
  }

  // ============================================
  // Resolution Methods
  // ============================================

  /**
   * Resolve a provider by token
   * @param {string} token
   * @returns {*} Resolved instance
   */
  resolve(token) {
    return this._injector.resolve(token);
  }

  /**
   * Resolve all providers with a specific tag
   * @param {string} tag
   * @returns {Array} Array of resolved instances
   */
  resolveAll(tag) {
    const instances = [];

    for (const provider of this._providers.values()) {
      if (provider.hasTag(tag)) {
        instances.push(this.resolve(provider.token));
      }
    }

    return instances;
  }

  /**
   * Resolve multiple tokens at once
   * @param {string[]} tokens
   * @returns {Object} Map of token -> instance
   */
  resolveMany(tokens) {
    const result = {};
    for (const token of tokens) {
      result[token] = this.resolve(token);
    }
    return result;
  }

  /**
   * Check if a provider exists
   * @param {string} token
   * @returns {boolean}
   */
  has(token) {
    return this._providers.has(token);
  }

  /**
   * Get provider metadata (without resolving)
   * @param {string} token
   * @returns {Provider|null}
   */
  getProvider(token) {
    return this._providers.get(token) || null;
  }

  /**
   * Get all registered providers
   * @returns {Iterator<Provider>}
   */
  getProviders() {
    return this._providers.values();
  }

  /**
   * Get all singleton providers
   * @returns {Provider[]}
   */
  getSingletons() {
    const singletons = [];
    for (const provider of this._providers.values()) {
      if (provider.scope === Scope.SINGLETON) {
        singletons.push(provider);
      }
    }
    return singletons;
  }

  // ============================================
  // Lifecycle Methods
  // ============================================

  /**
   * Initialize all singleton providers
   * @param {Object} [args={}] - Arguments to pass to onInit hooks
   * @returns {Promise<void>}
   */
  async initializeAll(args = {}) {
    // Link module imports
    this._linkModuleImports();

    // Validate dependencies
    this._validateDependencies();

    // Initialize all providers
    await this._lifecycleManager.initializeAll(args);
  }

  /**
   * Link module imports for dependency visibility
   * @private
   */
  _linkModuleImports() {
    for (const [, module] of this._modules) {
      for (const importName of module.imports) {
        const importedModule = this._modules.get(importName);
        if (!importedModule) {
          throw new Error(
            `[Container] Module "${module.name}" imports unknown module "${importName}"`
          );
        }
        module.linkImport(importedModule);
      }

      // Also link all global modules
      for (const globalName of this._globalModules) {
        if (globalName !== module.name) {
          const globalModule = this._modules.get(globalName);
          module.linkImport(globalModule);
        }
      }
    }
  }

  /**
   * Validate that all dependencies can be resolved
   * @private
   */
  _validateDependencies() {
    for (const provider of this._providers.values()) {
      for (const dep of provider.dependencies) {
        if (!this._providers.has(dep)) {
          throw new Error(
            `[Container] Provider "${provider.token}" depends on unknown provider "${dep}"`
          );
        }
      }
    }
  }

  /**
   * Call beforeUpdate on all providers with this hook
   * @param {number} deltaTime
   */
  beforeUpdate(deltaTime) {
    this._lifecycleManager.beforeUpdate(deltaTime);
  }

  /**
   * Call afterUpdate on all providers with this hook
   * @param {number} deltaTime
   */
  afterUpdate(deltaTime) {
    this._lifecycleManager.afterUpdate(deltaTime);
  }

  /**
   * Destroy all providers
   * @returns {Promise<void>}
   */
  async destroyAll() {
    await this._lifecycleManager.destroyAll();

    // Clear all instances
    for (const provider of this._providers.values()) {
      provider.setInstance(null);
      provider.clearAllRequestInstances();
    }
  }

  // ============================================
  // Request Context (for request-scoped providers)
  // ============================================

  /**
   * Create a new request context
   * @returns {string} Request ID
   */
  createRequestContext() {
    const requestId = `req_${++this._requestCounter}`;
    this._injector.setRequestContext(requestId);
    return requestId;
  }

  /**
   * End a request context and clean up scoped instances
   * @param {string} requestId
   */
  endRequestContext(requestId) {
    this._injector.clearRequestInstances(requestId);
    this._injector.clearRequestContext();
  }

  /**
   * Run a function within a request context
   * @param {Function} fn - Function to run
   * @returns {*} Return value of fn
   */
  runInRequestContext(fn) {
    const requestId = this.createRequestContext();
    try {
      return fn();
    } finally {
      this.endRequestContext(requestId);
    }
  }

  // ============================================
  // Introspection
  // ============================================

  /**
   * Get dependency graph data for visualization
   * @returns {Object} Graph data
   */
  getGraph() {
    const nodes = [];
    const edges = [];

    for (const provider of this._providers.values()) {
      nodes.push({
        id: provider.token,
        module: provider.module,
        scope: provider.scope,
        priority: provider.priority,
        tags: provider.tags,
        type: provider.type
      });

      for (const dep of provider.dependencies) {
        edges.push({
          from: provider.token,
          to: dep,
          type: 'dependency'
        });
      }
    }

    return { nodes, edges };
  }

  /**
   * Get all registered modules
   * @returns {string[]}
   */
  getModuleNames() {
    return [...this._modules.keys()];
  }

  /**
   * Get module by name
   * @param {string} name
   * @returns {Module|null}
   */
  getModule(name) {
    return this._modules.get(name) || null;
  }

  /**
   * Get debug information
   * @returns {Object}
   */
  getDebugInfo() {
    return {
      providerCount: this._providers.size,
      moduleCount: this._modules.size,
      globalModules: [...this._globalModules],
      isInitialized: this._lifecycleManager.isInitialized,
      initOrder: this._lifecycleManager.getInitOrder()
    };
  }
}

export default Container;
