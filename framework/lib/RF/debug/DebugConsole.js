/**
 * @fileoverview In-game debug console for log history
 * @module Lib/Debug/DebugConsole
 */
(function (Lib) {
  'use strict';

  // ============================================
  // Ensure namespace exists
  // ============================================
  Lib.Debug = Lib.Debug || {};

  // ============================================
  // Imports
  // ============================================
  var Config = Lib.Debug.DebugConfig;

  // ============================================
  // Class Definition
  // ============================================
  class DebugConsole {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _entries = [];
    _maxEntries = 50;
    _visibleEntries = 5;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * Create a debug console
     * @param {Object} [options] - Configuration options
     * @param {number} [options.maxEntries=50] - Maximum log entries
     * @param {number} [options.visibleEntries=5] - Visible entries
     */
    constructor(options) {
      options = options || {};
      this._maxEntries = options.maxEntries || (Config ? Config.CONSOLE_MAX_ENTRIES : 50);
      this._visibleEntries = options.visibleEntries || (Config ? Config.CONSOLE_VISIBLE_ENTRIES : 5);
    }

    // ----------------------------------------
    // Logging Methods
    // ----------------------------------------

    /**
     * Log a message
     * @param {string} message - Log message
     * @param {string} [type='info'] - Log type
     */
    log(message, type) {
      type = type || 'info';

      var entry = {
        timestamp: Date.now(),
        message: String(message),
        type: type,
      };

      this._entries.push(entry);

      if (this._entries.length > this._maxEntries) {
        this._entries.shift();
      }
    }

    /**
     * Log info message
     * @param {string} message
     */
    info(message) {
      this.log(message, 'info');
    }

    /**
     * Log warning message
     * @param {string} message
     */
    warn(message) {
      this.log(message, 'warn');
    }

    /**
     * Log error message
     * @param {string} message
     */
    error(message) {
      this.log(message, 'error');
    }

    /**
     * Log event message
     * @param {string} message
     */
    event(message) {
      this.log(message, 'event');
    }

    /**
     * Log debug message
     * @param {string} message
     */
    debug(message) {
      this.log(message, 'debug');
    }

    /**
     * Clear all entries
     */
    clear() {
      this._entries = [];
    }

    // ----------------------------------------
    // Rendering
    // ----------------------------------------

    /**
     * Render the console
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Available width
     * @returns {number} Next Y position after rendering
     */
    render(ctx, x, y, width) {
      var config = Config || {
        LINE_HEIGHT: 16,
        FONT_SIZE: 12,
        FONT_FAMILY: 'monospace',
        PANEL_PADDING: 8,
        LABEL_COLOR: '#FFFF00',
        TEXT_COLOR: '#00FF00',
        LOG_COLORS: {
          info: '#00FF00',
          warn: '#FFFF00',
          error: '#FF4444',
          event: '#00FFFF',
          debug: '#888888',
        },
      };

      var lineHeight = config.LINE_HEIGHT;
      var fontSize = config.FONT_SIZE;
      var padding = config.PANEL_PADDING;

      // Header
      ctx.fillStyle = config.LABEL_COLOR;
      ctx.font = 'bold ' + fontSize + 'px ' + config.FONT_FAMILY;
      ctx.fillText('Console', x, y);

      y += lineHeight;

      // Get visible entries (most recent)
      var visibleEntries = this._entries.slice(-this._visibleEntries);

      if (visibleEntries.length === 0) {
        ctx.fillStyle = config.TEXT_COLOR;
        ctx.font = fontSize + 'px ' + config.FONT_FAMILY;
        ctx.fillText('  (no logs)', x, y);
        return y + lineHeight;
      }

      ctx.font = fontSize + 'px ' + config.FONT_FAMILY;

      for (var i = 0; i < visibleEntries.length; i++) {
        var entry = visibleEntries[i];
        var color = config.LOG_COLORS[entry.type] || config.TEXT_COLOR;

        ctx.fillStyle = color;

        var prefix = '> ';
        var maxWidth = width - padding * 2 - 20;
        var displayMessage = this._truncateText(ctx, prefix + entry.message, maxWidth);

        ctx.fillText(displayMessage, x + 8, y);
        y += lineHeight;
      }

      return y;
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

    /** All log entries */
    get entries() {
      return this._entries;
    }

    /** Number of entries */
    get count() {
      return this._entries.length;
    }

    /** Maximum entries */
    get maxEntries() {
      return this._maxEntries;
    }

    set maxEntries(value) {
      this._maxEntries = Math.max(1, value);
      while (this._entries.length > this._maxEntries) {
        this._entries.shift();
      }
    }

    /** Visible entries count */
    get visibleEntries() {
      return this._visibleEntries;
    }

    set visibleEntries(value) {
      this._visibleEntries = Math.max(1, value);
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'DebugConsole',
        entries: [
          { key: 'Total', value: this._entries.length },
          { key: 'Max', value: this._maxEntries },
          { key: 'Visible', value: this._visibleEntries },
        ],
      };
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
  Lib.Debug.DebugConsole = DebugConsole;

})(window.RoguelikeFramework.Lib = window.RoguelikeFramework.Lib || {});
