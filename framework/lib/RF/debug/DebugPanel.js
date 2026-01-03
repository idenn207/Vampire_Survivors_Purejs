/**
 * @fileoverview Visual debug panel with tabs
 * @module Lib/Debug/DebugPanel
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
  var DebugConsole = Lib.Debug.DebugConsole;

  // ============================================
  // Class Definition
  // ============================================
  class DebugPanel {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _isVisible = false;
    _activeTab = 0;
    _debuggables = [];
    _summaryProviders = [];
    _console = null;
    _game = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * Create a debug panel
     * @param {Object} [options] - Configuration options
     */
    constructor(options) {
      options = options || {};
      this._console = new DebugConsole();
    }

    // ----------------------------------------
    // Initialization
    // ----------------------------------------

    /**
     * Initialize with game reference
     * @param {Game} game - Game instance
     */
    initialize(game) {
      this._game = game;
    }

    // ----------------------------------------
    // Section Management
    // ----------------------------------------

    /**
     * Add a debuggable object (implements getDebugInfo)
     * @param {Object} debuggable - Object with getDebugInfo() method
     */
    addSection(debuggable) {
      if (debuggable && typeof debuggable.getDebugInfo === 'function') {
        this._debuggables.push(debuggable);
      }
    }

    /**
     * Remove a debuggable object
     * @param {Object} debuggable
     */
    removeSection(debuggable) {
      var index = this._debuggables.indexOf(debuggable);
      if (index !== -1) {
        this._debuggables.splice(index, 1);
      }
    }

    /**
     * Add a summary provider (implements getSummaryInfo)
     * @param {Object} provider - Object with getSummaryInfo() method
     */
    addSummary(provider) {
      if (provider && typeof provider.getSummaryInfo === 'function') {
        this._summaryProviders.push(provider);
      }
    }

    // ----------------------------------------
    // Tab Management
    // ----------------------------------------

    /**
     * Set active tab by index
     * @param {number} index - Tab index (0-based)
     */
    setActiveTab(index) {
      var tabs = Config ? Config.TABS : ['Performance', 'Systems', 'Console', 'Entity'];
      this._activeTab = Math.max(0, Math.min(index, tabs.length - 1));
    }

    /**
     * Get current active tab index
     * @returns {number}
     */
    getActiveTab() {
      return this._activeTab;
    }

    // ----------------------------------------
    // Visibility
    // ----------------------------------------

    /**
     * Toggle panel visibility
     */
    toggle() {
      this._isVisible = !this._isVisible;
    }

    /**
     * Show panel
     */
    show() {
      this._isVisible = true;
    }

    /**
     * Hide panel
     */
    hide() {
      this._isVisible = false;
    }

    // ----------------------------------------
    // Rendering
    // ----------------------------------------

    /**
     * Render the debug panel
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
      if (!this._isVisible) return;

      var config = Config || this._getDefaultConfig();

      var x = config.PANEL_X;
      var y = config.PANEL_Y;
      var width = config.PANEL_WIDTH;
      var padding = config.PANEL_PADDING;

      // Calculate panel height based on content
      var contentHeight = this._calculateContentHeight(ctx, config);
      var height = contentHeight + padding * 2 + config.TAB_HEIGHT + 20;

      // Draw background
      ctx.fillStyle = config.BACKGROUND_COLOR;
      ctx.fillRect(x, y, width, height);

      // Draw border
      ctx.strokeStyle = config.BORDER_COLOR;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);

      // Draw tabs
      var tabY = this._renderTabs(ctx, x, y, width, config);

      // Draw content
      var contentX = x + padding;
      var contentY = tabY + padding;

      switch (this._activeTab) {
        case 0:
          this._renderPerformanceTab(ctx, contentX, contentY, width - padding * 2, config);
          break;
        case 1:
          this._renderSystemsTab(ctx, contentX, contentY, width - padding * 2, config);
          break;
        case 2:
          this._renderConsoleTab(ctx, contentX, contentY, width - padding * 2, config);
          break;
        case 3:
          this._renderEntityTab(ctx, contentX, contentY, width - padding * 2, config);
          break;
      }
    }

    // ----------------------------------------
    // Tab Rendering
    // ----------------------------------------
    _renderTabs(ctx, x, y, width, config) {
      var tabs = config.TABS;
      var tabWidth = (width - config.TAB_SPACING * (tabs.length - 1)) / tabs.length;
      var tabHeight = config.TAB_HEIGHT;

      for (var i = 0; i < tabs.length; i++) {
        var tabX = x + i * (tabWidth + config.TAB_SPACING);
        var isActive = i === this._activeTab;

        // Tab background
        if (isActive) {
          ctx.fillStyle = config.TAB_ACTIVE_BG;
          ctx.fillRect(tabX, y, tabWidth, tabHeight);
        }

        // Tab text
        ctx.fillStyle = isActive ? config.TAB_ACTIVE_COLOR : config.TAB_INACTIVE_COLOR;
        ctx.font = config.FONT_SIZE + 'px ' + config.FONT_FAMILY;
        ctx.textAlign = 'center';
        ctx.fillText(tabs[i], tabX + tabWidth / 2, y + tabHeight / 2 + 4);
      }

      ctx.textAlign = 'left';
      return y + tabHeight;
    }

    // ----------------------------------------
    // Content Tabs
    // ----------------------------------------
    _renderPerformanceTab(ctx, x, y, width, config) {
      var lineHeight = config.LINE_HEIGHT;

      // Summary info
      for (var i = 0; i < this._summaryProviders.length; i++) {
        var provider = this._summaryProviders[i];
        var summaryInfo = provider.getSummaryInfo();

        for (var j = 0; j < summaryInfo.length; j++) {
          var entry = summaryInfo[j];
          y = this._renderKeyValue(ctx, x, y, entry.key, entry.value, width, config);
        }
      }

      // Game info
      if (this._game) {
        y += lineHeight / 2;
        ctx.fillStyle = config.LABEL_COLOR;
        ctx.font = 'bold ' + config.FONT_SIZE + 'px ' + config.FONT_FAMILY;
        ctx.fillText('Game', x, y);
        y += lineHeight;

        y = this._renderKeyValue(ctx, x, y, 'State', this._game.state, width, config);
        if (this._game.time) {
          y = this._renderKeyValue(ctx, x, y, 'FPS', this._game.time.fps, width, config);
          y = this._renderKeyValue(ctx, x, y, 'Delta', this._game.time.deltaTime.toFixed(3) + 's', width, config);
        }
      }
    }

    _renderSystemsTab(ctx, x, y, width, config) {
      var lineHeight = config.LINE_HEIGHT;

      for (var i = 0; i < this._debuggables.length; i++) {
        var debuggable = this._debuggables[i];
        var info = debuggable.getDebugInfo();

        // Section header
        ctx.fillStyle = config.LABEL_COLOR;
        ctx.font = 'bold ' + config.FONT_SIZE + 'px ' + config.FONT_FAMILY;
        ctx.fillText(info.label, x, y);
        y += lineHeight;

        // Entries
        for (var j = 0; j < info.entries.length; j++) {
          var entry = info.entries[j];
          y = this._renderKeyValue(ctx, x + 8, y, entry.key, entry.value, width - 8, config);
        }

        y += lineHeight / 2;
      }
    }

    _renderConsoleTab(ctx, x, y, width, config) {
      if (this._console) {
        this._console.render(ctx, x, y, width);
      }
    }

    _renderEntityTab(ctx, x, y, width, config) {
      ctx.fillStyle = config.TEXT_COLOR;
      ctx.font = config.FONT_SIZE + 'px ' + config.FONT_FAMILY;
      ctx.fillText('Click entity to inspect', x, y);
    }

    // ----------------------------------------
    // Helper Methods
    // ----------------------------------------
    _renderKeyValue(ctx, x, y, key, value, width, config) {
      ctx.font = config.FONT_SIZE + 'px ' + config.FONT_FAMILY;

      ctx.fillStyle = config.TEXT_COLOR;
      ctx.fillText(key + ':', x, y);

      var valueX = x + 100;
      ctx.fillStyle = config.VALUE_COLOR;
      ctx.fillText(String(value), valueX, y);

      return y + config.LINE_HEIGHT;
    }

    _calculateContentHeight(ctx, config) {
      var lines = 0;

      switch (this._activeTab) {
        case 0: // Performance
          lines = this._summaryProviders.length * 3 + 5;
          break;
        case 1: // Systems
          lines = this._debuggables.length * 4;
          break;
        case 2: // Console
          lines = this._console ? this._console.visibleEntries + 2 : 3;
          break;
        case 3: // Entity
          lines = 5;
          break;
      }

      return lines * config.LINE_HEIGHT;
    }

    _getDefaultConfig() {
      return {
        PANEL_X: 10,
        PANEL_Y: 10,
        PANEL_WIDTH: 280,
        PANEL_PADDING: 8,
        FONT_SIZE: 12,
        LINE_HEIGHT: 16,
        FONT_FAMILY: 'monospace',
        TAB_HEIGHT: 24,
        TAB_SPACING: 4,
        TAB_ACTIVE_COLOR: '#FFFFFF',
        TAB_INACTIVE_COLOR: '#888888',
        TAB_ACTIVE_BG: 'rgba(255, 255, 255, 0.2)',
        BACKGROUND_COLOR: 'rgba(0, 0, 0, 0.85)',
        BORDER_COLOR: 'rgba(255, 255, 255, 0.3)',
        LABEL_COLOR: '#FFFF00',
        TEXT_COLOR: '#00FF00',
        VALUE_COLOR: '#00FFFF',
        TABS: ['Performance', 'Systems', 'Console', 'Entity'],
      };
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------

    /** Is panel visible? */
    get isVisible() {
      return this._isVisible;
    }

    /** Debug console instance */
    get console() {
      return this._console;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'DebugPanel',
        entries: [
          { key: 'Visible', value: this._isVisible ? 'Yes' : 'No' },
          { key: 'Tab', value: this._activeTab },
          { key: 'Sections', value: this._debuggables.length },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      if (this._console) {
        this._console.dispose();
        this._console = null;
      }
      this._debuggables = [];
      this._summaryProviders = [];
      this._game = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Lib.Debug.DebugPanel = DebugPanel;

})(window.RoguelikeFramework.Lib = window.RoguelikeFramework.Lib || {});
