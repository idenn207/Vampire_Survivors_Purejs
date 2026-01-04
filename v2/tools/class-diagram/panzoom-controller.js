// Store panzoom instances with their SVG references using Map
const panzoomInstances = new Map();

export function initPanzoom() {
  const activeWrapper = document.querySelector('.tab-content.active .diagram-wrapper');
  if (!activeWrapper) return;

  const svg = activeWrapper.querySelector('svg');
  if (svg && !panzoomInstances.has(svg)) {
    const instance = panzoom(svg, {
      maxZoom: 5,
      minZoom: 0.25,
      bounds: true,
      boundsPadding: 0.1,
      smoothScroll: false
    });
    panzoomInstances.set(svg, instance);
  }
}

export function getActivePanzoom() {
  const activeWrapper = document.querySelector('.tab-content.active .diagram-wrapper');
  if (!activeWrapper) return null;
  const svg = activeWrapper.querySelector('svg');
  return svg ? { svg: svg, instance: panzoomInstances.get(svg) } : null;
}

export function zoomIn() {
  const pz = getActivePanzoom();
  if (pz && pz.instance) {
    const rect = pz.svg.getBoundingClientRect();
    pz.instance.smoothZoom(rect.width / 2, rect.height / 2, 1.3);
  }
}

export function zoomOut() {
  const pz = getActivePanzoom();
  if (pz && pz.instance) {
    const rect = pz.svg.getBoundingClientRect();
    pz.instance.smoothZoom(rect.width / 2, rect.height / 2, 0.7);
  }
}

export function resetZoom() {
  const pz = getActivePanzoom();
  if (pz && pz.instance) {
    pz.instance.moveTo(0, 0);
    pz.instance.zoomAbs(0, 0, 1);
  }
}

// Global function bindings for onclick handlers
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.resetZoom = resetZoom;
