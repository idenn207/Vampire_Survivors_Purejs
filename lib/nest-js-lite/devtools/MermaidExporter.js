/**
 * @fileoverview Export dependency graphs as Mermaid diagrams
 * @module nest-js-lite/devtools/MermaidExporter
 */

import { DependencyGraph } from '../utils/DependencyGraph.js';

/**
 * Export dependency graphs to Mermaid diagram format
 */
export class MermaidExporter {
  /**
   * @param {Container|DependencyGraph} source - Container or graph to export
   */
  constructor(source) {
    if (source instanceof DependencyGraph) {
      this._graph = source;
    } else {
      // Assume it's a container
      this._graph = DependencyGraph.fromContainer(source);
    }
  }

  /**
   * Generate a flowchart diagram showing all dependencies
   * @param {Object} [options={}]
   * @param {string} [options.direction='TD'] - Direction: TD, LR, BT, RL
   * @param {boolean} [options.showModules=true] - Group by modules
   * @param {boolean} [options.showScope=false] - Show scope in node labels
   * @returns {string} Mermaid diagram code
   */
  toFlowchart(options = {}) {
    const direction = options.direction || 'TD';
    const showModules = options.showModules !== false;
    const showScope = options.showScope || false;

    const lines = [`flowchart ${direction}`];

    // Group nodes by module
    const moduleGroups = new Map();
    const noModule = [];

    for (const node of this._graph.getNodes()) {
      const moduleName = node.metadata.module;
      if (moduleName && showModules) {
        if (!moduleGroups.has(moduleName)) {
          moduleGroups.set(moduleName, []);
        }
        moduleGroups.get(moduleName).push(node);
      } else {
        noModule.push(node);
      }
    }

    // Render module subgraphs
    for (const [moduleName, nodes] of moduleGroups) {
      lines.push(`    subgraph ${this._sanitizeId(moduleName)}["${moduleName}"]`);
      for (const node of nodes) {
        lines.push(`        ${this._renderNode(node, showScope)}`);
      }
      lines.push('    end');
    }

    // Render nodes without module
    for (const node of noModule) {
      lines.push(`    ${this._renderNode(node, showScope)}`);
    }

    // Render edges
    for (const edge of this._graph.getEdges()) {
      lines.push(`    ${this._sanitizeId(edge.from)} --> ${this._sanitizeId(edge.to)}`);
    }

    return lines.join('\n');
  }

  /**
   * Generate a class diagram showing provider structure
   * @param {Object} [options={}]
   * @returns {string} Mermaid diagram code
   */
  toClassDiagram(options = {}) {
    const lines = ['classDiagram'];

    // Render nodes as classes
    for (const node of this._graph.getNodes()) {
      const id = this._sanitizeId(node.id);
      const scope = node.metadata.scope || 'singleton';
      const priority = node.metadata.priority || 0;

      lines.push(`    class ${id} {`);
      lines.push(`        <<${scope}>>`);
      if (priority !== 0) {
        lines.push(`        +priority: ${priority}`);
      }
      if (node.metadata.tags && node.metadata.tags.length > 0) {
        lines.push(`        +tags: ${node.metadata.tags.join(', ')}`);
      }
      lines.push('    }');
    }

    // Render relationships
    for (const edge of this._graph.getEdges()) {
      const fromId = this._sanitizeId(edge.from);
      const toId = this._sanitizeId(edge.to);
      lines.push(`    ${fromId} --> ${toId} : depends on`);
    }

    return lines.join('\n');
  }

  /**
   * Generate a graph showing module-level dependencies
   * @param {Container} container
   * @returns {string} Mermaid diagram code
   */
  static toModuleGraph(container) {
    const lines = ['flowchart LR'];

    const moduleImports = new Map();

    // Collect module imports
    for (const moduleName of container.getModuleNames()) {
      const module = container.getModule(moduleName);
      moduleImports.set(moduleName, {
        isGlobal: module.isGlobal,
        imports: module.imports
      });
    }

    // Render modules
    for (const [name, info] of moduleImports) {
      const style = info.isGlobal ? '([' + name + '])' : '[' + name + ']';
      lines.push(`    ${name.replace(/Module$/, '')}${style}`);
    }

    // Render import edges
    for (const [name, info] of moduleImports) {
      for (const importName of info.imports) {
        const fromId = name.replace(/Module$/, '');
        const toId = importName.replace(/Module$/, '');
        lines.push(`    ${fromId} --> ${toId}`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Generate a sequence diagram showing initialization order
   * @param {string[]} initOrder - Tokens in initialization order
   * @returns {string} Mermaid diagram code
   */
  static toInitSequence(initOrder) {
    const lines = ['sequenceDiagram'];
    lines.push('    participant Container');

    // Add participants
    const participants = new Set();
    for (const token of initOrder) {
      const short = token.replace(/System$/, 'Sys').replace(/Manager$/, 'Mgr');
      participants.add(short);
      lines.push(`    participant ${short}`);
    }

    // Add initialization calls
    for (const token of initOrder) {
      const short = token.replace(/System$/, 'Sys').replace(/Manager$/, 'Mgr');
      lines.push(`    Container->>+${short}: initialize()`);
      lines.push(`    ${short}-->>-Container: ready`);
    }

    return lines.join('\n');
  }

  /**
   * Generate a subgraph for a specific provider and its dependencies
   * @param {string} token - Root provider token
   * @param {number} [maxDepth=5] - Maximum depth to traverse
   * @returns {string} Mermaid diagram code
   */
  toProviderGraph(token, maxDepth = 5) {
    const subgraph = this._graph.getSubgraph(token, maxDepth);

    const lines = ['flowchart TD'];

    // Highlight root node
    const rootId = this._sanitizeId(token);
    lines.push(`    ${rootId}:::root`);

    // Render nodes
    for (const node of subgraph.getNodes()) {
      if (node.id !== token) {
        lines.push(`    ${this._renderNode(node, false)}`);
      }
    }

    // Render edges
    for (const edge of subgraph.getEdges()) {
      lines.push(`    ${this._sanitizeId(edge.from)} --> ${this._sanitizeId(edge.to)}`);
    }

    // Add styling
    lines.push('    classDef root fill:#f96,stroke:#333,stroke-width:3px');

    return lines.join('\n');
  }

  /**
   * Render a single node
   * @private
   * @param {GraphNode} node
   * @param {boolean} showScope
   * @returns {string}
   */
  _renderNode(node, showScope) {
    const id = this._sanitizeId(node.id);
    let label = node.id;

    if (showScope && node.metadata.scope) {
      label += ` (${node.metadata.scope})`;
    }

    // Use different shapes based on characteristics
    if (node.isEntryPoint) {
      return `${id}[["${label}"]]`; // Double rectangle for entry points
    } else if (node.isLeaf) {
      return `${id}(("${label}"))`; // Circle for leaves
    } else {
      return `${id}["${label}"]`; // Rectangle for normal nodes
    }
  }

  /**
   * Sanitize a string for use as Mermaid ID
   * @private
   * @param {string} str
   * @returns {string}
   */
  _sanitizeId(str) {
    return str.replace(/[^a-zA-Z0-9_]/g, '_');
  }
}

/**
 * Quick export functions
 */

/**
 * Export container dependencies as Mermaid flowchart
 * @param {Container} container
 * @param {Object} [options={}]
 * @returns {string}
 */
export function exportToMermaid(container, options = {}) {
  const exporter = new MermaidExporter(container);
  return exporter.toFlowchart(options);
}

/**
 * Export specific provider's dependency tree as Mermaid
 * @param {Container} container
 * @param {string} token
 * @param {number} [maxDepth=5]
 * @returns {string}
 */
export function exportProviderGraph(container, token, maxDepth = 5) {
  const exporter = new MermaidExporter(container);
  return exporter.toProviderGraph(token, maxDepth);
}

export default MermaidExporter;
