import { classData } from './class-data.js';
import { initPanzoom } from './panzoom-controller.js';
import { showTooltip, hideTooltip } from './tooltip.js';

function highlightMatch(text, query) {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  if (index === -1) return text;
  return text.substring(0, index) +
    '<span class="search-result-highlight">' + text.substring(index, index + query.length) + '</span>' +
    text.substring(index + query.length);
}

export function handleSearch(query) {
  const resultsDiv = document.getElementById('searchResults');
  if (!query || query.length < 2) {
    resultsDiv.classList.remove('visible');
    return;
  }

  const lowerQuery = query.toLowerCase();
  let results = [];

  Object.keys(classData).forEach(function(className) {
    const data = classData[className];
    let matchScore = 0;

    // Match class name (highest priority)
    if (className.toLowerCase().includes(lowerQuery)) {
      matchScore = 100 - className.toLowerCase().indexOf(lowerQuery);
    }
    // Match namespace
    else if (data.namespace && data.namespace.toLowerCase().includes(lowerQuery)) {
      matchScore = 50;
    }
    // Match file path
    else if (data.file && data.file.toLowerCase().includes(lowerQuery)) {
      matchScore = 30;
    }
    // Match description
    else if (data.description && data.description.toLowerCase().includes(lowerQuery)) {
      matchScore = 20;
    }
    // Match methods
    else if (data.methods && data.methods.some(function(m) { return m.toLowerCase().includes(lowerQuery); })) {
      matchScore = 10;
    }

    if (matchScore > 0) {
      results.push({ className: className, data: data, score: matchScore });
    }
  });

  // Sort by score
  results.sort(function(a, b) { return b.score - a.score; });

  // Limit to 15 results
  results = results.slice(0, 15);

  if (results.length === 0) {
    resultsDiv.innerHTML = '<div class="search-no-results">No classes found for "' + query + '"</div>';
  } else {
    let html = '';
    results.forEach(function(result) {
      const highlightedName = highlightMatch(result.className, query);
      html += '<div class="search-result-item" onclick="selectSearchResult(\'' + result.className + '\')">';
      html += '<div class="search-result-name">' + highlightedName + '</div>';
      html += '<div class="search-result-namespace">' + result.data.namespace + '</div>';
      html += '<div class="search-result-file">' + result.data.file + '</div>';
      html += '</div>';
    });
    resultsDiv.innerHTML = html;
  }

  resultsDiv.classList.add('visible');
}

export function hideSearchResults() {
  document.getElementById('searchResults').classList.remove('visible');
}

export function selectSearchResult(className) {
  const data = classData[className];
  if (!data) return;

  // Determine which tab to switch to based on namespace
  const namespace = data.namespace;
  let tabName = 'overview';

  if (namespace.includes('.Core')) tabName = 'core';
  else if (namespace.includes('.Components')) tabName = 'components';
  else if (namespace.includes('.Entities')) tabName = 'entities';
  else if (namespace.includes('.Systems')) tabName = 'systems';
  else if (namespace.includes('.Behaviors')) tabName = 'behaviors';
  else if (namespace.includes('.Managers') || namespace.includes('.Pool')) tabName = 'managers';
  else if (namespace.includes('.UI')) tabName = 'ui';

  // Switch to the tab
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase().includes(tabName) ||
        (tabName === 'managers' && btn.textContent.includes('Managers'))) {
      btn.classList.add('active');
    }
  });
  document.querySelectorAll('.tab-content').forEach(function(content) {
    content.classList.remove('active');
  });
  document.getElementById('tab-' + tabName).classList.add('active');

  // Clear search
  document.getElementById('searchInput').value = '';
  hideSearchResults();

  // Show tooltip for the selected class after a short delay
  setTimeout(function() {
    initPanzoom();
    // Find and highlight the node if possible
    const nodes = document.querySelectorAll('#tab-' + tabName + ' .node');
    nodes.forEach(function(node) {
      const label = node.querySelector('.nodeLabel');
      if (label && label.textContent.includes(className)) {
        node.style.outline = '3px solid #ffe66d';
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function() { node.style.outline = ''; }, 3000);
      }
    });
    // Show tooltip
    showTooltip(className, window.innerWidth / 2 - 175, 150);
    setTimeout(hideTooltip, 5000);
  }, 200);
}

// Global binding for inline handlers
window.handleSearch = handleSearch;
window.hideSearchResults = hideSearchResults;
window.selectSearchResult = selectSearchResult;
