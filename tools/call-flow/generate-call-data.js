#!/usr/bin/env node
/**
 * @fileoverview Generate call-data.js by analyzing all source files
 * @module call-flow/generate-call-data
 *
 * Run: node tools/call-flow/generate-call-data.js
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

/**
 * Find all JavaScript files in a directory recursively
 */
function findJsFiles(dir, files = []) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, v1, and tool directories
      if (!['node_modules', 'v1', 'tools', 'lib', 'docs'].includes(entry)) {
        findJsFiles(fullPath, files);
      }
    } else if (entry.endsWith('.js') && !entry.includes('.min.')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Parse class definition from source
 */
function parseClass(source, filePath) {
  const classes = [];

  // Find class definitions
  const classPattern = /class\s+(\w+)(?:\s+extends\s+(\w+))?\s*\{/g;
  let match;

  while ((match = classPattern.exec(source)) !== null) {
    const className = match[1];
    const extendsClass = match[2] || null;
    const classStartIndex = match.index + match[0].length - 1;
    const classEndIndex = findMatchingBrace(source, classStartIndex);

    if (classEndIndex === -1) continue;

    const classBody = source.substring(classStartIndex, classEndIndex + 1);
    const classStartLine = getLineNumber(source, match.index);

    // Determine namespace from file path
    const namespace = determineNamespace(filePath);

    const classData = {
      name: className,
      namespace,
      file: relative(projectRoot, filePath),
      extends: extendsClass,
      dependencies: new Set(),
      methods: {},
      emitsEvents: [],
      listensToEvents: []
    };

    // Extract methods
    const methods = extractMethods(classBody, classStartLine);

    for (const method of methods) {
      const methodData = {
        isPrivate: method.name.startsWith('_'),
        params: method.params,
        lineNumber: method.lineNumber,
        calls: [],
        calledBy: []
      };

      // Parse method calls
      const calls = parseMethodCalls(method.body);
      const events = parseEvents(method.body);

      for (const call of calls) {
        methodData.calls.push(call);
        if (call.type === 'external' && call.dependency) {
          classData.dependencies.add(call.dependency);
        }
      }

      for (const event of events) {
        methodData.calls.push(event);
        if (event.type === 'event_emit') {
          classData.emitsEvents.push(event.event);
        } else {
          classData.listensToEvents.push(event.event);
        }
      }

      classData.methods[method.name] = methodData;
    }

    // Convert Set to Array for dependencies
    classData.dependencies = [...classData.dependencies];

    classes.push(classData);
  }

  return classes;
}

/**
 * Determine namespace from file path
 */
function determineNamespace(filePath) {
  const relPath = relative(projectRoot, filePath);

  if (relPath.startsWith('src/systems/combat/')) return 'VampireSurvivors.Systems.Combat';
  if (relPath.startsWith('src/systems/levelup/')) return 'VampireSurvivors.Systems.LevelUp';
  if (relPath.startsWith('src/systems/')) return 'VampireSurvivors.Systems';
  if (relPath.startsWith('src/components/')) return 'VampireSurvivors.Components';
  if (relPath.startsWith('src/entities/')) return 'VampireSurvivors.Entities';
  if (relPath.startsWith('src/behaviors/')) return 'VampireSurvivors.Behaviors';
  if (relPath.startsWith('src/managers/')) return 'VampireSurvivors.Managers';
  if (relPath.startsWith('src/core/')) return 'VampireSurvivors.Core';
  if (relPath.startsWith('src/ui/')) return 'VampireSurvivors.UI';
  if (relPath.startsWith('src/data/')) return 'VampireSurvivors.Data';
  if (relPath.startsWith('src/pool/')) return 'VampireSurvivors.Pool';
  if (relPath.startsWith('src/debug/')) return 'VampireSurvivors.Debug';

  return 'VampireSurvivors';
}

/**
 * Extract methods from class body
 */
function extractMethods(classBody, classStartLine) {
  const methods = [];

  // Match method definitions
  const methodPattern = /(?:async\s+)?(?:get\s+|set\s+)?(\w+)\s*\(([^)]*)\)\s*\{/g;
  let match;

  while ((match = methodPattern.exec(classBody)) !== null) {
    const methodName = match[1];

    // Skip control flow keywords
    if (['if', 'for', 'while', 'switch', 'catch', 'function', 'new'].includes(methodName)) {
      continue;
    }

    const startIndex = match.index + match[0].length - 1;
    const endIndex = findMatchingBrace(classBody, startIndex);

    if (endIndex === -1) continue;

    const methodBody = classBody.substring(startIndex, endIndex + 1);
    const lineNumber = classStartLine + getLineNumber(classBody.substring(0, match.index), 0) - 1;

    methods.push({
      name: methodName,
      params: parseParams(match[2]),
      body: methodBody,
      lineNumber
    });
  }

  return methods;
}

/**
 * Parse method calls from method body
 */
function parseMethodCalls(methodBody) {
  const calls = [];
  const seen = new Set();

  // First, find all external calls: this._dependency.method()
  // This catches patterns like this._entityManager.getByTag()
  const externalPattern = /this\.(_\w+)\.(\w+)\s*\(/g;
  let match;

  while ((match = externalPattern.exec(methodBody)) !== null) {
    const dependency = match[1];
    const method = match[2];

    // Skip 'this' itself
    if (dependency === 'this') continue;

    const key = `external:${dependency}:${method}`;
    if (!seen.has(key)) {
      seen.add(key);
      calls.push({ type: 'external', dependency, method });
    }
  }

  // Internal calls: this.methodName() where methodName is NOT followed by .something
  // Matches: this.update(), this._privateMethod()
  // Does NOT match: this._player.getComponent() (that's external)
  const internalPattern = /this\.(_?\w+)\s*\(/g;

  while ((match = internalPattern.exec(methodBody)) !== null) {
    const target = match[1];

    // Check the context - look backwards to ensure this isn't part of this.dep.method pattern
    const beforeIndex = Math.max(0, match.index - 50);
    const beforeText = methodBody.substring(beforeIndex, match.index);

    // Skip if this looks like part of a chain (e.g., this._player.method is calling this._player)
    // Already captured as external dependency above

    // Check if this method is being called on a property (external call)
    // Pattern: this._property.method() - the _property part will match
    // We need to check if there's a . after this._property
    const afterCallStart = match.index + match[0].length - 1; // position after (
    const checkIndex = match.index + 5 + target.length; // position after this.target
    const textAtCheck = methodBody.substring(match.index, checkIndex + 5);

    // If the pattern is this.target.method( then skip (it's external, not internal)
    if (textAtCheck.match(/^this\._?\w+\.\w+\s*\(/)) {
      continue;
    }

    const key = `internal:${target}`;
    if (!seen.has(key)) {
      seen.add(key);
      calls.push({ type: 'internal', target });
    }
  }

  // Local variable calls: variable.method() - captures entity.getComponent(), etc
  const localPattern = /\b([a-z][a-zA-Z0-9_]*)\.(\w+)\s*\(/g;

  while ((match = localPattern.exec(methodBody)) !== null) {
    const dependency = match[1];
    const method = match[2];

    // Skip 'this'
    if (dependency === 'this') continue;

    // Skip built-ins and common patterns
    const skipList = ['console', 'Math', 'JSON', 'Object', 'Array', 'String', 'Number',
                      'Date', 'Promise', 'Set', 'Map', 'window', 'document', 'Error',
                      'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
                      'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'ctx', 'result',
                      'options', 'config', 'params', 'args', 'data', 'event', 'evt',
                      'callback', 'cb', 'fn', 'func', 'handler', 'listener', 'self'];
    if (skipList.includes(dependency)) continue;

    // Skip loop variables and common short names
    if (['i', 'j', 'k', 'x', 'y', 'z', 'n', 'a', 'b', 'c', 'el', 'e', 'err', 'dx', 'dy'].includes(dependency)) continue;

    // Only include meaningful dependencies (entities, components, systems, etc)
    const meaningfulPatterns = ['entity', 'player', 'enemy', 'boss', 'weapon', 'projectile',
                                'component', 'transform', 'sprite', 'collider', 'health',
                                'behavior', 'system', 'manager', 'pool', 'target', 'source',
                                'pickup', 'mine', 'summon', 'area', 'effect', 'buff', 'debuff'];
    const isLikelyMeaningful = meaningfulPatterns.some(p =>
      dependency.toLowerCase().includes(p) ||
      dependency.startsWith('_')
    );

    if (!isLikelyMeaningful && dependency.length < 4) continue;

    const key = `external:${dependency}:${method}`;
    if (!seen.has(key)) {
      seen.add(key);
      calls.push({ type: 'external', dependency, method });
    }
  }

  // Static/Data calls: ClassName.method() (only key data/registry/pool classes)
  const staticPattern = /\b([A-Z]\w*(?:Data|Registry|Config|Pool|Manager|Behavior|System))\.([\w]+)\s*\(/g;

  while ((match = staticPattern.exec(methodBody)) !== null) {
    const dependency = match[1];
    const method = match[2];

    const key = `external:${dependency}:${method}`;
    if (!seen.has(key)) {
      seen.add(key);
      calls.push({ type: 'external', dependency, method });
    }
  }

  return calls;
}

/**
 * Parse event emissions and subscriptions
 */
function parseEvents(methodBody) {
  const events = [];
  const seen = new Set();

  // Event emit: events.emit('event:name')
  const emitPattern = /(?:events|this\._?events)\.emit\s*\(\s*['"]([^'"]+)['"]/g;
  let match;

  while ((match = emitPattern.exec(methodBody)) !== null) {
    const key = `emit:${match[1]}`;
    if (!seen.has(key)) {
      seen.add(key);
      events.push({ type: 'event_emit', event: match[1] });
    }
  }

  // Event listen: events.on('event:name')
  const listenPattern = /(?:events|this\._?events)\.(?:on|once)\s*\(\s*['"]([^'"]+)['"]/g;

  while ((match = listenPattern.exec(methodBody)) !== null) {
    const key = `listen:${match[1]}`;
    if (!seen.has(key)) {
      seen.add(key);
      events.push({ type: 'event_listen', event: match[1] });
    }
  }

  return events;
}

/**
 * Parse parameter list
 */
function parseParams(paramsStr) {
  if (!paramsStr.trim()) return [];

  return paramsStr
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => {
      const eqIndex = p.indexOf('=');
      if (eqIndex !== -1) {
        return p.substring(0, eqIndex).trim();
      }
      // Handle destructuring
      if (p.startsWith('{') || p.startsWith('[')) {
        return p;
      }
      return p;
    });
}

/**
 * Find matching closing brace
 */
function findMatchingBrace(source, startIndex) {
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
      if (inComment) continue;
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
      if (inString) continue;
    }

    // Count braces
    if (char === '{') depth++;
    else if (char === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }

  return -1;
}

/**
 * Get line number at position
 */
function getLineNumber(source, position) {
  const upToPosition = source.substring(0, position);
  return (upToPosition.match(/\n/g) || []).length + 1;
}

/**
 * Link internal calls between methods
 */
function linkCalledBy(classes) {
  for (const classData of Object.values(classes)) {
    for (const [methodName, methodData] of Object.entries(classData.methods)) {
      for (const call of methodData.calls) {
        if (call.type === 'internal') {
          const targetMethod = classData.methods[call.target];
          if (targetMethod && !targetMethod.calledBy.includes(methodName)) {
            targetMethod.calledBy.push(methodName);
          }
        }
      }
    }
  }
}

/**
 * Build events index
 */
function buildEventsIndex(classes) {
  const events = {};

  for (const [className, classData] of Object.entries(classes)) {
    for (const [methodName, methodData] of Object.entries(classData.methods)) {
      for (const call of methodData.calls) {
        if (call.type === 'event_emit') {
          if (!events[call.event]) {
            events[call.event] = { emitters: [], listeners: [] };
          }
          events[call.event].emitters.push({ class: className, method: methodName });
        } else if (call.type === 'event_listen') {
          if (!events[call.event]) {
            events[call.event] = { emitters: [], listeners: [] };
          }
          events[call.event].listeners.push({ class: className, method: methodName });
        }
      }
    }
  }

  return events;
}

/**
 * Calculate statistics
 */
function calculateStats(classes, events) {
  let methodCount = 0;
  let callCount = 0;

  for (const classData of Object.values(classes)) {
    methodCount += Object.keys(classData.methods).length;
    for (const methodData of Object.values(classData.methods)) {
      callCount += methodData.calls.length;
    }
  }

  const classCount = Object.keys(classes).length;

  return {
    classCount,
    methodCount,
    callCount,
    eventCount: Object.keys(events).length,
    avgMethodsPerClass: classCount > 0 ? Math.round(methodCount / classCount * 10) / 10 : 0,
    avgCallsPerMethod: methodCount > 0 ? Math.round(callCount / methodCount * 100) / 100 : 0
  };
}

/**
 * Main entry point
 */
function main() {
  console.log('Analyzing source files...\n');

  const srcDir = join(projectRoot, 'src');
  const files = findJsFiles(srcDir);

  console.log(`Found ${files.length} JavaScript files\n`);

  const allClasses = {};
  let parsedCount = 0;

  for (const filePath of files) {
    try {
      const source = readFileSync(filePath, 'utf-8');
      const classes = parseClass(source, filePath);

      for (const classData of classes) {
        allClasses[classData.name] = {
          namespace: classData.namespace,
          file: classData.file,
          extends: classData.extends,
          dependencies: classData.dependencies,
          methods: classData.methods
        };
        parsedCount++;
      }
    } catch (err) {
      console.warn(`Warning: Could not parse ${relative(projectRoot, filePath)}: ${err.message}`);
    }
  }

  console.log(`Parsed ${parsedCount} classes\n`);

  // Link calledBy references
  linkCalledBy(allClasses);

  // Build events index
  const events = buildEventsIndex(allClasses);

  // Calculate statistics
  const stats = calculateStats(allClasses, events);

  // Generate output
  const output = `/**
 * @fileoverview Pre-analyzed call graph data
 * @module call-flow/data/call-data
 *
 * Auto-generated by: node tools/call-flow/generate-call-data.js
 * Generated at: ${new Date().toISOString()}
 *
 * Classes: ${stats.classCount}
 * Methods: ${stats.methodCount}
 * Calls: ${stats.callCount}
 * Events: ${stats.eventCount}
 */

export const callData = ${JSON.stringify({ classes: allClasses, events, stats }, null, 2)};

export default callData;
`;

  const outputPath = join(__dirname, 'data', 'call-data.js');
  writeFileSync(outputPath, output, 'utf-8');

  console.log('Generated call-data.js');
  console.log(`  Classes: ${stats.classCount}`);
  console.log(`  Methods: ${stats.methodCount}`);
  console.log(`  Calls: ${stats.callCount}`);
  console.log(`  Events: ${stats.eventCount}`);
  console.log(`  Avg methods/class: ${stats.avgMethodsPerClass}`);
  console.log(`  Avg calls/method: ${stats.avgCallsPerMethod}`);
  console.log(`\nOutput: ${relative(projectRoot, outputPath)}`);
}

main();
