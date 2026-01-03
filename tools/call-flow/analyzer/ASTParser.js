/**
 * @fileoverview Simple AST parser for extracting method calls from JavaScript source
 * @module call-flow/analyzer/ASTParser
 *
 * Uses regex-based parsing to extract:
 * - Class definitions
 * - Method definitions
 * - Internal method calls (this.methodName())
 * - External method calls (this._dependency.method())
 * - Event emissions (events.emit('event'))
 * - Event subscriptions (events.on('event'))
 */

import { CallGraph, ClassNode, MethodNode, MethodCall } from './CallGraph.js';

/**
 * Parser for extracting call relationships from JavaScript source
 */
export class ASTParser {
  constructor() {
    this._currentClass = null;
    this._currentMethod = null;
  }

  /**
   * Parse JavaScript source and extract call information
   * @param {string} source - JavaScript source code
   * @param {Object} [config={}]
   * @param {string} [config.className] - Expected class name
   * @param {string} [config.file] - Source file path
   * @param {string} [config.namespace] - Namespace
   * @returns {ClassNode|null}
   */
  parseClass(source, config = {}) {
    // Find class definition
    const classMatch = this._findClassDefinition(source, config.className);
    if (!classMatch) {
      return null;
    }

    const classNode = new ClassNode(classMatch.name, {
      namespace: config.namespace || '',
      file: config.file || '',
      extends: classMatch.extends
    });

    // Extract methods
    const methods = this._extractMethods(classMatch.body, classMatch.startLine);

    for (const methodInfo of methods) {
      const methodNode = new MethodNode(methodInfo.name, {
        params: methodInfo.params,
        lineNumber: methodInfo.lineNumber,
        endLineNumber: methodInfo.endLineNumber
      });

      // Parse method body for calls
      const calls = this._parseMethodCalls(methodInfo.body);

      for (const call of calls) {
        methodNode.addCall(call);

        // Track dependencies
        if (call.type === 'external' && call.dependency) {
          classNode.dependencies.add(call.dependency);
        }
      }

      // Parse events
      const events = this._parseEvents(methodInfo.body);
      for (const event of events) {
        methodNode.addCall(event);
        if (event.type === 'event_emit') {
          classNode.emitsEvents.push(event.event);
        } else {
          classNode.listensToEvents.push(event.event);
        }
      }

      classNode.addMethod(methodNode);
    }

    return classNode;
  }

  /**
   * Parse multiple classes from source
   * @param {string} source
   * @param {Object} [config={}]
   * @returns {ClassNode[]}
   */
  parseAllClasses(source, config = {}) {
    const classes = [];
    const classPattern = /class\s+(\w+)(?:\s+extends\s+(\w+))?\s*\{/g;
    let match;

    while ((match = classPattern.exec(source)) !== null) {
      const classNode = this.parseClass(source, {
        ...config,
        className: match[1]
      });

      if (classNode) {
        classes.push(classNode);
      }
    }

    return classes;
  }

  /**
   * Find class definition in source
   * @private
   * @param {string} source
   * @param {string} [expectedName]
   * @returns {Object|null}
   */
  _findClassDefinition(source, expectedName) {
    const pattern = expectedName
      ? new RegExp(`class\\s+(${expectedName})(?:\\s+extends\\s+(\\w+))?\\s*\\{`)
      : /class\s+(\w+)(?:\s+extends\s+(\w+))?\s*\{/;

    const match = pattern.exec(source);
    if (!match) {
      return null;
    }

    const startIndex = match.index + match[0].length - 1;
    const startLine = this._getLineNumber(source, match.index);
    const endIndex = this._findMatchingBrace(source, startIndex);

    if (endIndex === -1) {
      return null;
    }

    return {
      name: match[1],
      extends: match[2] || null,
      body: source.substring(startIndex, endIndex + 1),
      startLine
    };
  }

  /**
   * Extract methods from class body
   * @private
   * @param {string} classBody
   * @param {number} classStartLine
   * @returns {Object[]}
   */
  _extractMethods(classBody, classStartLine) {
    const methods = [];

    // Match method definitions: methodName(params) { ... }
    // Also match get/set accessors and async methods
    const methodPattern = /(?:async\s+)?(?:get\s+|set\s+)?(\w+)\s*\(([^)]*)\)\s*\{/g;
    let match;

    while ((match = methodPattern.exec(classBody)) !== null) {
      const methodName = match[1];

      // Skip if it's a keyword being used as an identifier somehow
      if (['if', 'for', 'while', 'switch', 'catch', 'function'].includes(methodName)) {
        continue;
      }

      const startIndex = match.index + match[0].length - 1;
      const endIndex = this._findMatchingBrace(classBody, startIndex);

      if (endIndex === -1) {
        continue;
      }

      const methodBody = classBody.substring(startIndex, endIndex + 1);
      const lineNumber = classStartLine + this._getLineNumber(classBody.substring(0, match.index), 0) - 1;

      methods.push({
        name: methodName,
        params: this._parseParams(match[2]),
        body: methodBody,
        lineNumber,
        endLineNumber: lineNumber + this._countLines(methodBody)
      });
    }

    return methods;
  }

  /**
   * Parse method calls from method body
   * @private
   * @param {string} methodBody
   * @returns {MethodCall[]}
   */
  _parseMethodCalls(methodBody) {
    const calls = [];

    // Internal calls: this.methodName() or this.methodName(...)
    const internalPattern = /this\.(_?\w+)\s*\(/g;
    let match;

    while ((match = internalPattern.exec(methodBody)) !== null) {
      const target = match[1];

      // Skip if it looks like property access followed by method call
      // e.g., this._player.getComponent() should be external, not internal
      const beforeMatch = methodBody.substring(Math.max(0, match.index - 1), match.index);
      const afterMatch = methodBody.substring(match.index + match[0].length);

      // Check if this is actually accessing a property's method
      // Look ahead to see if there's another method call
      if (!afterMatch.startsWith(')') && afterMatch.match(/^\s*\)/)) {
        // This is a simple internal call
        calls.push(new MethodCall({
          type: 'internal',
          target,
          lineNumber: this._getLineNumber(methodBody, match.index)
        }));
      } else {
        // Could be internal or property access
        calls.push(new MethodCall({
          type: 'internal',
          target,
          lineNumber: this._getLineNumber(methodBody, match.index)
        }));
      }
    }

    // External calls: this._dependency.method() or this._dependency.method(...)
    const externalPattern = /this\.(_?\w+)\.(\w+)\s*\(/g;

    while ((match = externalPattern.exec(methodBody)) !== null) {
      const dependency = match[1];
      const method = match[2];

      calls.push(new MethodCall({
        type: 'external',
        dependency,
        method,
        lineNumber: this._getLineNumber(methodBody, match.index)
      }));
    }

    // Also match: dependency.method() where dependency is a local variable
    // Pattern: variableName.method() but not this.xxx or common built-ins
    const localExternalPattern = /(?<!this\.)(?<![.\w])(\w+)\.(\w+)\s*\(/g;

    while ((match = localExternalPattern.exec(methodBody)) !== null) {
      const dependency = match[1];
      const method = match[2];

      // Skip common built-ins and primitives
      const skipList = ['console', 'Math', 'JSON', 'Object', 'Array', 'String', 'Number', 'Date', 'Promise', 'Set', 'Map', 'window', 'document'];
      if (skipList.includes(dependency)) {
        continue;
      }

      // Skip if dependency starts with uppercase (likely a class, not instance)
      if (dependency[0] === dependency[0].toUpperCase() && dependency[0] !== '_') {
        // Check if it's a known data access pattern like EnemyData.selectRandomType
        if (dependency.endsWith('Data') || dependency.endsWith('Registry')) {
          calls.push(new MethodCall({
            type: 'external',
            dependency,
            method,
            lineNumber: this._getLineNumber(methodBody, match.index)
          }));
        }
        continue;
      }

      calls.push(new MethodCall({
        type: 'external',
        dependency,
        method,
        lineNumber: this._getLineNumber(methodBody, match.index)
      }));
    }

    return calls;
  }

  /**
   * Parse event emissions and subscriptions
   * @private
   * @param {string} methodBody
   * @returns {MethodCall[]}
   */
  _parseEvents(methodBody) {
    const events = [];

    // Event emit: events.emit('event:name', ...) or this._events.emit(...)
    const emitPattern = /(?:events|this\._?events)\.emit\s*\(\s*['"]([^'"]+)['"]/g;
    let match;

    while ((match = emitPattern.exec(methodBody)) !== null) {
      events.push(new MethodCall({
        type: 'event_emit',
        event: match[1],
        lineNumber: this._getLineNumber(methodBody, match.index)
      }));
    }

    // Event listen: events.on('event:name', ...) or events.once(...)
    const listenPattern = /(?:events|this\._?events)\.(?:on|once)\s*\(\s*['"]([^'"]+)['"]/g;

    while ((match = listenPattern.exec(methodBody)) !== null) {
      events.push(new MethodCall({
        type: 'event_listen',
        event: match[1],
        lineNumber: this._getLineNumber(methodBody, match.index)
      }));
    }

    return events;
  }

  /**
   * Parse parameter list
   * @private
   * @param {string} paramsStr
   * @returns {string[]}
   */
  _parseParams(paramsStr) {
    if (!paramsStr.trim()) {
      return [];
    }

    return paramsStr
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => {
        // Handle default values: param = defaultValue
        const eqIndex = p.indexOf('=');
        if (eqIndex !== -1) {
          return p.substring(0, eqIndex).trim();
        }
        return p;
      });
  }

  /**
   * Find matching closing brace
   * @private
   * @param {string} source
   * @param {number} startIndex - Index of opening brace
   * @returns {number} Index of closing brace, or -1 if not found
   */
  _findMatchingBrace(source, startIndex) {
    let depth = 1;
    let inString = false;
    let stringChar = '';
    let inComment = false;
    let commentType = '';

    for (let i = startIndex + 1; i < source.length; i++) {
      const char = source[i];
      const prevChar = i > 0 ? source[i - 1] : '';
      const nextChar = i < source.length - 1 ? source[i + 1] : '';

      // Handle comments
      if (!inString) {
        if (!inComment && char === '/' && nextChar === '/') {
          inComment = true;
          commentType = 'line';
          continue;
        }
        if (!inComment && char === '/' && nextChar === '*') {
          inComment = true;
          commentType = 'block';
          continue;
        }
        if (inComment && commentType === 'line' && char === '\n') {
          inComment = false;
          continue;
        }
        if (inComment && commentType === 'block' && prevChar === '*' && char === '/') {
          inComment = false;
          continue;
        }
        if (inComment) {
          continue;
        }
      }

      // Handle strings
      if (!inComment) {
        if (!inString && (char === '"' || char === "'" || char === '`')) {
          inString = true;
          stringChar = char;
          continue;
        }
        if (inString && char === stringChar && prevChar !== '\\') {
          inString = false;
          continue;
        }
        if (inString) {
          continue;
        }
      }

      // Count braces
      if (char === '{') {
        depth++;
      } else if (char === '}') {
        depth--;
        if (depth === 0) {
          return i;
        }
      }
    }

    return -1;
  }

  /**
   * Get line number at position
   * @private
   * @param {string} source
   * @param {number} position
   * @returns {number}
   */
  _getLineNumber(source, position) {
    const upToPosition = source.substring(0, position);
    return (upToPosition.match(/\n/g) || []).length + 1;
  }

  /**
   * Count lines in string
   * @private
   * @param {string} str
   * @returns {number}
   */
  _countLines(str) {
    return (str.match(/\n/g) || []).length + 1;
  }
}

/**
 * Build a complete call graph from multiple source files
 * @param {Object[]} sources - Array of { content, file, namespace, className }
 * @returns {CallGraph}
 */
export function buildCallGraph(sources) {
  const graph = new CallGraph();
  const parser = new ASTParser();

  for (const source of sources) {
    const classNode = parser.parseClass(source.content, {
      className: source.className,
      file: source.file,
      namespace: source.namespace
    });

    if (classNode) {
      graph.addClass(classNode);
    }
  }

  // Link internal calls
  graph.linkInternalCalls();

  return graph;
}

export default ASTParser;
