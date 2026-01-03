/**
 * @fileoverview Main application for Call Flow Analyzer
 * @module call-flow/aggregator
 */

import { CallGraph, ClassNode, MethodNode, MethodCall } from './analyzer/CallGraph.js';
import { ASTParser, buildCallGraph } from './analyzer/ASTParser.js';
import { EntryPointDetector } from './analyzer/EntryPointDetector.js';
import { RuntimeTracer, getGlobalTracer } from './analyzer/RuntimeTracer.js';
import { MermaidGenerator } from './visualizer/MermaidGenerator.js';
import { CallTreeRenderer } from './visualizer/CallTreeRenderer.js';
import { TimelineView } from './visualizer/TimelineView.js';

// Try to import pre-analyzed call data
let callData = null;
try {
  const module = await import('./data/call-data.js');
  callData = module.callData;
} catch (e) {
  console.log('No pre-analyzed call data found, will analyze on demand');
}

/**
 * Main application state
 */
const state = {
  graph: null,
  selectedClass: null,
  selectedMethod: null,
  viewMode: 'flowchart',
  panzoomInstance: null,
  treeRenderer: null,
  timelineView: null,
  tracer: getGlobalTracer()
};

/**
 * Initialize the application
 */
async function init() {
  // Initialize Mermaid
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      primaryColor: '#0f3460',
      primaryTextColor: '#eee',
      primaryBorderColor: '#00d4ff',
      lineColor: '#00d4ff',
      secondaryColor: '#16213e',
      tertiaryColor: '#1a1a2e'
    },
    flowchart: {
      curve: 'basis',
      padding: 20
    },
    sequence: {
      actorMargin: 50,
      boxMargin: 10
    }
  });

  // Load call graph
  if (callData) {
    state.graph = CallGraph.fromJSON(callData);
    console.log('Loaded pre-analyzed call graph with', state.graph.getClasses().length, 'classes');
  } else {
    // Create empty graph - would need to analyze files
    state.graph = new CallGraph();
    console.log('Created empty call graph - run analysis to populate');
  }

  // Initialize UI
  initializeUI();
  populateClassList();
  populateEntryPoints();
  populateStatistics();

  // Render initial view
  if (state.graph.getClasses().length > 0) {
    const firstClass = state.graph.getClasses()[0];
    selectClass(firstClass.name);
  }
}

/**
 * Initialize UI event handlers
 */
function initializeUI() {
  // Search
  document.getElementById('search-input').addEventListener('input', handleSearch);

  // View mode selector
  document.getElementById('view-mode').addEventListener('change', (e) => {
    state.viewMode = e.target.value;
    if (state.selectedClass) {
      renderDiagram();
    }
  });

  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });

  // Zoom controls
  document.getElementById('zoom-in').addEventListener('click', () => {
    if (state.panzoomInstance) {
      state.panzoomInstance.zoomIn();
    }
  });

  document.getElementById('zoom-out').addEventListener('click', () => {
    if (state.panzoomInstance) {
      state.panzoomInstance.zoomOut();
    }
  });

  document.getElementById('zoom-reset').addEventListener('click', () => {
    if (state.panzoomInstance) {
      state.panzoomInstance.reset();
    }
  });

  // Export SVG
  document.getElementById('export-svg').addEventListener('click', exportSVG);

  // Close detail panel
  document.getElementById('close-detail').addEventListener('click', () => {
    document.getElementById('detail-panel').style.display = 'none';
  });

  // Help toggle
  document.getElementById('help-toggle').addEventListener('click', () => {
    const guidelines = document.getElementById('test-guidelines');
    guidelines.style.display = guidelines.style.display === 'none' ? 'block' : 'none';
  });

  // Close guidelines
  document.getElementById('close-guidelines').addEventListener('click', () => {
    document.getElementById('test-guidelines').style.display = 'none';
  });

  // Runtime trace controls
  document.getElementById('start-recording').addEventListener('click', startRecording);
  document.getElementById('stop-recording').addEventListener('click', stopRecording);

  // Initialize tree renderer
  state.treeRenderer = new CallTreeRenderer(
    document.getElementById('tree-container'),
    {
      onNodeClick: showMethodDetails
    }
  );

  // Initialize timeline view
  state.timelineView = new TimelineView(
    document.getElementById('timeline-container'),
    {
      onBarClick: showMethodDetails
    }
  );
}

/**
 * Populate the class list in sidebar
 */
function populateClassList() {
  const container = document.getElementById('class-list');
  container.innerHTML = '';

  const classes = state.graph.getClasses();

  // Sort by name
  classes.sort((a, b) => a.name.localeCompare(b.name));

  for (const classNode of classes) {
    const item = document.createElement('div');
    item.className = 'class-item';
    item.textContent = classNode.name;
    item.dataset.className = classNode.name;
    item.onclick = () => selectClass(classNode.name);
    container.appendChild(item);
  }
}

/**
 * Populate entry points
 */
function populateEntryPoints() {
  const container = document.getElementById('entry-points');
  container.innerHTML = '';

  if (!state.graph || state.graph.getClasses().length === 0) {
    container.innerHTML = '<div class="empty">No classes analyzed</div>';
    return;
  }

  const detector = new EntryPointDetector(state.graph);
  const entryPoints = detector.getPrimaryEntryPoints();

  // Limit to first 20
  for (const ep of entryPoints.slice(0, 20)) {
    const item = document.createElement('div');
    item.className = 'entry-point-item';
    item.innerHTML = `
      <div class="method">${ep.method}()</div>
      <div class="class">${ep.class}</div>
    `;
    item.onclick = () => {
      selectClass(ep.class);
      selectMethod(ep.class, ep.method);
    };
    container.appendChild(item);
  }
}

/**
 * Populate statistics
 */
function populateStatistics() {
  const container = document.getElementById('statistics');

  if (!state.graph || state.graph.getClasses().length === 0) {
    container.innerHTML = '<div class="empty">No data</div>';
    return;
  }

  const stats = state.graph.getStats();

  container.innerHTML = `
    <div class="stat-row">
      <span class="stat-label">Classes</span>
      <span class="stat-value">${stats.classCount}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Methods</span>
      <span class="stat-value">${stats.methodCount}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Calls</span>
      <span class="stat-value">${stats.callCount}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Events</span>
      <span class="stat-value">${stats.eventCount}</span>
    </div>
  `;
}

/**
 * Handle search input
 */
function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  const items = document.querySelectorAll('.class-item');

  for (const item of items) {
    const name = item.dataset.className.toLowerCase();
    item.style.display = name.includes(query) ? 'block' : 'none';
  }
}

/**
 * Select a class
 */
function selectClass(className) {
  state.selectedClass = className;
  state.selectedMethod = null;

  // Update UI
  document.querySelectorAll('.class-item').forEach(item => {
    item.classList.toggle('active', item.dataset.className === className);
  });

  renderDiagram();
  renderCallTree();
}

/**
 * Select a method
 */
function selectMethod(className, methodName) {
  state.selectedClass = className;
  state.selectedMethod = methodName;

  renderDiagram();
  renderCallTree();
  showMethodDetails({ class: className, method: methodName });
}

/**
 * Counter for unique diagram IDs
 */
let diagramCounter = 0;

/**
 * Render the diagram based on current state
 */
async function renderDiagram() {
  const container = document.getElementById('diagram-container');

  if (!state.selectedClass) {
    container.innerHTML = '<div style="color: #888; padding: 40px;">Select a class to view its call flow</div>';
    return;
  }

  const generator = new MermaidGenerator(state.graph);
  let diagramCode;

  switch (state.viewMode) {
    case 'sequence':
      if (state.selectedMethod) {
        diagramCode = generator.toSequenceDiagram(state.selectedClass, state.selectedMethod);
      } else {
        // Use first entry point
        const classNode = state.graph.getClass(state.selectedClass);
        const entryPoints = classNode?.getEntryPoints() || [];
        if (entryPoints.length > 0) {
          diagramCode = generator.toSequenceDiagram(state.selectedClass, entryPoints[0].name);
        } else {
          diagramCode = `sequenceDiagram\n    Note over ${state.selectedClass}: No entry points found`;
        }
      }
      break;

    case 'tree':
      if (state.selectedMethod) {
        diagramCode = generator.toCallTree(state.selectedClass, state.selectedMethod);
      } else {
        diagramCode = `flowchart TD\n    note["Select a method to view call tree"]`;
      }
      break;

    default: // flowchart
      diagramCode = generator.toFlowchart(state.selectedClass);
  }

  try {
    // Generate unique ID for this render
    const diagramId = `diagram-${++diagramCounter}`;

    // Use mermaid.render() for proper dynamic rendering
    const { svg } = await mermaid.render(diagramId, diagramCode);

    // Insert rendered SVG into container
    container.innerHTML = svg;

    // Initialize panzoom on the SVG
    const svgElement = container.querySelector('svg');
    if (svgElement && typeof panzoom !== 'undefined') {
      if (state.panzoomInstance) {
        state.panzoomInstance.dispose();
      }
      state.panzoomInstance = panzoom(svgElement, {
        maxZoom: 5,
        minZoom: 0.1,
        bounds: false
      });
    }

    // Add click handlers to nodes
    svgElement?.querySelectorAll('.node').forEach(node => {
      node.style.cursor = 'pointer';
      node.addEventListener('click', (e) => {
        const text = node.querySelector('text')?.textContent;
        if (text) {
          const methodName = text.replace(/[[\]()]/g, '');
          selectMethod(state.selectedClass, methodName);
        }
      });
    });

  } catch (err) {
    console.error('Mermaid rendering error:', err);
    console.error('Diagram code:', diagramCode);
    container.innerHTML = `<div style="color: #f44336; padding: 20px;">
      <p>Error rendering diagram: ${err.message}</p>
      <pre style="font-size: 12px; overflow: auto; max-height: 200px; background: #1a1a2e; padding: 10px; margin-top: 10px;">${diagramCode}</pre>
    </div>`;
  }
}

/**
 * Render call tree in the tree tab
 */
function renderCallTree() {
  if (!state.selectedClass) {
    return;
  }

  let methodName = state.selectedMethod;

  // If no method selected, use first entry point
  if (!methodName) {
    const classNode = state.graph.getClass(state.selectedClass);
    const entryPoints = classNode?.getEntryPoints() || [];
    methodName = entryPoints[0]?.name;
  }

  if (!methodName) {
    document.getElementById('tree-container').innerHTML =
      '<div style="color: #888; padding: 40px;">No methods to display</div>';
    return;
  }

  const chain = state.graph.getCallChain(state.selectedClass, methodName, 10);

  if (chain) {
    state.treeRenderer.render(chain);
  }
}

/**
 * Show method details in detail panel
 */
function showMethodDetails(info) {
  const panel = document.getElementById('detail-panel');
  const title = document.getElementById('detail-title');
  const content = document.getElementById('detail-content');

  title.textContent = `${info.class}.${info.method}()`;

  const classNode = state.graph.getClass(info.class);
  const method = classNode?.getMethod(info.method);

  if (!method) {
    content.innerHTML = '<div class="empty">Method not found in call graph</div>';
    panel.style.display = 'block';
    return;
  }

  // Build detail content
  let html = '';

  // Method info
  html += `
    <div class="detail-section">
      <h4>Method Info</h4>
      <ul class="detail-list">
        <li>Visibility: ${method.isPrivate ? 'Private' : 'Public'}</li>
        <li>Line: ${method.lineNumber || 'Unknown'}</li>
        <li>Parameters: ${method.params.join(', ') || 'None'}</li>
        <li>Entry Point: ${method.isEntryPoint ? 'Yes' : 'No'}</li>
      </ul>
    </div>
  `;

  // Internal calls
  const internalCalls = method.calls.filter(c => c.type === 'internal');
  if (internalCalls.length > 0) {
    html += `
      <div class="detail-section">
        <h4>Internal Calls (${internalCalls.length})</h4>
        <ul class="detail-list">
          ${internalCalls.map(c => `<li>${c.target}()</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // External calls
  const externalCalls = method.calls.filter(c => c.type === 'external');
  if (externalCalls.length > 0) {
    html += `
      <div class="detail-section">
        <h4>External Calls (${externalCalls.length})</h4>
        <ul class="detail-list">
          ${externalCalls.map(c => `<li>${c.dependency}.${c.method}()</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Events
  const events = method.calls.filter(c => c.type === 'event_emit' || c.type === 'event_listen');
  if (events.length > 0) {
    html += `
      <div class="detail-section">
        <h4>Events</h4>
        <ul class="detail-list">
          ${events.map(c => `<li>${c.type === 'event_emit' ? 'Emits' : 'Listens'}: ${c.event}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Called by
  if (method.calledBy.size > 0) {
    html += `
      <div class="detail-section">
        <h4>Called By</h4>
        <ul class="detail-list">
          ${[...method.calledBy].map(c => `<li>${c}()</li>`).join('')}
        </ul>
      </div>
    `;
  }

  content.innerHTML = html;
  panel.style.display = 'block';
}

/**
 * Start runtime recording
 */
function startRecording() {
  state.tracer.startRecording();

  document.getElementById('start-recording').disabled = true;
  document.getElementById('stop-recording').disabled = false;
  document.getElementById('recording-status').textContent = 'Recording...';
  document.getElementById('recording-status').classList.add('recording');
}

/**
 * Stop runtime recording
 */
function stopRecording() {
  const traces = state.tracer.stopRecording();

  document.getElementById('start-recording').disabled = false;
  document.getElementById('stop-recording').disabled = true;
  document.getElementById('recording-status').textContent = 'Stopped';
  document.getElementById('recording-status').classList.remove('recording');

  // Build and render timeline
  const callTree = state.tracer.buildCallTree();
  state.timelineView.render(callTree);

  const stats = state.tracer.getStatistics();
  state.timelineView.renderStatistics(stats);
}

/**
 * Export current diagram as SVG
 */
function exportSVG() {
  const svg = document.querySelector('#mermaid-diagram svg');
  if (!svg) {
    alert('No diagram to export');
    return;
  }

  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `call-flow-${state.selectedClass || 'diagram'}.svg`;
  a.click();

  URL.revokeObjectURL(url);
}

// Initialize on load
init().catch(console.error);

// Export for debugging
window.callFlowApp = {
  state,
  selectClass,
  selectMethod,
  renderDiagram,
  startRecording,
  stopRecording
};
