import { classData } from './class-data.js';

let tooltip = null;

export function showTooltip(className, x, y) {
  if (!tooltip) {
    tooltip = document.getElementById('tooltip');
  }
  if (!tooltip) return;

  const data = classData[className];
  if (!data) return;

  let html = '<h4>' + className + '</h4>';
  html += '<div class="file">' + data.file + '</div>';

  // Namespace
  html += '<div class="section">';
  html += '<div class="section-title">Namespace</div>';
  html += '<div class="section-content">' + data.namespace + '</div>';
  html += '</div>';

  // Extends (if present)
  if (data.extends) {
    html += '<div class="section">';
    html += '<div class="section-title">Extends</div>';
    html += '<div class="section-content" style="color:#00d4ff;">' + data.extends + '</div>';
    html += '</div>';
  }

  // Priority (for systems)
  if (data.priority !== undefined) {
    html += '<div class="section">';
    html += '<div class="section-title">Priority</div>';
    html += '<div class="section-content" style="color:#ffe66d;">' + data.priority + '</div>';
    html += '</div>';
  }

  // Description
  html += '<div class="section">';
  html += '<div class="section-title">Description</div>';
  html += '<div class="section-content">' + data.description + '</div>';
  html += '</div>';

  // Properties (if present)
  if (data.properties && data.properties.length > 0) {
    html += '<div class="section">';
    html += '<div class="section-title">Properties (' + data.properties.length + ')</div>';
    html += '<div class="section-content" style="font-family:monospace;font-size:11px;">' + data.properties.join(', ') + '</div>';
    html += '</div>';
  }

  // Methods (if present)
  if (data.methods && data.methods.length > 0) {
    html += '<div class="section">';
    html += '<div class="section-title">Methods (' + data.methods.length + ')</div>';
    html += '<div class="section-content" style="font-family:monospace;font-size:11px;">' + data.methods.join('(), ') + '()</div>';
    html += '</div>';
  }

  // Dependencies (if present)
  if (data.dependencies && data.dependencies.length > 0) {
    html += '<div class="section">';
    html += '<div class="section-title">Dependencies</div>';
    html += '<div class="section-content" style="color:#4ecdc4;">' + data.dependencies.join(', ') + '</div>';
    html += '</div>';
  }

  // Events (if present)
  if (data.events) {
    html += '<div class="section">';
    html += '<div class="section-title">Events</div>';
    html += '<div class="section-content" style="color:#ffe66d;">' + (Array.isArray(data.events) ? data.events.join(', ') : data.events) + '</div>';
    html += '</div>';
  }

  // Components (for entities)
  if (data.components) {
    html += '<div class="section">';
    html += '<div class="section-title">Components</div>';
    html += '<div class="section-content" style="color:#ff6b6b;">' + data.components + '</div>';
    html += '</div>';
  }

  // Tags (for entities)
  if (data.tags) {
    html += '<div class="section">';
    html += '<div class="section-title">Tags</div>';
    html += '<div class="section-content">' + data.tags + '</div>';
    html += '</div>';
  }

  // Special fields (layers, types, patterns, stats, stackModes, targetingModes, triggerModes, attackModes, behaviors, helpers)
  const specialFields = ['layers', 'types', 'patterns', 'stats', 'stackModes', 'targetingModes', 'triggerModes', 'attackModes', 'behaviors', 'helpers'];
  specialFields.forEach(function(field) {
    if (data[field]) {
      html += '<div class="section">';
      html += '<div class="section-title">' + field.charAt(0).toUpperCase() + field.slice(1) + '</div>';
      html += '<div class="section-content" style="font-size:11px;">' + data[field] + '</div>';
      html += '</div>';
    }
  });

  // Updates during pause (for systems)
  if (data.updatesDuringPause) {
    html += '<div class="section">';
    html += '<div class="section-content" style="color:#33CC33;font-size:11px;">Updates during pause</div>';
    html += '</div>';
  }

  tooltip.innerHTML = html;

  // Position tooltip, keeping it on screen
  let left = x + 15;
  let top = y + 15;
  if (left + 350 > window.innerWidth) left = x - 365;
  if (top + 400 > window.innerHeight) top = Math.max(10, window.innerHeight - 410);

  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
  tooltip.classList.add('visible');
}

export function hideTooltip() {
  if (!tooltip) {
    tooltip = document.getElementById('tooltip');
  }
  if (tooltip) {
    tooltip.classList.remove('visible');
  }
}
