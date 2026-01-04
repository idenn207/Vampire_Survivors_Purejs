/**
 * @fileoverview Debug console for log history display
 * @module Debug/DebugConsole
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
  class DebugConsole {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _entries = [];
    _maxEntries = Config.CONSOLE_MAX_ENTRIES;
    _visibleEntries = Config.CONSOLE_VISIBLE_ENTRIES;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    log(message, type) {
      type = type || Config.LOG_TYPE.INFO;

      var entry = {
        timestamp: Date.now(),
        message: message,
        type: type,
      };

      this._entries.push(entry);

      if (this._entries.length > this._maxEntries) {
        this._entries.shift();
      }
    }

    info(message) {
      this.log(message, Config.LOG_TYPE.INFO);
    }

    warn(message) {
      this.log(message, Config.LOG_TYPE.WARN);
    }

    error(message) {
      this.log(message, Config.LOG_TYPE.ERROR);
    }

    event(message) {
      this.log(message, Config.LOG_TYPE.EVENT);
    }

    clear() {
      this._entries = [];
    }

    render(ctx, x, y, width) {
      var lineHeight = Config.LINE_HEIGHT;
      var fontSize = Config.FONT_SIZE;
      var padding = Config.PANEL_PADDING;

      // Header
      ctx.fillStyle = Config.LABEL_COLOR;
      ctx.font = 'bold ' + fontSize + 'px ' + Config.FONT_FAMILY;
      ctx.fillText('Console', x, y);

      y += lineHeight;

      // Get visible entries (most recent)
      var visibleEntries = this._entries.slice(-this._visibleEntries);

      if (visibleEntries.length === 0) {
        ctx.fillStyle = Config.TEXT_COLOR;
        ctx.font = fontSize + 'px ' + Config.FONT_FAMILY;
        ctx.fillText('  (no logs)', x, y);
        return y + lineHeight;
      }

      ctx.font = fontSize + 'px ' + Config.FONT_FAMILY;

      for (var i = 0; i < visibleEntries.length; i++) {
        var entry = visibleEntries[i];
        var color = Config.LOG_COLORS[entry.type] || Config.TEXT_COLOR;

        ctx.fillStyle = color;

        var prefix = '> ';
        var maxWidth = width - padding * 2 - 20;
        var displayMessage = this._truncateText(ctx, prefix + entry.message, maxWidth);

        ctx.fillText(displayMessage, x + 8, y);
        y += lineHeight;
      }

      return y;
    }

    getDebugInfo() {
      return {
        label: 'Console',
        entries: [
          { key: 'Total', value: this._entries.length },
          { key: 'Max', value: this._maxEntries },
        ],
      };
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _truncateText(ctx, text, maxWidth) {
      var width = ctx.measureText(text).width;

      if (width <= maxWidth) {
        return text;
      }

      var ellipsis = '...';
      var ellipsisWidth = ctx.measureText(ellipsis).width;

      while (width > maxWidth - ellipsisWidth && text.length > 0) {
        text = text.slice(0, -1);
        width = ctx.measureText(text).width;
      }

      return text + ellipsis;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get entries() {
      return this._entries;
    }

    get count() {
      return this._entries.length;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._entries = [];
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Debug.DebugConsole = DebugConsole;
})(window.VampireSurvivors.Debug);
