/**
 * @fileoverview Graph explorer for traversing and analyzing dependency graphs
 * @module nest-js-lite/devtools/GraphExplorer
 *
 * Inspired by NestJS Spelunker - provides tools for exploring module dependencies
 */

import { DependencyGraph } from '../utils/DependencyGraph.js';

/**
 * Explorer for navigating and analyzing dependency graphs
 */
export class GraphExplorer {
  /**
   * @param {Container} container
   */
  constructor(container) {
    this._container = container;
    this._graph = null;
  }

  /**
   * Build the dependency graph from container
   * @returns {DependencyGraph}
   */
  buildGraph() {
    this._graph = DependencyGraph.fromContainer(this._container);
    return this._graph;
  }

  /**
   * Get or build the graph
   * @returns {DependencyGraph}
   */
  getGraph() {
    if (!this._graph) {
      this.buildGraph();
    }
    return this._graph;
  }

  /**
   * Explore a specific module and its dependencies
   * @param {string} moduleName
   * @returns {Object} Module exploration result
   */
  exploreModule(moduleName) {
    const module = this._container.getModule(moduleName);
    if (!module) {
      throw new Error(`[GraphExplorer] Module not found: ${moduleName}`);
    }

    const providers = [];
    const imports = [];
    const exports = [];

    // Get module's providers
    for (const provider of this._container.getProviders()) {
      if (provider.module === moduleName) {
        providers.push({
          token: provider.token,
          scope: provider.scope,
          priority: provider.priority,
          dependencies: provider.dependencies
        });
      }
    }

    // Get imports
    for (const importName of module.imports) {
      const importedModule = this._container.getModule(importName);
      if (importedModule) {
        imports.push({
          name: importName,
          isGlobal: importedModule.isGlobal,
          exports: [...importedModule.getExportedTokens()]
        });
      }
    }

    // Get exports
    for (const token of module.getExportedTokens()) {
      exports.push(token);
    }

    return {
      name: moduleName,
      isGlobal: module.isGlobal,
      providers,
      imports,
      exports,
      providerCount: providers.length
    };
  }

  /**
   * Find all modules
   * @returns {Object[]}
   */
  findModules() {
    const modules = [];

    for (const moduleName of this._container.getModuleNames()) {
      modules.push(this.exploreModule(moduleName));
    }

    return modules;
  }

  /**
   * Trace a provider's dependency chain
   * @param {string} token
   * @param {number} [maxDepth=10]
   * @returns {Object} Dependency tree
   */
  traceDependencies(token, maxDepth = 10) {
    const visited = new Set();

    const trace = (currentToken, depth) => {
      if (depth > maxDepth) {
        return { token: currentToken, truncated: true, children: [] };
      }

      if (visited.has(currentToken)) {
        return { token: currentToken, circular: true, children: [] };
      }

      visited.add(currentToken);

      const provider = this._container.getProvider(currentToken);
      if (!provider) {
        return { token: currentToken, missing: true, children: [] };
      }

      const children = provider.dependencies.map(dep => trace(dep, depth + 1));

      return {
        token: currentToken,
        module: provider.module,
        scope: provider.scope,
        children
      };
    };

    return trace(token, 0);
  }

  /**
   * Trace what depends on a provider (reverse dependencies)
   * @param {string} token
   * @param {number} [maxDepth=10]
   * @returns {Object} Dependent tree
   */
  traceDependents(token, maxDepth = 10) {
    const graph = this.getGraph();
    const visited = new Set();

    const trace = (currentToken, depth) => {
      if (depth > maxDepth) {
        return { token: currentToken, truncated: true, children: [] };
      }

      if (visited.has(currentToken)) {
        return { token: currentToken, circular: true, children: [] };
      }

      visited.add(currentToken);

      const node = graph.getNode(currentToken);
      if (!node) {
        return { token: currentToken, missing: true, children: [] };
      }

      const children = [...node.dependents].map(dep => trace(dep.id, depth + 1));

      return {
        token: currentToken,
        module: node.metadata.module,
        dependentCount: node.dependentCount,
        children
      };
    };

    return trace(token, 0);
  }

  /**
   * Find providers by criteria
   * @param {Object} criteria
   * @param {string} [criteria.module]
   * @param {string} [criteria.scope]
   * @param {string} [criteria.tag]
   * @param {Function} [criteria.filter]
   * @returns {Object[]}
   */
  findProviders(criteria = {}) {
    const results = [];

    for (const provider of this._container.getProviders()) {
      let match = true;

      if (criteria.module && provider.module !== criteria.module) {
        match = false;
      }

      if (criteria.scope && provider.scope !== criteria.scope) {
        match = false;
      }

      if (criteria.tag && !provider.hasTag(criteria.tag)) {
        match = false;
      }

      if (criteria.filter && !criteria.filter(provider)) {
        match = false;
      }

      if (match) {
        results.push({
          token: provider.token,
          module: provider.module,
          scope: provider.scope,
          priority: provider.priority,
          dependencies: provider.dependencies,
          tags: provider.tags
        });
      }
    }

    return results;
  }

  /**
   * Get system providers sorted by priority
   * @returns {Object[]}
   */
  getSystemsByPriority() {
    const systems = this.findProviders({ tag: 'system' });
    return systems.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Analyze circular dependencies
   * @returns {Object}
   */
  analyzeCircularDependencies() {
    const graph = this.getGraph();
    const cycles = graph.detectCycles();

    return {
      hasCircular: cycles.length > 0,
      cycleCount: cycles.length,
      cycles: cycles.map(cycle => ({
        path: cycle,
        length: cycle.length
      }))
    };
  }

  /**
   * Get initialization order
   * @returns {string[]}
   */
  getInitializationOrder() {
    const graph = this.getGraph();
    return graph.topologicalSort();
  }

  /**
   * Get graph statistics
   * @returns {Object}
   */
  getStatistics() {
    const graph = this.getGraph();
    const stats = graph.getStats();

    // Add module-level stats
    const moduleStats = {};
    for (const moduleName of this._container.getModuleNames()) {
      moduleStats[moduleName] = this.findProviders({ module: moduleName }).length;
    }

    return {
      ...stats,
      moduleCount: this._container.getModuleNames().length,
      providersByModule: moduleStats
    };
  }

  /**
   * Generate debug report
   * @returns {Object}
   */
  generateDebugReport() {
    const containerDebug = this._container.getDebugInfo();
    const stats = this.getStatistics();
    const circular = this.analyzeCircularDependencies();

    return {
      container: containerDebug,
      statistics: stats,
      circularDependencies: circular,
      modules: this.findModules(),
      timestamp: new Date().toISOString()
    };
  }
}

export default GraphExplorer;
