/**
 * @fileoverview Runtime method call tracer using Proxy
 * @module call-flow/analyzer/RuntimeTracer
 *
 * Instruments objects to trace method calls during execution.
 * Uses JavaScript Proxy for non-invasive tracing.
 */

/**
 * Represents a single traced method call
 */
export class TraceEntry {
  /**
   * @param {Object} config
   */
  constructor(config) {
    this.id = config.id;
    this.traceId = config.traceId;
    this.type = config.type;  // 'enter' or 'exit'
    this.timestamp = config.timestamp;
    this.className = config.className;
    this.method = config.method;
    this.depth = config.depth;
    this.args = config.args || [];
    this.duration = config.duration || 0;
    this.error = config.error || null;
    this.returnValue = config.returnValue || null;
  }
}

/**
 * Runtime tracer for capturing method call execution
 */
export class RuntimeTracer {
  constructor() {
    // All trace entries
    this._traces = [];

    // Current recording state
    this._isRecording = false;

    // Current call stack for depth tracking
    this._callStack = [];

    // Trace ID counter
    this._traceId = 0;

    // Entry ID counter
    this._entryId = 0;

    // Instrumented objects
    this._instrumented = new Map();

    // Filter configuration
    this._filter = {
      includePrivate: true,
      excludeMethods: ['constructor'],
      maxDepth: 50
    };
  }

  /**
   * Start recording traces
   * @returns {number} Trace ID
   */
  startRecording() {
    this._traces = [];
    this._callStack = [];
    this._entryId = 0;
    this._isRecording = true;
    return ++this._traceId;
  }

  /**
   * Stop recording and return traces
   * @returns {TraceEntry[]}
   */
  stopRecording() {
    this._isRecording = false;
    return [...this._traces];
  }

  /**
   * Check if currently recording
   * @returns {boolean}
   */
  get isRecording() {
    return this._isRecording;
  }

  /**
   * Set filter configuration
   * @param {Object} filter
   */
  setFilter(filter) {
    this._filter = { ...this._filter, ...filter };
  }

  /**
   * Instrument an object for tracing
   * @param {Object} instance - Object to instrument
   * @param {string} className - Name for identification
   * @returns {Proxy} Instrumented proxy
   */
  instrument(instance, className) {
    if (this._instrumented.has(instance)) {
      return this._instrumented.get(instance);
    }

    const self = this;

    const proxy = new Proxy(instance, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);

        // Only intercept functions
        if (typeof value !== 'function') {
          return value;
        }

        // Check if method should be traced
        if (!self._shouldTrace(prop)) {
          return value;
        }

        // Return wrapped function
        return function(...args) {
          return self._traceCall(target, value, className, prop, args);
        };
      }
    });

    this._instrumented.set(instance, proxy);
    return proxy;
  }

  /**
   * Remove instrumentation from an object
   * @param {Object} instance
   */
  uninstrument(instance) {
    this._instrumented.delete(instance);
  }

  /**
   * Clear all instrumentations
   */
  clearInstrumentations() {
    this._instrumented.clear();
  }

  /**
   * Check if a method should be traced
   * @private
   * @param {string} methodName
   * @returns {boolean}
   */
  _shouldTrace(methodName) {
    // Skip excluded methods
    if (this._filter.excludeMethods.includes(methodName)) {
      return false;
    }

    // Check private method filter
    if (!this._filter.includePrivate && methodName.startsWith('_')) {
      return false;
    }

    return true;
  }

  /**
   * Execute a traced method call
   * @private
   */
  _traceCall(target, method, className, methodName, args) {
    if (!this._isRecording) {
      return method.apply(target, args);
    }

    // Check depth limit
    if (this._callStack.length >= this._filter.maxDepth) {
      return method.apply(target, args);
    }

    const entryId = this._entryId++;
    const enterTimestamp = performance.now();

    const enterEntry = new TraceEntry({
      id: entryId,
      traceId: this._traceId,
      type: 'enter',
      timestamp: enterTimestamp,
      className,
      method: methodName,
      depth: this._callStack.length,
      args: this._serializeArgs(args)
    });

    this._traces.push(enterEntry);
    this._callStack.push(enterEntry);

    try {
      const result = method.apply(target, args);

      // Handle promises
      if (result instanceof Promise) {
        return result.then(
          value => {
            this._recordExit(entryId, enterTimestamp, null, value);
            return value;
          },
          error => {
            this._recordExit(entryId, enterTimestamp, error);
            throw error;
          }
        );
      }

      this._recordExit(entryId, enterTimestamp, null, result);
      return result;

    } catch (error) {
      this._recordExit(entryId, enterTimestamp, error);
      throw error;
    }
  }

  /**
   * Record method exit
   * @private
   */
  _recordExit(entryId, enterTimestamp, error, returnValue) {
    const exitTimestamp = performance.now();

    this._callStack.pop();

    const exitEntry = new TraceEntry({
      id: entryId,
      traceId: this._traceId,
      type: 'exit',
      timestamp: exitTimestamp,
      duration: exitTimestamp - enterTimestamp,
      error: error ? error.message : null,
      returnValue: this._serializeValue(returnValue)
    });

    this._traces.push(exitEntry);
  }

  /**
   * Serialize arguments for storage
   * @private
   * @param {Array} args
   * @returns {string[]}
   */
  _serializeArgs(args) {
    return args.map(arg => this._serializeValue(arg));
  }

  /**
   * Serialize a value for storage
   * @private
   * @param {*} value
   * @returns {string}
   */
  _serializeValue(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';

    const type = typeof value;

    if (type === 'function') {
      return `[Function: ${value.name || 'anonymous'}]`;
    }

    if (type === 'object') {
      if (Array.isArray(value)) {
        return `[Array(${value.length})]`;
      }
      if (value.constructor) {
        return `[${value.constructor.name}]`;
      }
      return '[Object]';
    }

    if (type === 'string') {
      return value.length > 50 ? value.substring(0, 50) + '...' : value;
    }

    return String(value);
  }

  /**
   * Get all traces
   * @returns {TraceEntry[]}
   */
  getTraces() {
    return [...this._traces];
  }

  /**
   * Get traces for a specific class
   * @param {string} className
   * @returns {TraceEntry[]}
   */
  getTracesForClass(className) {
    return this._traces.filter(t => t.className === className);
  }

  /**
   * Get traces for a specific method
   * @param {string} className
   * @param {string} methodName
   * @returns {TraceEntry[]}
   */
  getTracesForMethod(className, methodName) {
    return this._traces.filter(t =>
      t.className === className && t.method === methodName
    );
  }

  /**
   * Build call tree from traces
   * @returns {Object}
   */
  buildCallTree() {
    const roots = [];
    const stack = [];

    for (const trace of this._traces) {
      if (trace.type === 'enter') {
        const node = {
          id: trace.id,
          className: trace.className,
          method: trace.method,
          timestamp: trace.timestamp,
          args: trace.args,
          children: [],
          duration: 0
        };

        if (stack.length === 0) {
          roots.push(node);
        } else {
          stack[stack.length - 1].children.push(node);
        }

        stack.push(node);

      } else if (trace.type === 'exit') {
        const node = stack.pop();
        if (node) {
          node.duration = trace.duration;
          node.error = trace.error;
        }
      }
    }

    return roots;
  }

  /**
   * Get execution statistics
   * @returns {Object}
   */
  getStatistics() {
    const methodStats = new Map();

    for (const trace of this._traces) {
      if (trace.type === 'exit' && trace.duration !== undefined) {
        const key = `${trace.className}.${trace.method}`;

        if (!methodStats.has(key)) {
          methodStats.set(key, {
            className: trace.className,
            method: trace.method,
            callCount: 0,
            totalDuration: 0,
            minDuration: Infinity,
            maxDuration: 0,
            errors: 0
          });
        }

        const stats = methodStats.get(key);
        stats.callCount++;
        stats.totalDuration += trace.duration;
        stats.minDuration = Math.min(stats.minDuration, trace.duration);
        stats.maxDuration = Math.max(stats.maxDuration, trace.duration);
        if (trace.error) stats.errors++;
      }
    }

    // Calculate averages and sort
    const results = [...methodStats.values()]
      .map(s => ({
        ...s,
        avgDuration: s.totalDuration / s.callCount,
        minDuration: s.minDuration === Infinity ? 0 : s.minDuration
      }))
      .sort((a, b) => b.totalDuration - a.totalDuration);

    return {
      totalCalls: this._traces.filter(t => t.type === 'enter').length,
      uniqueMethods: methodStats.size,
      methods: results,
      totalDuration: results.reduce((sum, s) => sum + s.totalDuration, 0)
    };
  }

  /**
   * Export traces to JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      traceId: this._traceId,
      entryCount: this._traces.length,
      traces: this._traces.map(t => ({
        id: t.id,
        traceId: t.traceId,
        type: t.type,
        timestamp: t.timestamp,
        className: t.className,
        method: t.method,
        depth: t.depth,
        args: t.args,
        duration: t.duration,
        error: t.error
      })),
      callTree: this.buildCallTree(),
      statistics: this.getStatistics()
    };
  }
}

// Singleton instance for global tracing
let globalTracer = null;

/**
 * Get or create global tracer instance
 * @returns {RuntimeTracer}
 */
export function getGlobalTracer() {
  if (!globalTracer) {
    globalTracer = new RuntimeTracer();
  }
  return globalTracer;
}

/**
 * Instrument an object using the global tracer
 * @param {Object} instance
 * @param {string} className
 * @returns {Proxy}
 */
export function trace(instance, className) {
  return getGlobalTracer().instrument(instance, className);
}

export default RuntimeTracer;
