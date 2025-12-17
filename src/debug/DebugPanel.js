/**
 * @fileoverview Debug panel for displaying debug information
 * @module Debug/DebugPanel
 */
(function (Debug) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Config = Debug.DebugConfig;

  // ============================================
  // Class Definition
  // ============================================
  class DebugPanel {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _debuggables = [];
    _console = null;
    _x = Config.PANEL_X;
    _y = Config.PANEL_Y;
    _width = Config.PANEL_WIDTH;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor(console) {
      this._console = console;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    addSection(debuggable) {
      if (debuggable && typeof debuggable.getDebugInfo === 'function') {
        this._debuggables.push(debuggable);
      }
    }

    removeSection(label) {
      this._debuggables = this._debuggables.filter(function (d) {
        var info = d.getDebugInfo();
        return info.label !== label;
      });
    }

    render(ctx) {
      var padding = Config.PANEL_PADDING;
      var lineHeight = Config.LINE_HEIGHT;
      var fontSize = Config.FONT_SIZE;

      // Calculate total height
      var totalHeight = this._calculateTotalHeight();

      // Draw background
      ctx.fillStyle = Config.BACKGROUND_COLOR;
      ctx.fillRect(this._x, this._y, this._width, totalHeight);

      // Draw border
      ctx.strokeStyle = Config.BORDER_COLOR;
      ctx.lineWidth = 1;
      ctx.strokeRect(this._x, this._y, this._width, totalHeight);

      // Draw header
      var currentY = this._y + padding + fontSize;

      ctx.fillStyle = Config.HEADER_COLOR;
      ctx.font = 'bold ' + fontSize + 'px ' + Config.FONT_FAMILY;
      ctx.fillText('[DEBUG - F3 to hide]', this._x + padding, currentY);

      currentY += lineHeight + 4;

      // Draw separator line
      ctx.strokeStyle = Config.BORDER_COLOR;
      ctx.beginPath();
      ctx.moveTo(this._x + padding, currentY - 8);
      ctx.lineTo(this._x + this._width - padding, currentY - 8);
      ctx.stroke();

      // Draw sections
      for (var i = 0; i < this._debuggables.length; i++) {
        var debuggable = this._debuggables[i];
        currentY = this._renderSection(ctx, debuggable, currentY);
      }

      // Draw console section
      if (this._console) {
        ctx.strokeStyle = Config.BORDER_COLOR;
        ctx.beginPath();
        ctx.moveTo(this._x + padding, currentY);
        ctx.lineTo(this._x + this._width - padding, currentY);
        ctx.stroke();

        currentY += 8;
        this._console.render(ctx, this._x + padding, currentY, this._width);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _renderSection(ctx, debuggable, startY) {
      var padding = Config.PANEL_PADDING;
      var lineHeight = Config.LINE_HEIGHT;
      var fontSize = Config.FONT_SIZE;

      var info = debuggable.getDebugInfo();
      var currentY = startY;

      // Section label
      ctx.fillStyle = Config.LABEL_COLOR;
      ctx.font = 'bold ' + fontSize + 'px ' + Config.FONT_FAMILY;
      ctx.fillText(info.label, this._x + padding, currentY);

      currentY += lineHeight;

      // Entries
      ctx.font = fontSize + 'px ' + Config.FONT_FAMILY;

      for (var i = 0; i < info.entries.length; i++) {
        var entry = info.entries[i];

        // Key
        ctx.fillStyle = Config.TEXT_COLOR;
        ctx.fillText('  ' + entry.key + ':', this._x + padding, currentY);

        // Value
        ctx.fillStyle = Config.VALUE_COLOR;
        var keyWidth = ctx.measureText('  ' + entry.key + ': ').width;
        ctx.fillText(String(entry.value), this._x + padding + keyWidth, currentY);

        currentY += lineHeight;
      }

      currentY += 4; // Section spacing

      return currentY;
    }

    _calculateTotalHeight() {
      var padding = Config.PANEL_PADDING;
      var lineHeight = Config.LINE_HEIGHT;

      // Header
      var height = padding + lineHeight + 12;

      // Sections
      for (var i = 0; i < this._debuggables.length; i++) {
        var info = this._debuggables[i].getDebugInfo();
        height += lineHeight; // Label
        height += info.entries.length * lineHeight; // Entries
        height += 4; // Section spacing
      }

      // Console section
      if (this._console) {
        height += 8; // Separator spacing
        height += lineHeight; // Label
        height += Math.min(this._console.count, Config.CONSOLE_VISIBLE_ENTRIES) * lineHeight;
        if (this._console.count === 0) {
          height += lineHeight; // "(no logs)" text
        }
      }

      height += padding;

      return height;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get x() {
      return this._x;
    }

    set x(value) {
      this._x = value;
    }

    get y() {
      return this._y;
    }

    set y(value) {
      this._y = value;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._debuggables = [];
      this._console = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Debug.DebugPanel = DebugPanel;
})(window.VampireSurvivors.Debug);
