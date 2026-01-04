/**
 * @fileoverview Interactive call tree renderer
 * @module call-flow/visualizer/CallTreeRenderer
 */

/**
 * Renders an interactive call tree in the DOM
 */
export class CallTreeRenderer {
  /**
   * @param {HTMLElement} container - Container element
   * @param {Object} [options={}]
   */
  constructor(container, options = {}) {
    this._container = container;
    this._options = {
      indentSize: 20,
      collapsible: true,
      showLineNumbers: true,
      showDuration: false,
      onNodeClick: null,
      ...options
    };

    this._expandedNodes = new Set();
  }

  /**
   * Render a call chain tree
   * @param {Object} tree - Call chain from CallGraph.getCallChain()
   */
  render(tree) {
    this._container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'call-tree';

    const rootNode = this._renderNode(tree, 0);
    wrapper.appendChild(rootNode);

    this._container.appendChild(wrapper);
  }

  /**
   * Render a single node and its children
   * @private
   * @param {Object} node
   * @param {number} depth
   * @returns {HTMLElement}
   */
  _renderNode(node, depth) {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'call-tree-node';
    nodeElement.dataset.depth = depth;

    // Create header
    const header = document.createElement('div');
    header.className = 'call-tree-header';
    header.style.paddingLeft = `${depth * this._options.indentSize}px`;

    // Expand/collapse toggle
    if (this._options.collapsible && node.children && node.children.length > 0) {
      const toggle = document.createElement('span');
      toggle.className = 'call-tree-toggle';
      toggle.textContent = '▼';
      toggle.onclick = (e) => {
        e.stopPropagation();
        this._toggleNode(nodeElement, toggle);
      };
      header.appendChild(toggle);
    } else {
      const spacer = document.createElement('span');
      spacer.className = 'call-tree-toggle-spacer';
      header.appendChild(spacer);
    }

    // Node icon based on type
    const icon = document.createElement('span');
    icon.className = 'call-tree-icon';
    if (node.external) {
      icon.textContent = '🔗';
      icon.title = 'External call';
    } else if (node.recursive) {
      icon.textContent = '🔄';
      icon.title = 'Recursive call';
    } else if (node.type === 'event') {
      icon.textContent = '📢';
      icon.title = 'Event emission';
    } else if (node.isPrivate) {
      icon.textContent = '🔒';
      icon.title = 'Private method';
    } else {
      icon.textContent = '📄';
      icon.title = 'Method call';
    }
    header.appendChild(icon);

    // Method name
    const name = document.createElement('span');
    name.className = 'call-tree-name';
    if (node.type === 'event') {
      name.textContent = `emit('${node.event}')`;
    } else if (node.external) {
      name.textContent = `${node.class}.${node.method}()`;
    } else {
      name.textContent = `${node.method}()`;
    }

    // Add class name for top-level
    if (depth === 0 && node.class) {
      const className = document.createElement('span');
      className.className = 'call-tree-class';
      className.textContent = node.class + '.';
      name.prepend(className);
    }

    header.appendChild(name);

    // Line number
    if (this._options.showLineNumbers && node.lineNumber) {
      const lineNum = document.createElement('span');
      lineNum.className = 'call-tree-line';
      lineNum.textContent = `:${node.lineNumber}`;
      header.appendChild(lineNum);
    }

    // Duration (for runtime traces)
    if (this._options.showDuration && node.duration !== undefined) {
      const duration = document.createElement('span');
      duration.className = 'call-tree-duration';
      duration.textContent = `${node.duration.toFixed(2)}ms`;
      header.appendChild(duration);
    }

    // Status badges
    if (node.recursive) {
      const badge = document.createElement('span');
      badge.className = 'call-tree-badge recursive';
      badge.textContent = 'recursive';
      header.appendChild(badge);
    }

    if (node.truncated) {
      const badge = document.createElement('span');
      badge.className = 'call-tree-badge truncated';
      badge.textContent = 'depth limit';
      header.appendChild(badge);
    }

    if (node.missing) {
      const badge = document.createElement('span');
      badge.className = 'call-tree-badge missing';
      badge.textContent = 'not found';
      header.appendChild(badge);
    }

    // Click handler
    if (this._options.onNodeClick) {
      header.style.cursor = 'pointer';
      header.onclick = () => this._options.onNodeClick(node);
    }

    nodeElement.appendChild(header);

    // Render children
    if (node.children && node.children.length > 0) {
      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'call-tree-children';

      for (const child of node.children) {
        const childNode = this._renderNode(child, depth + 1);
        childrenContainer.appendChild(childNode);
      }

      nodeElement.appendChild(childrenContainer);
    }

    return nodeElement;
  }

  /**
   * Toggle node expansion
   * @private
   * @param {HTMLElement} nodeElement
   * @param {HTMLElement} toggle
   */
  _toggleNode(nodeElement, toggle) {
    const children = nodeElement.querySelector('.call-tree-children');
    if (!children) return;

    const isExpanded = children.style.display !== 'none';

    if (isExpanded) {
      children.style.display = 'none';
      toggle.textContent = '▶';
      toggle.classList.add('collapsed');
    } else {
      children.style.display = 'block';
      toggle.textContent = '▼';
      toggle.classList.remove('collapsed');
    }
  }

  /**
   * Expand all nodes
   */
  expandAll() {
    const toggles = this._container.querySelectorAll('.call-tree-toggle.collapsed');
    for (const toggle of toggles) {
      toggle.click();
    }
  }

  /**
   * Collapse all nodes
   */
  collapseAll() {
    const toggles = this._container.querySelectorAll('.call-tree-toggle:not(.collapsed)');
    for (const toggle of toggles) {
      toggle.click();
    }
  }

  /**
   * Get inline styles for the tree (for standalone use)
   * @returns {string}
   */
  static getStyles() {
    return `
      .call-tree {
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 13px;
        line-height: 1.6;
      }

      .call-tree-node {
        margin: 0;
      }

      .call-tree-header {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .call-tree-header:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .call-tree-toggle,
      .call-tree-toggle-spacer {
        width: 16px;
        height: 16px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        font-size: 10px;
        color: #888;
        flex-shrink: 0;
      }

      .call-tree-toggle:hover {
        color: #fff;
      }

      .call-tree-icon {
        margin-right: 6px;
        font-size: 12px;
      }

      .call-tree-class {
        color: #9CDCFE;
      }

      .call-tree-name {
        color: #DCDCAA;
      }

      .call-tree-line {
        color: #6A9955;
        margin-left: 8px;
        font-size: 11px;
      }

      .call-tree-duration {
        color: #CE9178;
        margin-left: 8px;
        font-size: 11px;
      }

      .call-tree-badge {
        margin-left: 8px;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        text-transform: uppercase;
      }

      .call-tree-badge.recursive {
        background-color: #FF5722;
        color: #fff;
      }

      .call-tree-badge.truncated {
        background-color: #607D8B;
        color: #fff;
      }

      .call-tree-badge.missing {
        background-color: #f44336;
        color: #fff;
      }

      .call-tree-children {
        border-left: 1px solid #3E3E3E;
        margin-left: 8px;
      }
    `;
  }
}

export default CallTreeRenderer;
