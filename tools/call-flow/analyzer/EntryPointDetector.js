/**
 * @fileoverview Detects entry points in classes (methods that are called externally)
 * @module call-flow/analyzer/EntryPointDetector
 */

/**
 * Common entry point method patterns
 */
export const ENTRY_POINT_PATTERNS = {
  // Lifecycle methods
  lifecycle: ['initialize', 'init', 'start', 'stop', 'dispose', 'destroy', 'cleanup'],

  // Update methods
  update: ['update', 'tick', 'step', 'process', 'run'],

  // Render methods
  render: ['render', 'draw', 'paint', 'display'],

  // Event handlers
  eventHandlers: [
    /^on[A-Z]/,           // onSomething
    /^handle[A-Z]/,       // handleSomething
    /^_on[A-Z]/,          // _onSomething
    /^_handle[A-Z]/       // _handleSomething
  ],

  // Public API methods (typically called from outside)
  publicApi: [
    'get', 'set',
    /^get[A-Z]/,          // getSomething
    /^set[A-Z]/,          // setSomething
    /^add[A-Z]/,          // addSomething
    /^remove[A-Z]/,       // removeSomething
    /^create[A-Z]/,       // createSomething
    /^delete[A-Z]/,       // deleteSomething
    /^find[A-Z]/,         // findSomething
    /^is[A-Z]/,           // isSomething
    /^has[A-Z]/,          // hasSomething
    /^can[A-Z]/           // canSomething
  ]
};

/**
 * Entry point categories
 */
export const EntryPointCategory = {
  LIFECYCLE: 'lifecycle',
  UPDATE: 'update',
  RENDER: 'render',
  EVENT_HANDLER: 'event_handler',
  PUBLIC_API: 'public_api',
  ORPHAN: 'orphan',  // Not called internally but doesn't match patterns
  UNKNOWN: 'unknown'
};

/**
 * Detects and categorizes entry points in a call graph
 */
export class EntryPointDetector {
  /**
   * @param {CallGraph} graph
   */
  constructor(graph) {
    this._graph = graph;
  }

  /**
   * Detect all entry points across all classes
   * @returns {Object[]}
   */
  detectAll() {
    const entryPoints = [];

    for (const classNode of this._graph.getClasses()) {
      const classEntryPoints = this.detectForClass(classNode.name);
      entryPoints.push(...classEntryPoints);
    }

    return entryPoints;
  }

  /**
   * Detect entry points for a specific class
   * @param {string} className
   * @returns {Object[]}
   */
  detectForClass(className) {
    const classNode = this._graph.getClass(className);
    if (!classNode) {
      return [];
    }

    const entryPoints = [];

    for (const method of classNode.getMethods()) {
      // Skip constructor
      if (method.isConstructor) {
        continue;
      }

      // Check if method is an entry point (not called by other methods in class)
      if (method.isEntryPoint) {
        const category = this._categorizeMethod(method.name);

        entryPoints.push({
          class: className,
          method: method.name,
          category,
          isPrivate: method.isPrivate,
          lineNumber: method.lineNumber,
          callCount: method.calls.length
        });
      }
    }

    return entryPoints;
  }

  /**
   * Categorize a method based on its name
   * @private
   * @param {string} methodName
   * @returns {string}
   */
  _categorizeMethod(methodName) {
    // Check lifecycle
    if (ENTRY_POINT_PATTERNS.lifecycle.includes(methodName)) {
      return EntryPointCategory.LIFECYCLE;
    }

    // Check update
    if (ENTRY_POINT_PATTERNS.update.includes(methodName)) {
      return EntryPointCategory.UPDATE;
    }

    // Check render
    if (ENTRY_POINT_PATTERNS.render.includes(methodName)) {
      return EntryPointCategory.RENDER;
    }

    // Check event handlers
    for (const pattern of ENTRY_POINT_PATTERNS.eventHandlers) {
      if (pattern instanceof RegExp) {
        if (pattern.test(methodName)) {
          return EntryPointCategory.EVENT_HANDLER;
        }
      } else if (methodName === pattern) {
        return EntryPointCategory.EVENT_HANDLER;
      }
    }

    // Check public API
    for (const pattern of ENTRY_POINT_PATTERNS.publicApi) {
      if (pattern instanceof RegExp) {
        if (pattern.test(methodName)) {
          return EntryPointCategory.PUBLIC_API;
        }
      } else if (methodName === pattern) {
        return EntryPointCategory.PUBLIC_API;
      }
    }

    // Private methods that aren't called = orphans
    if (methodName.startsWith('_')) {
      return EntryPointCategory.ORPHAN;
    }

    return EntryPointCategory.UNKNOWN;
  }

  /**
   * Get entry points grouped by category
   * @returns {Object}
   */
  getByCategory() {
    const allEntryPoints = this.detectAll();
    const grouped = {};

    for (const category of Object.values(EntryPointCategory)) {
      grouped[category] = [];
    }

    for (const ep of allEntryPoints) {
      grouped[ep.category].push(ep);
    }

    return grouped;
  }

  /**
   * Get entry points grouped by class
   * @returns {Object}
   */
  getByClass() {
    const allEntryPoints = this.detectAll();
    const grouped = {};

    for (const ep of allEntryPoints) {
      if (!grouped[ep.class]) {
        grouped[ep.class] = [];
      }
      grouped[ep.class].push(ep);
    }

    return grouped;
  }

  /**
   * Find primary entry points (update and render methods)
   * @returns {Object[]}
   */
  getPrimaryEntryPoints() {
    return this.detectAll().filter(ep =>
      ep.category === EntryPointCategory.UPDATE ||
      ep.category === EntryPointCategory.RENDER ||
      ep.category === EntryPointCategory.LIFECYCLE
    );
  }

  /**
   * Detect orphan methods (private methods never called)
   * @returns {Object[]}
   */
  detectOrphans() {
    const orphans = [];

    for (const classNode of this._graph.getClasses()) {
      for (const method of classNode.getMethods()) {
        if (method.isPrivate && method.isEntryPoint && !method.isConstructor) {
          orphans.push({
            class: classNode.name,
            method: method.name,
            lineNumber: method.lineNumber
          });
        }
      }
    }

    return orphans;
  }

  /**
   * Get execution paths from entry points
   * @param {number} [maxDepth=5]
   * @returns {Object[]}
   */
  getExecutionPaths(maxDepth = 5) {
    const entryPoints = this.getPrimaryEntryPoints();
    const paths = [];

    for (const ep of entryPoints) {
      const chain = this._graph.getCallChain(ep.class, ep.method, maxDepth);
      paths.push({
        entryPoint: ep,
        callChain: chain,
        depth: this._getMaxDepth(chain)
      });
    }

    return paths;
  }

  /**
   * Get maximum depth of a call chain
   * @private
   * @param {Object} chain
   * @param {number} [currentDepth=0]
   * @returns {number}
   */
  _getMaxDepth(chain, currentDepth = 0) {
    if (!chain.children || chain.children.length === 0) {
      return currentDepth;
    }

    let maxChildDepth = currentDepth;
    for (const child of chain.children) {
      const childDepth = this._getMaxDepth(child, currentDepth + 1);
      maxChildDepth = Math.max(maxChildDepth, childDepth);
    }

    return maxChildDepth;
  }
}

export default EntryPointDetector;
