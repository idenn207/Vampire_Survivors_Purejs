/**
 * @fileoverview Dependency graph data structure for visualization and analysis
 * @module nest-js-lite/utils/DependencyGraph
 */

/**
 * Represents a node in the dependency graph
 */
export class GraphNode {
  /**
   * @param {string} id - Unique identifier (token)
   * @param {Object} [metadata={}] - Additional node metadata
   */
  constructor(id, metadata = {}) {
    this.id = id;
    this.metadata = metadata;

    // Connections
    this.dependencies = new Set();   // Nodes this node depends on
    this.dependents = new Set();     // Nodes that depend on this node
  }

  /**
   * Add a dependency
   * @param {GraphNode} node
   */
  addDependency(node) {
    this.dependencies.add(node);
    node.dependents.add(this);
  }

  /**
   * Get dependency count
   * @returns {number}
   */
  get dependencyCount() {
    return this.dependencies.size;
  }

  /**
   * Get dependent count
   * @returns {number}
   */
  get dependentCount() {
    return this.dependents.size;
  }

  /**
   * Check if this is an entry point (no dependents)
   * @returns {boolean}
   */
  get isEntryPoint() {
    return this.dependents.size === 0;
  }

  /**
   * Check if this is a leaf (no dependencies)
   * @returns {boolean}
   */
  get isLeaf() {
    return this.dependencies.size === 0;
  }
}

/**
 * Dependency graph for analyzing and visualizing provider relationships
 */
export class DependencyGraph {
  constructor() {
    this._nodes = new Map();
    this._edges = [];
  }

  /**
   * Build graph from container
   * @param {Container} container
   * @returns {DependencyGraph}
   */
  static fromContainer(container) {
    const graph = new DependencyGraph();

    // Create nodes for all providers
    for (const provider of container.getProviders()) {
      graph.addNode(provider.token, {
        module: provider.module,
        scope: provider.scope,
        priority: provider.priority,
        tags: provider.tags,
        type: provider.type,
        lifecycle: provider.lifecycle
      });
    }

    // Create edges for dependencies
    for (const provider of container.getProviders()) {
      for (const depToken of provider.dependencies) {
        graph.addEdge(provider.token, depToken);
      }
    }

    return graph;
  }

  /**
   * Add a node to the graph
   * @param {string} id
   * @param {Object} [metadata={}]
   * @returns {GraphNode}
   */
  addNode(id, metadata = {}) {
    if (this._nodes.has(id)) {
      return this._nodes.get(id);
    }

    const node = new GraphNode(id, metadata);
    this._nodes.set(id, node);
    return node;
  }

  /**
   * Add an edge between two nodes
   * @param {string} fromId - Dependent node
   * @param {string} toId - Dependency node
   */
  addEdge(fromId, toId) {
    const fromNode = this._nodes.get(fromId);
    const toNode = this._nodes.get(toId);

    if (!fromNode || !toNode) {
      console.warn(`[DependencyGraph] Cannot create edge: missing node (${fromId} -> ${toId})`);
      return;
    }

    fromNode.addDependency(toNode);
    this._edges.push({ from: fromId, to: toId });
  }

  /**
   * Get a node by ID
   * @param {string} id
   * @returns {GraphNode|null}
   */
  getNode(id) {
    return this._nodes.get(id) || null;
  }

  /**
   * Get all nodes
   * @returns {GraphNode[]}
   */
  getNodes() {
    return [...this._nodes.values()];
  }

  /**
   * Get all edges
   * @returns {Object[]}
   */
  getEdges() {
    return [...this._edges];
  }

  /**
   * Get entry points (nodes with no dependents)
   * @returns {GraphNode[]}
   */
  getEntryPoints() {
    return this.getNodes().filter(node => node.isEntryPoint);
  }

  /**
   * Get leaf nodes (nodes with no dependencies)
   * @returns {GraphNode[]}
   */
  getLeaves() {
    return this.getNodes().filter(node => node.isLeaf);
  }

  /**
   * Detect circular dependencies
   * @returns {string[][]} Array of cycles (each cycle is array of node IDs)
   */
  detectCycles() {
    const cycles = [];
    const visited = new Set();
    const recursionStack = new Set();
    const path = [];

    const dfs = (nodeId) => {
      visited.add(nodeId);
      recursionStack.add(nodeId);
      path.push(nodeId);

      const node = this._nodes.get(nodeId);
      if (node) {
        for (const dep of node.dependencies) {
          if (!visited.has(dep.id)) {
            dfs(dep.id);
          } else if (recursionStack.has(dep.id)) {
            // Found a cycle - extract it from path
            const cycleStart = path.indexOf(dep.id);
            const cycle = path.slice(cycleStart).concat(dep.id);
            cycles.push(cycle);
          }
        }
      }

      path.pop();
      recursionStack.delete(nodeId);
    };

    for (const nodeId of this._nodes.keys()) {
      if (!visited.has(nodeId)) {
        dfs(nodeId);
      }
    }

    return cycles;
  }

  /**
   * Topological sort (returns nodes in dependency order)
   * @returns {string[]} Node IDs in order
   * @throws {Error} If circular dependency exists
   */
  topologicalSort() {
    const result = [];
    const visited = new Set();
    const temp = new Set();

    const visit = (nodeId) => {
      if (temp.has(nodeId)) {
        throw new Error(`[DependencyGraph] Circular dependency detected at: ${nodeId}`);
      }
      if (visited.has(nodeId)) {
        return;
      }

      temp.add(nodeId);

      const node = this._nodes.get(nodeId);
      if (node) {
        for (const dep of node.dependencies) {
          visit(dep.id);
        }
      }

      temp.delete(nodeId);
      visited.add(nodeId);
      result.push(nodeId);
    };

    for (const nodeId of this._nodes.keys()) {
      if (!visited.has(nodeId)) {
        visit(nodeId);
      }
    }

    return result;
  }

  /**
   * Get all paths from one node to another
   * @param {string} fromId
   * @param {string} toId
   * @param {number} [maxDepth=10]
   * @returns {string[][]} Array of paths
   */
  findPaths(fromId, toId, maxDepth = 10) {
    const paths = [];

    const dfs = (current, target, path, depth) => {
      if (depth > maxDepth) return;

      path.push(current);

      if (current === target) {
        paths.push([...path]);
      } else {
        const node = this._nodes.get(current);
        if (node) {
          for (const dep of node.dependencies) {
            if (!path.includes(dep.id)) {
              dfs(dep.id, target, path, depth + 1);
            }
          }
        }
      }

      path.pop();
    };

    dfs(fromId, toId, [], 0);
    return paths;
  }

  /**
   * Get subgraph starting from a node
   * @param {string} startId
   * @param {number} [maxDepth=Infinity]
   * @returns {DependencyGraph}
   */
  getSubgraph(startId, maxDepth = Infinity) {
    const subgraph = new DependencyGraph();
    const visited = new Set();

    const traverse = (nodeId, depth) => {
      if (depth > maxDepth || visited.has(nodeId)) return;

      visited.add(nodeId);
      const node = this._nodes.get(nodeId);

      if (node) {
        subgraph.addNode(nodeId, { ...node.metadata });

        for (const dep of node.dependencies) {
          traverse(dep.id, depth + 1);
          subgraph.addEdge(nodeId, dep.id);
        }
      }
    };

    traverse(startId, 0);
    return subgraph;
  }

  /**
   * Get statistics about the graph
   * @returns {Object}
   */
  getStats() {
    const nodes = this.getNodes();

    return {
      nodeCount: nodes.length,
      edgeCount: this._edges.length,
      entryPoints: this.getEntryPoints().map(n => n.id),
      leaves: this.getLeaves().map(n => n.id),
      avgDependencies: nodes.reduce((sum, n) => sum + n.dependencyCount, 0) / nodes.length || 0,
      avgDependents: nodes.reduce((sum, n) => sum + n.dependentCount, 0) / nodes.length || 0,
      maxDependencies: Math.max(...nodes.map(n => n.dependencyCount), 0),
      maxDependents: Math.max(...nodes.map(n => n.dependentCount), 0)
    };
  }
}

export default DependencyGraph;
