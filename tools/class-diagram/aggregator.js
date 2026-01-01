// Import diagram data
import { overview } from './mermaid/overview.js';
import { core } from './mermaid/core.js';
import { components } from './mermaid/components.js';
import { entities } from './mermaid/entities.js';
import { systems } from './mermaid/systems.js';
import { behaviors } from './mermaid/behaviors.js';
import { managers } from './mermaid/managers.js';
import { ui } from './mermaid/ui.js';

// Import modules
import { initPanzoom, zoomIn, zoomOut, resetZoom } from './panzoom-controller.js';
import { showTooltip, hideTooltip } from './tooltip.js';
import { handleSearch, hideSearchResults } from './search.js';
import { switchTab } from './tabs.js';

// Aggregate all diagrams
const diagrams = {
  overview,
  core,
  components,
  entities,
  systems,
  behaviors,
  managers,
  ui,
};

// Tab configuration mapping tab names to diagram keys
const tabConfig = [
  { id: 'overview', diagramKey: 'overview', btnText: 'Overview' },
  { id: 'core', diagramKey: 'core', btnText: 'Core' },
  { id: 'components', diagramKey: 'components', btnText: 'Components' },
  { id: 'entities', diagramKey: 'entities', btnText: 'Entities' },
  { id: 'systems', diagramKey: 'systems', btnText: 'Systems' },
  { id: 'behaviors', diagramKey: 'behaviors', btnText: 'Behaviors' },
  { id: 'managers', diagramKey: 'managers', btnText: 'Managers & Pools' },
  { id: 'ui', diagramKey: 'ui', btnText: 'UI' },
];

// Track which tabs have been rendered
const renderedTabs = new Set();

// Populate a single tab's content (without rendering mermaid yet)
function populateTab(tabId) {
  const tab = tabConfig.find(t => t.id === tabId);
  if (!tab) return null;

  const diagram = diagrams[tab.diagramKey];
  if (!diagram) return null;

  const tabContent = document.getElementById('tab-' + tab.id);
  if (!tabContent) return null;

  // Clear existing content
  tabContent.innerHTML = '';

  // Create title
  const h2 = document.createElement('h2');
  h2.textContent = diagram.title;
  tabContent.appendChild(h2);

  // Create description
  const p = document.createElement('p');
  p.className = 'description';
  p.textContent = diagram.description;
  tabContent.appendChild(p);

  // Create diagram wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'diagram-wrapper';

  // Create mermaid pre element - use textContent to avoid HTML parsing
  // This fixes classDiagram syntax with <|-- arrows being misinterpreted as HTML tags
  const pre = document.createElement('pre');
  pre.className = 'mermaid';
  pre.textContent = diagram.content;
  wrapper.appendChild(pre);

  tabContent.appendChild(wrapper);

  return pre;
}

// Render a specific tab's diagram (must be visible)
async function renderTab(tabId) {
  if (renderedTabs.has(tabId)) return;

  const pre = populateTab(tabId);
  if (!pre) return;

  try {
    await mermaid.run({ nodes: [pre] });
    renderedTabs.add(tabId);
  } catch (e) {
    console.error('Mermaid rendering error for tab ' + tabId + ':', e);
  }
}

// Export for tabs.js to use
window.renderTab = renderTab;

// Initialize after DOM is ready
async function init() {
  // Initialize Mermaid config first (without startOnLoad)
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      primaryColor: '#16213e',
      primaryTextColor: '#eee',
      primaryBorderColor: '#00d4ff',
      lineColor: '#555',
      secondaryColor: '#0f3460',
      tertiaryColor: '#1a1a2e',
    },
    flowchart: {
      useMaxWidth: false,
      htmlLabels: true,
    },
    securityLevel: 'loose',
  });

  // Only render the initial visible tab (overview)
  await renderTab('overview');

  // Initialize panzoom and hover listeners after Mermaid renders
  setTimeout(function () {
    initPanzoom();

    // Add hover listeners to nodes
    document.querySelectorAll('.node').forEach(function (node) {
      node.style.cursor = 'pointer';
      node.addEventListener('mouseenter', function (e) {
        const text = node.querySelector('.nodeLabel');
        if (text) {
          const className = text.textContent.split('\n')[0].trim();
          showTooltip(className, e.clientX, e.clientY);
        }
      });
      node.addEventListener('mouseleave', hideTooltip);
      node.addEventListener('mousemove', function (e) {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
          tooltip.style.left = e.clientX + 15 + 'px';
          tooltip.style.top = e.clientY + 15 + 'px';
        }
      });
    });
  }, 1000);

  // Keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    // Search shortcut (Ctrl+F or Cmd+F)
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
      return;
    }
    // Escape to close search
    if (e.key === 'Escape') {
      hideSearchResults();
      document.getElementById('searchInput').blur();
      return;
    }
    // Don't trigger zoom if typing in search
    if (document.activeElement.id === 'searchInput') return;
    // Zoom shortcuts
    if (e.key === '+' || e.key === '=') zoomIn();
    if (e.key === '-') zoomOut();
    if (e.key === '0') resetZoom();
  });

  // Focus search on / key
  document.addEventListener('keypress', function (e) {
    if (e.key === '/' && document.activeElement.id !== 'searchInput') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
  });
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

