/**
 * @fileoverview Detail Panel - Shows detailed class information when clicking on a class node
 * Features: Source code view, method signatures, internal call graph, external callers, drag & pin
 */
import { classData } from './class-data.js';

// ============================================
// Constants
// ============================================
const TABS = ['methods', 'properties', 'callgraph', 'source'];
const TAB_LABELS = {
  methods: 'Methods',
  properties: 'Properties',
  callgraph: 'Call Graph',
  source: 'Source',
};

// ============================================
// Detail Panel Class
// ============================================
class DetailPanel {
  constructor() {
    this._id = 'detail-panel-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    this._element = null;
    this._isPinned = false;
    this._currentClass = null;
    this._activeTab = 'methods';
    this._isDragging = false;
    this._dragOffset = { x: 0, y: 0 };
    this._position = { x: 0, y: 0 };
    this._sourceCache = {};
    this._onCloseCallback = null;

    this._boundOnMouseMove = this._onMouseMove.bind(this);
    this._boundOnMouseUp = this._onMouseUp.bind(this);
  }

  // ----------------------------------------
  // Getters
  // ----------------------------------------
  get id() {
    return this._id;
  }

  get isPinned() {
    return this._isPinned;
  }

  get currentClass() {
    return this._currentClass;
  }

  get element() {
    return this._element;
  }

  // ----------------------------------------
  // Public Methods
  // ----------------------------------------
  init() {
    this._createPanel();
    this._setupEventListeners();
  }

  show(className, x, y) {
    const data = classData[className];
    if (!data) {
      console.warn('[DetailPanel] No data for class:', className);
      return;
    }

    this._currentClass = className;

    // Position panel near click, but keep on screen
    const panelWidth = 480;
    const panelHeight = 500;
    const padding = 20;

    let posX = x + 20;
    let posY = y - 50;

    // Keep on screen
    if (posX + panelWidth > window.innerWidth - padding) {
      posX = x - panelWidth - 20;
    }
    if (posY + panelHeight > window.innerHeight - padding) {
      posY = window.innerHeight - panelHeight - padding;
    }
    if (posY < padding) posY = padding;
    if (posX < padding) posX = padding;

    this._position = { x: posX, y: posY };
    this._element.style.left = posX + 'px';
    this._element.style.top = posY + 'px';

    this._render();
    this._element.classList.add('visible');
  }

  hide() {
    if (this._isPinned) return;
    this._element.classList.remove('visible');
    this._currentClass = null;
  }

  forceHide() {
    this._isPinned = false;
    this._element.classList.remove('visible', 'pinned');
    this._currentClass = null;

    // Notify manager of closure
    if (this._onCloseCallback) {
      this._onCloseCallback(this);
    }
  }

  setOnCloseCallback(callback) {
    this._onCloseCallback = callback;
  }

  setSourceCache(cache) {
    this._sourceCache = cache;
  }

  dispose() {
    document.removeEventListener('mousemove', this._boundOnMouseMove);
    document.removeEventListener('mouseup', this._boundOnMouseUp);

    if (this._element && this._element.parentNode) {
      this._element.parentNode.removeChild(this._element);
    }

    this._element = null;
    this._sourceCache = null;
    this._onCloseCallback = null;
  }

  toggle(className, x, y) {
    if (this._currentClass === className && this._element.classList.contains('visible')) {
      this.forceHide();
    } else {
      // Preserve pinned state when clicking a different class
      if (this._isPinned) {
        // Just update content without moving the panel
        this._currentClass = className;
        this._render();
      } else {
        this.show(className, x, y);
      }
    }
  }

  pin() {
    this._isPinned = true;
    this._element.classList.add('pinned');
  }

  unpin() {
    this._isPinned = false;
    this._element.classList.remove('pinned');
  }

  togglePin() {
    if (this._isPinned) {
      this.unpin();
    } else {
      this.pin();
    }
  }

  // ----------------------------------------
  // Private Methods - Setup
  // ----------------------------------------
  _createPanel() {
    this._element = document.createElement('div');
    this._element.id = this._id;
    this._element.className = 'detail-panel';
    this._element.innerHTML = `
      <div class="detail-panel-header">
        <button class="detail-panel-btn pin-btn" title="Pin panel">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z"/>
          </svg>
        </button>
        <span class="detail-panel-title"></span>
        <button class="detail-panel-btn close-btn" title="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div class="detail-panel-meta">
        <div class="detail-panel-namespace"></div>
        <div class="detail-panel-file"></div>
        <div class="detail-panel-extends"></div>
      </div>
      <div class="detail-panel-tabs"></div>
      <div class="detail-panel-content"></div>
    `;

    document.body.appendChild(this._element);
  }

  _setupEventListeners() {
    // Header drag
    const header = this._element.querySelector('.detail-panel-header');
    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.detail-panel-btn')) return;
      this._startDrag(e);
    });

    // Pin button
    const pinBtn = this._element.querySelector('.pin-btn');
    pinBtn.addEventListener('click', () => this.togglePin());

    // Close button
    const closeBtn = this._element.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => this.forceHide());

    // Prevent click inside panel from triggering outside handlers
    this._element.addEventListener('click', (e) => e.stopPropagation());
  }

  // ----------------------------------------
  // Private Methods - Rendering
  // ----------------------------------------
  _render() {
    if (!this._currentClass) return;

    const data = classData[this._currentClass];

    // Title
    this._element.querySelector('.detail-panel-title').textContent = this._currentClass;

    // Meta info
    this._element.querySelector('.detail-panel-namespace').textContent = data.namespace || '';
    this._element.querySelector('.detail-panel-file').textContent = data.file || '';

    const extendsEl = this._element.querySelector('.detail-panel-extends');
    if (data.extends) {
      extendsEl.textContent = 'extends ' + data.extends;
      extendsEl.style.display = 'block';
    } else {
      extendsEl.style.display = 'none';
    }

    // Tabs
    this._renderTabs();

    // Content
    this._renderTabContent();
  }

  _renderTabs() {
    const tabsEl = this._element.querySelector('.detail-panel-tabs');
    tabsEl.innerHTML = TABS.map(
      (tab) =>
        `<button class="detail-panel-tab ${tab === this._activeTab ? 'active' : ''}" data-tab="${tab}">${TAB_LABELS[tab]}</button>`
    ).join('');

    tabsEl.querySelectorAll('.detail-panel-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        this._activeTab = btn.dataset.tab;
        this._renderTabs();
        this._renderTabContent();
      });
    });
  }

  _renderTabContent() {
    const contentEl = this._element.querySelector('.detail-panel-content');

    switch (this._activeTab) {
      case 'methods':
        contentEl.innerHTML = this._renderMethods();
        break;
      case 'properties':
        contentEl.innerHTML = this._renderProperties();
        break;
      case 'callgraph':
        contentEl.innerHTML = this._renderCallGraph();
        break;
      case 'source':
        this._renderSource(contentEl);
        break;
    }
  }

  _renderMethods() {
    const data = classData[this._currentClass];
    let html = '';

    // Check if methods is enhanced format (object with public/private)
    if (data.methods && typeof data.methods === 'object' && !Array.isArray(data.methods)) {
      // Enhanced format
      if (data.methods.public && data.methods.public.length > 0) {
        html += '<div class="method-section">';
        html += '<div class="method-section-title">+ Public Methods (' + data.methods.public.length + ')</div>';
        html += data.methods.public
          .map(
            (m) =>
              `<div class="method-item public">
            <span class="method-name">+${typeof m === 'string' ? m : m.name}</span>
            ${typeof m === 'object' ? `<span class="method-params">(${m.params ? m.params.join(', ') : ''})</span>` : ''}
            ${typeof m === 'object' && m.returns ? `<span class="method-returns"> : ${m.returns}</span>` : ''}
          </div>`
          )
          .join('');
        html += '</div>';
      }

      if (data.methods.private && data.methods.private.length > 0) {
        html += '<div class="method-section">';
        html += '<div class="method-section-title">- Private Methods (' + data.methods.private.length + ')</div>';
        html += data.methods.private
          .map(
            (m) =>
              `<div class="method-item private">
            <span class="method-name">-${typeof m === 'string' ? m : m.name}</span>
            ${typeof m === 'object' ? `<span class="method-params">(${m.params ? m.params.join(', ') : ''})</span>` : ''}
            ${typeof m === 'object' && m.returns ? `<span class="method-returns"> : ${m.returns}</span>` : ''}
          </div>`
          )
          .join('');
        html += '</div>';
      }
    } else if (Array.isArray(data.methods)) {
      // Legacy format - array of method names
      const publicMethods = data.methods.filter((m) => !m.startsWith('_'));
      const privateMethods = data.methods.filter((m) => m.startsWith('_'));

      if (publicMethods.length > 0) {
        html += '<div class="method-section">';
        html += '<div class="method-section-title">+ Public Methods (' + publicMethods.length + ')</div>';
        html += publicMethods
          .map((m) => `<div class="method-item public"><span class="method-name">+${m}()</span></div>`)
          .join('');
        html += '</div>';
      }

      if (privateMethods.length > 0) {
        html += '<div class="method-section">';
        html += '<div class="method-section-title">- Private Methods (' + privateMethods.length + ')</div>';
        html += privateMethods
          .map((m) => `<div class="method-item private"><span class="method-name">-${m}()</span></div>`)
          .join('');
        html += '</div>';
      }
    }

    return html || '<div class="no-data">No methods documented</div>';
  }

  _renderProperties() {
    const data = classData[this._currentClass];
    let html = '';

    // Check enhanced format
    if (data.properties && typeof data.properties === 'object' && !Array.isArray(data.properties)) {
      if (data.properties.public && data.properties.public.length > 0) {
        html += '<div class="property-section">';
        html += '<div class="property-section-title">+ Public Properties (' + data.properties.public.length + ')</div>';
        html += data.properties.public
          .map((p) => `<div class="property-item public"><span class="property-name">+${p}</span></div>`)
          .join('');
        html += '</div>';
      }

      if (data.properties.private && data.properties.private.length > 0) {
        html += '<div class="property-section">';
        html += '<div class="property-section-title">- Private Properties (' + data.properties.private.length + ')</div>';
        html += data.properties.private
          .map((p) => `<div class="property-item private"><span class="property-name">-${p}</span></div>`)
          .join('');
        html += '</div>';
      }
    } else if (Array.isArray(data.properties)) {
      // Legacy format
      const publicProps = data.properties.filter((p) => !p.startsWith('_'));
      const privateProps = data.properties.filter((p) => p.startsWith('_'));

      if (publicProps.length > 0) {
        html += '<div class="property-section">';
        html += '<div class="property-section-title">+ Public Properties (' + publicProps.length + ')</div>';
        html += publicProps
          .map((p) => `<div class="property-item public"><span class="property-name">+${p}</span></div>`)
          .join('');
        html += '</div>';
      }

      if (privateProps.length > 0) {
        html += '<div class="property-section">';
        html += '<div class="property-section-title">- Private Properties (' + privateProps.length + ')</div>';
        html += privateProps
          .map((p) => `<div class="property-item private"><span class="property-name">-${p}</span></div>`)
          .join('');
        html += '</div>';
      }
    }

    return html || '<div class="no-data">No properties documented</div>';
  }

  _renderCallGraph() {
    const data = classData[this._currentClass];
    let html = '';

    // Internal call chain
    if (data.callChain && Object.keys(data.callChain).length > 0) {
      html += '<div class="callgraph-section">';
      html += '<div class="callgraph-section-title">Internal Call Chain</div>';
      html += '<div class="call-tree">';

      // Find entry points (methods not called by other methods in this class)
      const calledMethods = new Set();
      Object.values(data.callChain).forEach((calls) => {
        calls.forEach((c) => calledMethods.add(c));
      });

      const entryPoints = Object.keys(data.callChain).filter((m) => !calledMethods.has(m));

      entryPoints.forEach((method) => {
        html += this._renderCallTreeNode(method, data.callChain, 0, new Set());
      });

      html += '</div></div>';
    }

    // Dependencies (external calls)
    if (data.dependencies && data.dependencies.length > 0) {
      html += '<div class="callgraph-section">';
      html += '<div class="callgraph-section-title">Dependencies (External Calls)</div>';
      html += data.dependencies
        .map((d) => `<div class="dependency-item">${d}</div>`)
        .join('');
      html += '</div>';
    }

    // Events
    if (data.events && data.events.length > 0) {
      html += '<div class="callgraph-section">';
      html += '<div class="callgraph-section-title">Events</div>';
      html += data.events.map((e) => `<div class="event-item">${e}</div>`).join('');
      html += '</div>';
    }

    return html || '<div class="no-data">No call graph data available</div>';
  }

  _renderCallTreeNode(method, callChain, depth, visited) {
    if (visited.has(method)) {
      return `<div class="call-tree-item" style="margin-left: ${depth * 20}px;">
        <span class="call-tree-recursive">${method}() [recursive]</span>
      </div>`;
    }

    visited.add(method);
    const isPrivate = method.startsWith('_');
    const calls = callChain[method] || [];

    let html = `<div class="call-tree-item" style="margin-left: ${depth * 20}px;">
      <span class="call-tree-method ${isPrivate ? 'private' : 'public'}">${method}()</span>
    </div>`;

    calls.forEach((childMethod) => {
      html += this._renderCallTreeNode(childMethod, callChain, depth + 1, new Set(visited));
    });

    return html;
  }

  async _renderSource(contentEl) {
    const data = classData[this._currentClass];
    if (!data.file) {
      contentEl.innerHTML = '<div class="no-data">No source file specified</div>';
      return;
    }

    // Show loading
    contentEl.innerHTML = '<div class="source-loading">Loading source...</div>';

    // Check cache
    if (this._sourceCache[data.file]) {
      contentEl.innerHTML = this._formatSource(this._sourceCache[data.file]);
      return;
    }

    try {
      // Fetch source file (relative path from tools/class-diagram to src/)
      const relativePath = '../../' + data.file;
      const response = await fetch(relativePath);

      if (!response.ok) {
        throw new Error('File not found: ' + data.file);
      }

      const source = await response.text();
      this._sourceCache[data.file] = source;
      contentEl.innerHTML = this._formatSource(source);
    } catch (err) {
      contentEl.innerHTML = `<div class="source-error">Error loading source: ${err.message}</div>`;
    }
  }

  _formatSource(source) {
    // Escape HTML special characters to display as-is
    const escaped = source
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Add line numbers only - no syntax highlighting
    const lines = escaped.split('\n');
    const numbered = lines
      .map((line, i) => {
        return `<span class="line-num">${String(i + 1).padStart(4)}</span>${line}`;
      })
      .join('\n');

    return `<pre class="source-code">${numbered}</pre>`;
  }

  // ----------------------------------------
  // Private Methods - Drag
  // ----------------------------------------
  _startDrag(e) {
    this._isDragging = true;
    this._dragOffset = {
      x: e.clientX - this._position.x,
      y: e.clientY - this._position.y,
    };

    document.addEventListener('mousemove', this._boundOnMouseMove);
    document.addEventListener('mouseup', this._boundOnMouseUp);

    this._element.style.transition = 'none';
    this._element.style.cursor = 'grabbing';
  }

  _onMouseMove(e) {
    if (!this._isDragging) return;

    this._position = {
      x: e.clientX - this._dragOffset.x,
      y: e.clientY - this._dragOffset.y,
    };

    this._element.style.left = this._position.x + 'px';
    this._element.style.top = this._position.y + 'px';
  }

  _onMouseUp() {
    this._isDragging = false;
    document.removeEventListener('mousemove', this._boundOnMouseMove);
    document.removeEventListener('mouseup', this._boundOnMouseUp);

    this._element.style.transition = '';
    this._element.style.cursor = '';
  }
}

// ============================================
// Detail Panel Manager Class
// ============================================
class DetailPanelManager {
  constructor() {
    this._panels = [];
    this._activePanel = null;
    this._sourceCache = {};
  }

  init() {
    // Create initial unpinned panel
    this._activePanel = this._createNewPanel();
  }

  _createNewPanel() {
    const panel = new DetailPanel();
    panel.init();
    panel.setSourceCache(this._sourceCache);
    panel.setOnCloseCallback((closedPanel) => this._handlePanelClose(closedPanel));
    this._panels.push(panel);
    return panel;
  }

  _handlePanelClose(panel) {
    // Remove from panels array
    const index = this._panels.indexOf(panel);
    if (index > -1) {
      this._panels.splice(index, 1);
    }

    // If it was the active panel, clear reference
    if (this._activePanel === panel) {
      this._activePanel = null;
    }

    // Dispose the panel
    panel.dispose();

    // Ensure we always have an active panel ready for next click
    // (will be created on next toggle if needed)
  }

  toggle(className, x, y) {
    // Case 1: Check if clicking same class on any visible panel - toggle that panel
    const existingPanel = this._panels.find(
      (p) => p.currentClass === className && p.element.classList.contains('visible')
    );
    if (existingPanel) {
      existingPanel.forceHide();
      return;
    }

    // Case 2: If no active panel exists, create one
    if (!this._activePanel) {
      this._activePanel = this._createNewPanel();
    }

    // Case 3: If active panel is not pinned, update it
    if (!this._activePanel.isPinned) {
      this._activePanel.show(className, x, y);
      return;
    }

    // Case 4: Active panel is pinned - create new panel
    const newPanel = this._createNewPanel();
    newPanel.show(className, x, y);
    this._activePanel = newPanel;
  }

  hide() {
    // Only hide the active unpinned panel
    if (this._activePanel && !this._activePanel.isPinned) {
      this._activePanel.hide();
    }
  }

  forceHide() {
    // Force hide the most recent active panel (for Escape key)
    if (this._activePanel) {
      this._activePanel.forceHide();
    }
  }

  closeAll() {
    // Close all panels
    [...this._panels].forEach((panel) => {
      panel.forceHide();
    });
  }

  get panelCount() {
    return this._panels.length;
  }

  get pinnedPanelCount() {
    return this._panels.filter((p) => p.isPinned).length;
  }
}

// ============================================
// Export Manager Singleton
// ============================================
export const detailPanelManager = new DetailPanelManager();
