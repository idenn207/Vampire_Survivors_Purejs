/**
 * @fileoverview Timeline view for runtime trace visualization
 * @module call-flow/visualizer/TimelineView
 */

/**
 * Renders a timeline view of runtime traces
 */
export class TimelineView {
  /**
   * @param {HTMLElement} container
   * @param {Object} [options={}]
   */
  constructor(container, options = {}) {
    this._container = container;
    this._options = {
      rowHeight: 24,
      minBarWidth: 2,
      maxBarWidth: 500,
      colors: {
        background: '#1a1a2e',
        bar: '#4CAF50',
        barHover: '#66BB6A',
        external: '#2196F3',
        error: '#f44336',
        text: '#eee',
        grid: '#333'
      },
      onBarClick: null,
      ...options
    };

    this._traces = [];
    this._zoom = 1;
    this._panX = 0;
  }

  /**
   * Render timeline from call tree
   * @param {Object[]} callTree - Call tree from RuntimeTracer.buildCallTree()
   */
  render(callTree) {
    this._container.innerHTML = '';

    if (!callTree || callTree.length === 0) {
      this._container.innerHTML = '<div class="timeline-empty">No trace data available</div>';
      return;
    }

    // Flatten the tree for rendering
    const flattenedCalls = this._flattenCallTree(callTree);
    this._traces = flattenedCalls;

    // Calculate time range
    const startTime = Math.min(...flattenedCalls.map(c => c.timestamp));
    const endTime = Math.max(...flattenedCalls.map(c => c.timestamp + (c.duration || 0)));
    const totalDuration = endTime - startTime;

    // Create timeline structure
    const wrapper = document.createElement('div');
    wrapper.className = 'timeline-wrapper';

    // Time axis
    const axis = this._createTimeAxis(startTime, totalDuration);
    wrapper.appendChild(axis);

    // Main content area
    const content = document.createElement('div');
    content.className = 'timeline-content';

    // Render each trace as a row
    for (const trace of flattenedCalls) {
      const row = this._createTraceRow(trace, startTime, totalDuration);
      content.appendChild(row);
    }

    wrapper.appendChild(content);
    this._container.appendChild(wrapper);

    // Add zoom controls
    this._addZoomControls();
  }

  /**
   * Flatten call tree for timeline rendering
   * @private
   */
  _flattenCallTree(tree, result = [], depth = 0) {
    for (const node of tree) {
      result.push({
        ...node,
        depth
      });

      if (node.children && node.children.length > 0) {
        this._flattenCallTree(node.children, result, depth + 1);
      }
    }

    return result;
  }

  /**
   * Create time axis
   * @private
   */
  _createTimeAxis(startTime, totalDuration) {
    const axis = document.createElement('div');
    axis.className = 'timeline-axis';

    // Add tick marks
    const tickCount = 10;
    for (let i = 0; i <= tickCount; i++) {
      const tick = document.createElement('div');
      tick.className = 'timeline-tick';
      tick.style.left = `${(i / tickCount) * 100}%`;

      const time = (i / tickCount) * totalDuration;
      tick.textContent = time.toFixed(2) + 'ms';

      axis.appendChild(tick);
    }

    return axis;
  }

  /**
   * Create a trace row
   * @private
   */
  _createTraceRow(trace, startTime, totalDuration) {
    const row = document.createElement('div');
    row.className = 'timeline-row';
    row.style.height = `${this._options.rowHeight}px`;
    row.style.paddingLeft = `${trace.depth * 16}px`;

    // Method label
    const label = document.createElement('div');
    label.className = 'timeline-label';
    label.textContent = `${trace.className}.${trace.method}`;
    label.title = `${trace.className}.${trace.method}(${trace.args?.join(', ') || ''})`;
    row.appendChild(label);

    // Duration bar
    const barContainer = document.createElement('div');
    barContainer.className = 'timeline-bar-container';

    const bar = document.createElement('div');
    bar.className = 'timeline-bar';

    // Calculate position and width
    const relativeStart = trace.timestamp - startTime;
    const left = (relativeStart / totalDuration) * 100;
    const width = Math.max(
      this._options.minBarWidth,
      ((trace.duration || 0) / totalDuration) * 100
    );

    bar.style.left = `${left}%`;
    bar.style.width = `${Math.min(width, 100 - left)}%`;

    // Color based on status
    if (trace.error) {
      bar.style.backgroundColor = this._options.colors.error;
    } else if (trace.external) {
      bar.style.backgroundColor = this._options.colors.external;
    } else {
      bar.style.backgroundColor = this._options.colors.bar;
    }

    // Duration tooltip
    bar.title = `${trace.duration?.toFixed(3) || 0}ms`;

    // Click handler
    if (this._options.onBarClick) {
      bar.style.cursor = 'pointer';
      bar.onclick = () => this._options.onBarClick(trace);
    }

    barContainer.appendChild(bar);
    row.appendChild(barContainer);

    // Duration text
    const duration = document.createElement('div');
    duration.className = 'timeline-duration';
    duration.textContent = `${trace.duration?.toFixed(2) || 0}ms`;
    row.appendChild(duration);

    return row;
  }

  /**
   * Add zoom controls
   * @private
   */
  _addZoomControls() {
    const controls = document.createElement('div');
    controls.className = 'timeline-controls';

    const zoomIn = document.createElement('button');
    zoomIn.textContent = '+';
    zoomIn.onclick = () => this._setZoom(this._zoom * 1.5);

    const zoomOut = document.createElement('button');
    zoomOut.textContent = '-';
    zoomOut.onclick = () => this._setZoom(this._zoom / 1.5);

    const reset = document.createElement('button');
    reset.textContent = 'Reset';
    reset.onclick = () => this._setZoom(1);

    controls.appendChild(zoomOut);
    controls.appendChild(reset);
    controls.appendChild(zoomIn);

    this._container.insertBefore(controls, this._container.firstChild);
  }

  /**
   * Set zoom level
   * @private
   */
  _setZoom(zoom) {
    this._zoom = Math.max(0.1, Math.min(10, zoom));

    const content = this._container.querySelector('.timeline-content');
    if (content) {
      content.style.transform = `scaleX(${this._zoom})`;
      content.style.transformOrigin = 'left';
    }
  }

  /**
   * Render statistics summary
   * @param {Object} statistics - From RuntimeTracer.getStatistics()
   */
  renderStatistics(statistics) {
    const stats = document.createElement('div');
    stats.className = 'timeline-statistics';

    stats.innerHTML = `
      <div class="stat-row">
        <span class="stat-label">Total Calls:</span>
        <span class="stat-value">${statistics.totalCalls}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Unique Methods:</span>
        <span class="stat-value">${statistics.uniqueMethods}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Total Duration:</span>
        <span class="stat-value">${statistics.totalDuration.toFixed(2)}ms</span>
      </div>
    `;

    // Top methods table
    if (statistics.methods && statistics.methods.length > 0) {
      const table = document.createElement('table');
      table.className = 'timeline-table';

      table.innerHTML = `
        <thead>
          <tr>
            <th>Method</th>
            <th>Calls</th>
            <th>Total (ms)</th>
            <th>Avg (ms)</th>
            <th>Max (ms)</th>
          </tr>
        </thead>
        <tbody>
          ${statistics.methods.slice(0, 10).map(m => `
            <tr>
              <td>${m.className}.${m.method}</td>
              <td>${m.callCount}</td>
              <td>${m.totalDuration.toFixed(2)}</td>
              <td>${m.avgDuration.toFixed(2)}</td>
              <td>${m.maxDuration.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      `;

      stats.appendChild(table);
    }

    this._container.appendChild(stats);
  }

  /**
   * Get inline styles
   * @returns {string}
   */
  static getStyles() {
    return `
      .timeline-wrapper {
        background-color: #1a1a2e;
        border-radius: 8px;
        overflow: hidden;
      }

      .timeline-empty {
        padding: 40px;
        text-align: center;
        color: #888;
      }

      .timeline-controls {
        display: flex;
        gap: 8px;
        padding: 12px;
        background-color: #16213e;
        border-bottom: 1px solid #0f3460;
      }

      .timeline-controls button {
        padding: 6px 12px;
        background-color: #0f3460;
        border: 1px solid #1a1a2e;
        color: #eee;
        border-radius: 4px;
        cursor: pointer;
      }

      .timeline-controls button:hover {
        background-color: #00d4ff;
        color: #1a1a2e;
      }

      .timeline-axis {
        display: flex;
        justify-content: space-between;
        padding: 8px 180px 8px 200px;
        background-color: #16213e;
        border-bottom: 1px solid #0f3460;
        font-size: 11px;
        color: #888;
      }

      .timeline-tick {
        position: relative;
      }

      .timeline-content {
        max-height: 400px;
        overflow-y: auto;
        transition: transform 0.2s;
      }

      .timeline-row {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #0f3460;
        padding: 2px 8px;
      }

      .timeline-row:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }

      .timeline-label {
        width: 180px;
        flex-shrink: 0;
        font-size: 12px;
        color: #9CDCFE;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .timeline-bar-container {
        flex: 1;
        height: 16px;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 2px;
        position: relative;
        overflow: hidden;
      }

      .timeline-bar {
        position: absolute;
        height: 100%;
        min-width: 2px;
        border-radius: 2px;
        transition: background-color 0.2s;
      }

      .timeline-bar:hover {
        filter: brightness(1.2);
      }

      .timeline-duration {
        width: 80px;
        flex-shrink: 0;
        text-align: right;
        font-size: 11px;
        color: #CE9178;
        padding-left: 8px;
      }

      .timeline-statistics {
        padding: 16px;
        background-color: #16213e;
        border-top: 1px solid #0f3460;
      }

      .stat-row {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
      }

      .stat-label {
        color: #888;
      }

      .stat-value {
        color: #00d4ff;
        font-weight: bold;
      }

      .timeline-table {
        width: 100%;
        margin-top: 16px;
        border-collapse: collapse;
        font-size: 12px;
      }

      .timeline-table th,
      .timeline-table td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #0f3460;
      }

      .timeline-table th {
        background-color: #0f3460;
        color: #00d4ff;
      }

      .timeline-table td {
        color: #eee;
      }
    `;
  }
}

export default TimelineView;
