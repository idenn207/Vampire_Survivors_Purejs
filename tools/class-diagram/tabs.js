import { initPanzoom } from './panzoom-controller.js';

export async function switchTab(tabName) {
  // Update button states
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.classList.remove('active');
  });
  if (event && event.target) {
    event.target.classList.add('active');
  }

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(function(content) {
    content.classList.remove('active');
  });
  document.getElementById('tab-' + tabName).classList.add('active');

  // Render the diagram for this tab (lazy loading - only renders once per tab)
  if (window.renderTab) {
    await window.renderTab(tabName);
  }

  // Initialize panzoom for new tab after a short delay
  setTimeout(function() {
    initPanzoom();
  }, 100);
}

// Global binding for onclick handlers
window.switchTab = switchTab;
