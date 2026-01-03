/**
 * @fileoverview Generate Mermaid diagrams from call graphs
 * @module call-flow/visualizer/MermaidGenerator
 */

/**
 * Generate Mermaid diagrams for call flow visualization
 */
export class MermaidGenerator {
  /**
   * @param {CallGraph} graph
   */
  constructor(graph) {
    this._graph = graph;
  }

  /**
   * Generate a sequence diagram for a method's call flow
   * @param {string} className
   * @param {string} methodName
   * @param {Object} [options={}]
   * @returns {string}
   */
  toSequenceDiagram(className, methodName, options = {}) {
    const maxDepth = options.maxDepth || 5;
    const showArgs = options.showArgs || false;

    const chain = this._graph.getCallChain(className, methodName, maxDepth);
    if (!chain) {
      return `sequenceDiagram\n    Note over ${className}: Method not found`;
    }

    const lines = ['sequenceDiagram'];

    // Collect all participants
    const participants = new Set();
    this._collectParticipants(chain, participants);

    // Add participants
    for (const participant of participants) {
      const shortName = this._shortenName(participant);
      lines.push(`    participant ${shortName} as ${participant}`);
    }

    // Add calls
    this._addSequenceCalls(lines, chain, null, options);

    return lines.join('\n');
  }

  /**
   * Collect all participants from a call chain
   * @private
   */
  _collectParticipants(chain, participants) {
    participants.add(chain.class);

    for (const child of chain.children || []) {
      if (child.class && !child.external) {
        this._collectParticipants(child, participants);
      } else if (child.external) {
        participants.add(child.class);
      }
    }
  }

  /**
   * Add sequence diagram calls recursively
   * @private
   */
  _addSequenceCalls(lines, node, parent, options) {
    if (!node || node.recursive || node.truncated) {
      return;
    }

    const currentActor = this._shortenName(node.class);

    if (parent) {
      const parentActor = this._shortenName(parent.class);

      if (node.external) {
        // External call - different actor
        lines.push(`    ${parentActor}->>+${currentActor}: ${node.method}()`);
      } else if (node.class === parent.class) {
        // Internal call - same actor, use self-reference
        lines.push(`    ${parentActor}->>+${parentActor}: ${node.method}()`);
      }
    }

    // Process children
    for (const child of node.children || []) {
      this._addSequenceCalls(lines, child, node, options);
    }

    // Add return if we entered
    if (parent && node.external) {
      const parentActor = this._shortenName(parent.class);
      lines.push(`    ${currentActor}-->>-${parentActor}: `);
    } else if (parent && node.class === parent.class) {
      lines.push(`    ${currentActor}-->>-${currentActor}: `);
    }
  }

  /**
   * Generate a flowchart for a class's internal call structure
   * @param {string} className
   * @param {Object} [options={}]
   * @returns {string}
   */
  toFlowchart(className, options = {}) {
    const direction = options.direction || 'TD';
    const showExternal = options.showExternal !== false;

    const classNode = this._graph.getClass(className);
    if (!classNode) {
      return `flowchart ${direction}\n    note["Class not found: ${className}"]`;
    }

    const lines = [`flowchart ${direction}`];

    // Style definitions
    lines.push('    classDef entry fill:#4CAF50,stroke:#333,stroke-width:2px,color:#fff');
    lines.push('    classDef private fill:#9E9E9E,stroke:#333');
    lines.push('    classDef external fill:#2196F3,stroke:#333,color:#fff');
    lines.push('    classDef event fill:#FF9800,stroke:#333');

    // Add class title
    lines.push(`    subgraph ${className}`);

    // Add method nodes
    const addedNodes = new Set();

    for (const method of classNode.getMethods()) {
      if (method.isConstructor) continue;

      const nodeId = this._sanitizeId(method.name);
      const nodeShape = method.isEntryPoint
        ? `${nodeId}[["${method.name}"]]`
        : (method.isPrivate
          ? `${nodeId}(["${method.name}"])`
          : `${nodeId}["${method.name}"]`);

      lines.push(`        ${nodeShape}`);
      addedNodes.add(nodeId);

      // Add class for styling
      if (method.isEntryPoint) {
        lines.push(`        class ${nodeId} entry`);
      } else if (method.isPrivate) {
        lines.push(`        class ${nodeId} private`);
      }
    }

    lines.push('    end');

    // Add edges for internal calls
    for (const method of classNode.getMethods()) {
      const fromId = this._sanitizeId(method.name);

      for (const call of method.calls) {
        if (call.type === 'internal') {
          const toId = this._sanitizeId(call.target);
          if (addedNodes.has(toId)) {
            lines.push(`    ${fromId} --> ${toId}`);
          }
        }
      }
    }

    // Add external calls if enabled
    if (showExternal) {
      const externals = new Set();

      for (const method of classNode.getMethods()) {
        const fromId = this._sanitizeId(method.name);

        for (const call of method.calls) {
          if (call.type === 'external') {
            const extId = this._sanitizeId(`ext_${call.dependency}_${call.method}`);
            const extLabel = `${call.dependency}.${call.method}()`;

            if (!externals.has(extId)) {
              lines.push(`    ${extId}["${extLabel}"]`);
              lines.push(`    class ${extId} external`);
              externals.add(extId);
            }

            lines.push(`    ${fromId} -.-> ${extId}`);
          } else if (call.type === 'event_emit') {
            const eventId = this._sanitizeId(`event_${call.event}`);
            const eventLabel = `emit('${call.event}')`;

            if (!externals.has(eventId)) {
              lines.push(`    ${eventId}{{"${eventLabel}"}}`);
              lines.push(`    class ${eventId} event`);
              externals.add(eventId);
            }

            lines.push(`    ${fromId} -.-> ${eventId}`);
          }
        }
      }
    }

    return lines.join('\n');
  }

  /**
   * Generate a call tree diagram
   * @param {string} className
   * @param {string} methodName
   * @param {Object} [options={}]
   * @returns {string}
   */
  toCallTree(className, methodName, options = {}) {
    const maxDepth = options.maxDepth || 5;
    const chain = this._graph.getCallChain(className, methodName, maxDepth);

    if (!chain) {
      return `flowchart TD\n    note["Method not found"]`;
    }

    const lines = ['flowchart TD'];
    lines.push('    classDef root fill:#E91E63,stroke:#333,stroke-width:3px,color:#fff');
    lines.push('    classDef internal fill:#4CAF50,stroke:#333');
    lines.push('    classDef external fill:#2196F3,stroke:#333,color:#fff');
    lines.push('    classDef recursive fill:#FF5722,stroke:#333');

    let nodeCounter = 0;
    const getNodeId = () => `n${nodeCounter++}`;

    const addNode = (node, parentId) => {
      const nodeId = getNodeId();
      let label = node.method || 'unknown';
      let nodeClass = 'internal';

      if (node.external) {
        label = `${node.class}.${node.method}()`;
        nodeClass = 'external';
      } else if (node.recursive) {
        label = `${node.method} [recursive]`;
        nodeClass = 'recursive';
      } else if (node.truncated) {
        label = `${node.method} [...]`;
      }

      lines.push(`    ${nodeId}["${label}"]`);

      if (parentId === null) {
        lines.push(`    class ${nodeId} root`);
      } else {
        lines.push(`    class ${nodeId} ${nodeClass}`);
        lines.push(`    ${parentId} --> ${nodeId}`);
      }

      // Process children
      if (!node.recursive && !node.truncated && node.children) {
        for (const child of node.children) {
          addNode(child, nodeId);
        }
      }
    };

    addNode(chain, null);

    return lines.join('\n');
  }

  /**
   * Generate overview of all entry points and their call depths
   * @param {Object} [options={}]
   * @returns {string}
   */
  toEntryPointOverview(options = {}) {
    const lines = ['flowchart LR'];
    lines.push('    classDef lifecycle fill:#4CAF50,stroke:#333,color:#fff');
    lines.push('    classDef update fill:#2196F3,stroke:#333,color:#fff');
    lines.push('    classDef render fill:#9C27B0,stroke:#333,color:#fff');
    lines.push('    classDef event fill:#FF9800,stroke:#333');

    const entryPoints = this._graph.findAllEntryPoints();

    // Group by class
    const byClass = {};
    for (const ep of entryPoints) {
      if (!byClass[ep.class]) {
        byClass[ep.class] = [];
      }
      byClass[ep.class].push(ep);
    }

    // Create subgraphs per class
    for (const [className, methods] of Object.entries(byClass)) {
      const classId = this._sanitizeId(className);
      lines.push(`    subgraph ${classId}["${className}"]`);

      for (const ep of methods) {
        const methodId = this._sanitizeId(`${className}_${ep.method}`);
        lines.push(`        ${methodId}["${ep.method}"]`);

        // Categorize and style
        if (['update', 'render', 'initialize', 'dispose'].includes(ep.method)) {
          if (ep.method === 'update') {
            lines.push(`        class ${methodId} update`);
          } else if (ep.method === 'render') {
            lines.push(`        class ${methodId} render`);
          } else {
            lines.push(`        class ${methodId} lifecycle`);
          }
        }
      }

      lines.push('    end');
    }

    return lines.join('\n');
  }

  /**
   * Shorten a class/actor name for sequence diagrams
   * @private
   */
  _shortenName(name) {
    return name
      .replace(/System$/, 'Sys')
      .replace(/Manager$/, 'Mgr')
      .replace(/Component$/, 'Comp')
      .replace(/Behavior$/, 'Bhv');
  }

  /**
   * Sanitize string for Mermaid ID
   * @private
   */
  _sanitizeId(str) {
    return str.replace(/[^a-zA-Z0-9_]/g, '_');
  }
}

export default MermaidGenerator;
