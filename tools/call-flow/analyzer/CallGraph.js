/**
 * @fileoverview Call graph data structure for method call analysis
 * @module call-flow/analyzer/CallGraph
 */

/**
 * Represents a method call relationship
 */
export class MethodCall {
  /**
   * @param {Object} config
   * @param {string} config.type - 'internal', 'external', 'event_emit', 'event_listen'
   * @param {string} [config.target] - Target method name (for internal calls)
   * @param {string} [config.dependency] - Dependency name (for external calls)
   * @param {string} [config.method] - Method name (for external calls)
   * @param {string} [config.event] - Event name (for event calls)
   * @param {number} [config.lineNumber] - Source line number
   */
  constructor(config) {
    this.type = config.type;
    this.target = config.target || null;
    this.dependency = config.dependency || null;
    this.method = config.method || null;
    this.event = config.event || null;
    this.lineNumber = config.lineNumber || 0;
  }

  /**
   * Get display label for this call
   * @returns {string}
   */
  getLabel() {
    switch (this.type) {
      case 'internal':
        return this.target;
      case 'external':
        return `${this.dependency}.${this.method}()`;
      case 'event_emit':
        return `emit('${this.event}')`;
      case 'event_listen':
        return `on('${this.event}')`;
      default:
        return 'unknown';
    }
  }
}

/**
 * Represents a method in the call graph
 */
export class MethodNode {
  /**
   * @param {string} name - Method name
   * @param {Object} [config={}]
   */
  constructor(name, config = {}) {
    this.name = name;
    this.isPrivate = name.startsWith('_');
    this.isConstructor = name === 'constructor';
    this.params = config.params || [];
    this.returns = config.returns || 'void';
    this.lineNumber = config.lineNumber || 0;
    this.endLineNumber = config.endLineNumber || 0;

    // Calls made by this method
    this.calls = [];

    // Methods that call this method
    this.calledBy = new Set();

    // Events
    this.emitsEvents = [];
    this.listensToEvents = [];
  }

  /**
   * Add a call from this method
   * @param {MethodCall} call
   */
  addCall(call) {
    this.calls.push(call);
  }

  /**
   * Check if this method is an entry point (not called by any other method)
   * @returns {boolean}
   */
  get isEntryPoint() {
    return this.calledBy.size === 0 && !this.isConstructor;
  }

  /**
   * Check if this method is a leaf (doesn't call any other internal methods)
   * @returns {boolean}
   */
  get isLeaf() {
    return this.calls.filter(c => c.type === 'internal').length === 0;
  }
}

/**
 * Represents a class in the call graph
 */
export class ClassNode {
  /**
   * @param {string} name - Class name
   * @param {Object} [config={}]
   */
  constructor(name, config = {}) {
    this.name = name;
    this.namespace = config.namespace || '';
    this.file = config.file || '';
    this.extends = config.extends || null;

    // Methods in this class
    this.methods = new Map();

    // External dependencies
    this.dependencies = new Set();

    // Events
    this.emitsEvents = [];
    this.listensToEvents = [];
  }

  /**
   * Add a method to this class
   * @param {MethodNode} method
   */
  addMethod(method) {
    this.methods.set(method.name, method);
  }

  /**
   * Get a method by name
   * @param {string} name
   * @returns {MethodNode|null}
   */
  getMethod(name) {
    return this.methods.get(name) || null;
  }

  /**
   * Get all methods
   * @returns {MethodNode[]}
   */
  getMethods() {
    return [...this.methods.values()];
  }

  /**
   * Get entry point methods
   * @returns {MethodNode[]}
   */
  getEntryPoints() {
    return this.getMethods().filter(m => m.isEntryPoint);
  }

  /**
   * Get public methods
   * @returns {MethodNode[]}
   */
  getPublicMethods() {
    return this.getMethods().filter(m => !m.isPrivate && !m.isConstructor);
  }

  /**
   * Get private methods
   * @returns {MethodNode[]}
   */
  getPrivateMethods() {
    return this.getMethods().filter(m => m.isPrivate);
  }
}

/**
 * Main call graph data structure
 */
export class CallGraph {
  constructor() {
    // Classes in the graph
    this._classes = new Map();

    // Global event registry
    this._events = new Map();
  }

  /**
   * Add a class to the graph
   * @param {ClassNode} classNode
   */
  addClass(classNode) {
    this._classes.set(classNode.name, classNode);
  }

  /**
   * Get a class by name
   * @param {string} name
   * @returns {ClassNode|null}
   */
  getClass(name) {
    return this._classes.get(name) || null;
  }

  /**
   * Get all classes
   * @returns {ClassNode[]}
   */
  getClasses() {
    return [...this._classes.values()];
  }

  /**
   * Link internal method calls (set calledBy references)
   */
  linkInternalCalls() {
    for (const classNode of this._classes.values()) {
      for (const method of classNode.getMethods()) {
        for (const call of method.calls) {
          if (call.type === 'internal') {
            const targetMethod = classNode.getMethod(call.target);
            if (targetMethod) {
              targetMethod.calledBy.add(method.name);
            }
          }
        }
      }
    }
  }

  /**
   * Register an event
   * @param {string} eventName
   * @param {Object} info
   */
  registerEvent(eventName, info) {
    if (!this._events.has(eventName)) {
      this._events.set(eventName, {
        emitters: [],
        listeners: []
      });
    }

    const event = this._events.get(eventName);
    if (info.type === 'emit') {
      event.emitters.push(info);
    } else {
      event.listeners.push(info);
    }
  }

  /**
   * Get event info
   * @param {string} eventName
   * @returns {Object|null}
   */
  getEvent(eventName) {
    return this._events.get(eventName) || null;
  }

  /**
   * Get all events
   * @returns {Map}
   */
  getEvents() {
    return new Map(this._events);
  }

  /**
   * Get call chain starting from a method
   * @param {string} className
   * @param {string} methodName
   * @param {number} [maxDepth=10]
   * @returns {Object} Call chain tree
   */
  getCallChain(className, methodName, maxDepth = 10) {
    const visited = new Set();

    const buildChain = (clsName, methName, depth) => {
      const key = `${clsName}.${methName}`;

      if (depth > maxDepth) {
        return { class: clsName, method: methName, truncated: true, children: [] };
      }

      if (visited.has(key)) {
        return { class: clsName, method: methName, recursive: true, children: [] };
      }

      visited.add(key);

      const classNode = this._classes.get(clsName);
      if (!classNode) {
        return { class: clsName, method: methName, missing: true, children: [] };
      }

      const methodNode = classNode.getMethod(methName);
      if (!methodNode) {
        return { class: clsName, method: methName, missing: true, children: [] };
      }

      const children = [];

      for (const call of methodNode.calls) {
        if (call.type === 'internal') {
          children.push(buildChain(clsName, call.target, depth + 1));
        } else if (call.type === 'external') {
          children.push({
            class: call.dependency,
            method: call.method,
            external: true,
            children: []
          });
        } else if (call.type === 'event_emit') {
          children.push({
            type: 'event',
            event: call.event,
            action: 'emit',
            children: []
          });
        }
      }

      return {
        class: clsName,
        method: methName,
        isPrivate: methodNode.isPrivate,
        lineNumber: methodNode.lineNumber,
        children
      };
    };

    return buildChain(className, methodName, 0);
  }

  /**
   * Find all entry points across all classes
   * @returns {Object[]}
   */
  findAllEntryPoints() {
    const entryPoints = [];

    for (const classNode of this._classes.values()) {
      for (const method of classNode.getEntryPoints()) {
        entryPoints.push({
          class: classNode.name,
          method: method.name,
          lineNumber: method.lineNumber
        });
      }
    }

    return entryPoints;
  }

  /**
   * Get statistics about the call graph
   * @returns {Object}
   */
  getStats() {
    let totalMethods = 0;
    let totalCalls = 0;
    let totalEvents = 0;

    for (const classNode of this._classes.values()) {
      totalMethods += classNode.methods.size;
      for (const method of classNode.getMethods()) {
        totalCalls += method.calls.length;
      }
    }

    totalEvents = this._events.size;

    return {
      classCount: this._classes.size,
      methodCount: totalMethods,
      callCount: totalCalls,
      eventCount: totalEvents,
      avgMethodsPerClass: totalMethods / this._classes.size || 0,
      avgCallsPerMethod: totalCalls / totalMethods || 0
    };
  }

  /**
   * Serialize the graph to JSON
   * @returns {Object}
   */
  toJSON() {
    const classes = {};

    for (const [name, classNode] of this._classes) {
      const methods = {};

      for (const [methodName, method] of classNode.methods) {
        methods[methodName] = {
          isPrivate: method.isPrivate,
          params: method.params,
          returns: method.returns,
          lineNumber: method.lineNumber,
          calls: method.calls.map(c => ({
            type: c.type,
            target: c.target,
            dependency: c.dependency,
            method: c.method,
            event: c.event,
            lineNumber: c.lineNumber
          })),
          calledBy: [...method.calledBy]
        };
      }

      classes[name] = {
        namespace: classNode.namespace,
        file: classNode.file,
        extends: classNode.extends,
        dependencies: [...classNode.dependencies],
        methods
      };
    }

    return {
      classes,
      events: Object.fromEntries(this._events),
      stats: this.getStats()
    };
  }

  /**
   * Create a CallGraph from JSON
   * @param {Object} json
   * @returns {CallGraph}
   */
  static fromJSON(json) {
    const graph = new CallGraph();

    for (const [className, classData] of Object.entries(json.classes)) {
      const classNode = new ClassNode(className, {
        namespace: classData.namespace,
        file: classData.file,
        extends: classData.extends
      });

      classData.dependencies.forEach(d => classNode.dependencies.add(d));

      for (const [methodName, methodData] of Object.entries(classData.methods)) {
        const methodNode = new MethodNode(methodName, {
          params: methodData.params,
          returns: methodData.returns,
          lineNumber: methodData.lineNumber
        });

        for (const call of methodData.calls) {
          methodNode.addCall(new MethodCall(call));
        }

        methodData.calledBy.forEach(c => methodNode.calledBy.add(c));

        classNode.addMethod(methodNode);
      }

      graph.addClass(classNode);
    }

    // Restore events
    for (const [eventName, eventData] of Object.entries(json.events || {})) {
      graph._events.set(eventName, eventData);
    }

    return graph;
  }
}

export default CallGraph;
