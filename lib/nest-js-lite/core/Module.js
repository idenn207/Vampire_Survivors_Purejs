/**
 * @fileoverview Module definition factory for organizing providers
 * @module nest-js-lite/core/Module
 */

/**
 * Create a module definition
 *
 * Modules group related providers and can import other modules.
 * This pattern replaces NestJS's @Module decorator for pure JavaScript.
 *
 * @param {Object} config - Module configuration
 * @param {string} config.name - Unique module name
 * @param {string[]} [config.imports=[]] - Module names to import
 * @param {Object[]} [config.providers=[]] - Provider configurations
 * @param {string[]} [config.exports=[]] - Tokens visible to importing modules
 * @param {boolean} [config.global=false] - If true, exports are available everywhere
 * @returns {Object} Module definition
 *
 * @example
 * const CombatModule = defineModule({
 *   name: 'CombatModule',
 *   imports: ['CoreModule'],
 *   providers: [
 *     { token: 'CombatSystem', class: CombatSystem, dependencies: ['CollisionSystem'] },
 *     { token: 'DamageProcessor', class: DamageProcessor }
 *   ],
 *   exports: ['CombatSystem']
 * });
 */
export function defineModule(config) {
  if (!config.name) {
    throw new Error('[Module] Module name is required');
  }

  const module = {
    name: config.name,
    imports: config.imports || [],
    providers: config.providers || [],
    exports: config.exports || [],
    global: config.global || false,
    _isModule: true  // Marker for identification
  };

  // Attach module name to each provider
  for (const provider of module.providers) {
    provider.module = module.name;
  }

  return Object.freeze(module);
}

/**
 * Module class for advanced module operations
 */
export class Module {
  /**
   * @param {Object} definition - Module definition from defineModule()
   */
  constructor(definition) {
    if (!definition._isModule) {
      throw new Error('[Module] Invalid module definition. Use defineModule() to create modules.');
    }

    this._name = definition.name;
    this._imports = [...definition.imports];
    this._providers = [...definition.providers];
    this._exports = new Set(definition.exports);
    this._global = definition.global;

    // Track imported modules
    this._importedModules = new Map();
  }

  /**
   * Check if a token is exported by this module
   * @param {string} token
   * @returns {boolean}
   */
  isExported(token) {
    return this._global || this._exports.has(token);
  }

  /**
   * Check if this module imports another module
   * @param {string} moduleName
   * @returns {boolean}
   */
  hasImport(moduleName) {
    return this._imports.includes(moduleName);
  }

  /**
   * Get provider configurations
   * @returns {Object[]}
   */
  getProviders() {
    return [...this._providers];
  }

  /**
   * Link an imported module
   * @param {Module} module
   */
  linkImport(module) {
    this._importedModules.set(module.name, module);
  }

  /**
   * Get all tokens available to this module (own + imported exports)
   * @returns {Set<string>}
   */
  getAvailableTokens() {
    const tokens = new Set();

    // Own providers
    for (const provider of this._providers) {
      tokens.add(provider.token);
    }

    // Imported exports
    for (const [, importedModule] of this._importedModules) {
      for (const token of importedModule.getExportedTokens()) {
        tokens.add(token);
      }
    }

    return tokens;
  }

  /**
   * Get exported tokens
   * @returns {Set<string>}
   */
  getExportedTokens() {
    if (this._global) {
      // Global modules export all their providers
      return new Set(this._providers.map(p => p.token));
    }
    return new Set(this._exports);
  }

  // Getters
  get name() { return this._name; }
  get imports() { return [...this._imports]; }
  get exports() { return [...this._exports]; }
  get isGlobal() { return this._global; }
}

/**
 * Create a dynamic module (module with runtime configuration)
 *
 * @param {Object} config - Base module config
 * @param {Function} configure - Function that returns additional providers based on options
 * @returns {Function} Module factory function
 *
 * @example
 * const ConfigurableModule = createDynamicModule({
 *   name: 'ConfigurableModule'
 * }, (options) => ({
 *   providers: [
 *     { token: 'Config', type: 'value', value: options }
 *   ]
 * }));
 *
 * // Usage:
 * container.register(ConfigurableModule({ debug: true }));
 */
export function createDynamicModule(baseConfig, configure) {
  return function(options = {}) {
    const dynamicPart = configure(options);

    return defineModule({
      ...baseConfig,
      providers: [
        ...(baseConfig.providers || []),
        ...(dynamicPart.providers || [])
      ],
      imports: [
        ...(baseConfig.imports || []),
        ...(dynamicPart.imports || [])
      ],
      exports: [
        ...(baseConfig.exports || []),
        ...(dynamicPart.exports || [])
      ]
    });
  };
}

export default { defineModule, Module, createDynamicModule };
