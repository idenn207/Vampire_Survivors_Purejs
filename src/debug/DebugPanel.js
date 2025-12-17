/**
 * @fileoverview Debug panel with tabbed interface for displaying debug information
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
    _summaryProviders = [];
    _console = null;
    _debugManager = null;
    _x = Config.PANEL_X;
    _y = Config.PANEL_Y;
    _width = Config.PANEL_WIDTH;
    _activeTab = 0;

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

    addSummaryProvider(provider) {
      if (provider && typeof provider.getSummaryInfo === 'function') {
        this._summaryProviders.push(provider);
      }
    }

    setDebugManager(debugManager) {
      this._debugManager = debugManager;
    }

    removeSection(label) {
      this._debuggables = this._debuggables.filter(function (d) {
        var info = d.getDebugInfo();
        return info.label !== label;
      });
    }

    setActiveTab(index) {
      if (index >= 0 && index < Config.TABS.length) {
        this._activeTab = index;
      }
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
      ctx.fillText('[DEBUG]', this._x + padding, currentY);

      // Draw keyboard hints
      ctx.fillStyle = Config.VALUE_COLOR;
      ctx.font = (fontSize - 1) + 'px ' + Config.FONT_FAMILY;
      var hintText = 'F3:Hide  Space:Pause  1-4:Tabs';
      var hintWidth = ctx.measureText(hintText).width;
      ctx.fillText(hintText, this._x + this._width - padding - hintWidth, currentY);

      currentY += lineHeight + 4;

      // Draw separator line
      this._drawSeparator(ctx, currentY - 8);

      // Draw summary section
      currentY = this._renderSummary(ctx, currentY);

      // Draw separator line
      this._drawSeparator(ctx, currentY);
      currentY += 8;

      // Draw tabs
      currentY = this._renderTabs(ctx, currentY);

      // Draw separator line
      this._drawSeparator(ctx, currentY);
      currentY += 8;

      // Draw active tab content
      switch (this._activeTab) {
        case 0:
          this._renderPerformanceTab(ctx, currentY);
          break;
        case 1:
          this._renderSystemsTab(ctx, currentY);
          break;
        case 2:
          this._renderConsoleTab(ctx, currentY);
          break;
        case 3:
          this._renderEntityTab(ctx, currentY);
          break;
      }
    }

    // ----------------------------------------
    // Private Methods - Rendering
    // ----------------------------------------
    _drawSeparator(ctx, y) {
      var padding = Config.PANEL_PADDING;
      ctx.strokeStyle = Config.BORDER_COLOR;
      ctx.beginPath();
      ctx.moveTo(this._x + padding, y);
      ctx.lineTo(this._x + this._width - padding, y);
      ctx.stroke();
    }

    _renderSummary(ctx, startY) {
      var padding = Config.PANEL_PADDING;
      var lineHeight = Config.LINE_HEIGHT;
      var fontSize = Config.FONT_SIZE;
      var currentY = startY;

      // Draw summary background
      var summaryHeight = lineHeight * 3 + 4;
      ctx.fillStyle = Config.SUMMARY_BG_COLOR;
      ctx.fillRect(this._x + 2, currentY - 4, this._width - 4, summaryHeight);

      ctx.font = fontSize + 'px ' + Config.FONT_FAMILY;

      // Collect all summary info
      var summaryEntries = [];
      for (var i = 0; i < this._summaryProviders.length; i++) {
        var provider = this._summaryProviders[i];
        var info = provider.getSummaryInfo();
        if (info && Array.isArray(info)) {
          summaryEntries = summaryEntries.concat(info);
        }
      }

      // Render summary entries in a compact 2-column layout
      var colWidth = (this._width - padding * 2) / 2;
      var col = 0;
      var rowY = currentY;

      for (var j = 0; j < summaryEntries.length; j++) {
        var entry = summaryEntries[j];
        var xPos = this._x + padding + col * colWidth;

        // Key
        ctx.fillStyle = Config.TEXT_COLOR;
        ctx.fillText(entry.key + ':', xPos, rowY);

        // Value
        ctx.fillStyle = Config.VALUE_COLOR;
        var keyWidth = ctx.measureText(entry.key + ': ').width;
        var valueText = String(entry.value);
        // Truncate if too long
        var maxValueWidth = colWidth - keyWidth - 10;
        if (ctx.measureText(valueText).width > maxValueWidth) {
          while (ctx.measureText(valueText + '...').width > maxValueWidth && valueText.length > 0) {
            valueText = valueText.slice(0, -1);
          }
          valueText += '...';
        }
        ctx.fillText(valueText, xPos + keyWidth, rowY);

        col++;
        if (col >= 2) {
          col = 0;
          rowY += lineHeight;
        }
      }

      // If odd number of entries, move to next row
      if (col !== 0) {
        rowY += lineHeight;
      }

      return rowY + 4;
    }

    _renderTabs(ctx, startY) {
      var padding = Config.PANEL_PADDING;
      var fontSize = Config.FONT_SIZE;
      var tabHeight = Config.TAB_HEIGHT;
      var tabs = Config.TABS;

      var tabWidth = (this._width - padding * 2 - Config.TAB_SPACING * (tabs.length - 1)) / tabs.length;
      var currentY = startY;

      for (var i = 0; i < tabs.length; i++) {
        var tabX = this._x + padding + i * (tabWidth + Config.TAB_SPACING);
        var isActive = i === this._activeTab;

        // Draw tab background
        if (isActive) {
          ctx.fillStyle = Config.TAB_ACTIVE_BG;
          ctx.fillRect(tabX, currentY, tabWidth, tabHeight - 4);
        }

        // Draw tab text
        ctx.fillStyle = isActive ? Config.TAB_ACTIVE_COLOR : Config.TAB_INACTIVE_COLOR;
        ctx.font = (isActive ? 'bold ' : '') + fontSize + 'px ' + Config.FONT_FAMILY;

        var text = tabs[i];
        var textWidth = ctx.measureText(text).width;
        var textX = tabX + (tabWidth - textWidth) / 2;
        var textY = currentY + (tabHeight - 4) / 2 + fontSize / 2 - 2;

        ctx.fillText(text, textX, textY);

        // Draw underline for active tab
        if (isActive) {
          ctx.strokeStyle = Config.TAB_ACTIVE_COLOR;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(tabX, currentY + tabHeight - 4);
          ctx.lineTo(tabX + tabWidth, currentY + tabHeight - 4);
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      }

      return currentY + tabHeight;
    }

    _renderPerformanceTab(ctx, startY) {
      var currentY = startY;

      // Find Time debuggable
      for (var i = 0; i < this._debuggables.length; i++) {
        var debuggable = this._debuggables[i];
        var info = debuggable.getDebugInfo();
        if (info.label === 'Time') {
          currentY = this._renderSection(ctx, debuggable, currentY);
          break;
        }
      }

      // Find Game debuggable
      for (var j = 0; j < this._debuggables.length; j++) {
        var debuggable2 = this._debuggables[j];
        var info2 = debuggable2.getDebugInfo();
        if (info2.label === 'Game') {
          currentY = this._renderSection(ctx, debuggable2, currentY);
          break;
        }
      }

      return currentY;
    }

    _renderSystemsTab(ctx, startY) {
      var currentY = startY;

      // Render all debuggables except Time and Game (shown in Performance)
      for (var i = 0; i < this._debuggables.length; i++) {
        var debuggable = this._debuggables[i];
        var info = debuggable.getDebugInfo();
        if (info.label !== 'Time' && info.label !== 'Game') {
          currentY = this._renderSection(ctx, debuggable, currentY);
        }
      }

      return currentY;
    }

    _renderConsoleTab(ctx, startY) {
      if (this._console) {
        this._console.render(ctx, this._x + Config.PANEL_PADDING, startY, this._width);
      }
      return startY;
    }

    _renderEntityTab(ctx, startY) {
      var padding = Config.PANEL_PADDING;
      var lineHeight = Config.LINE_HEIGHT;
      var fontSize = Config.FONT_SIZE;
      var currentY = startY;

      var selectedEntity = this._debugManager ? this._debugManager.selectedEntity : null;

      if (!selectedEntity) {
        ctx.fillStyle = Config.TEXT_COLOR;
        ctx.font = fontSize + 'px ' + Config.FONT_FAMILY;
        ctx.fillText('Click an entity to inspect', this._x + padding, currentY);
        return currentY + lineHeight;
      }

      var info = selectedEntity.getDebugInfo();

      // Render label
      ctx.fillStyle = Config.LABEL_COLOR;
      ctx.font = 'bold ' + fontSize + 'px ' + Config.FONT_FAMILY;
      ctx.fillText(info.label, this._x + padding, currentY);
      currentY += lineHeight;

      // Render entries
      ctx.font = fontSize + 'px ' + Config.FONT_FAMILY;
      for (var i = 0; i < info.entries.length; i++) {
        var entry = info.entries[i];
        ctx.fillStyle = Config.TEXT_COLOR;
        ctx.fillText('  ' + entry.key + ':', this._x + padding, currentY);
        ctx.fillStyle = Config.VALUE_COLOR;
        var keyWidth = ctx.measureText('  ' + entry.key + ': ').width;
        ctx.fillText(String(entry.value), this._x + padding + keyWidth, currentY);
        currentY += lineHeight;
      }

      return currentY;
    }

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
      var tabHeight = Config.TAB_HEIGHT;

      // Header
      var height = padding + lineHeight + 12;

      // Summary section (3 lines max + padding)
      height += lineHeight * 3 + 12;

      // Tab bar
      height += tabHeight + 8;

      // Tab content (estimate based on active tab)
      switch (this._activeTab) {
        case 0: // Performance
          height += this._calculatePerformanceHeight();
          break;
        case 1: // Systems
          height += this._calculateSystemsHeight();
          break;
        case 2: // Console
          height += this._calculateConsoleHeight();
          break;
        case 3: // Entity
          height += this._calculateEntityHeight();
          break;
      }

      height += padding;

      return height;
    }

    _calculatePerformanceHeight() {
      var lineHeight = Config.LINE_HEIGHT;
      var height = 0;

      for (var i = 0; i < this._debuggables.length; i++) {
        var info = this._debuggables[i].getDebugInfo();
        if (info.label === 'Time' || info.label === 'Game') {
          height += lineHeight; // Label
          height += info.entries.length * lineHeight; // Entries
          height += 4; // Section spacing
        }
      }

      return height;
    }

    _calculateSystemsHeight() {
      var lineHeight = Config.LINE_HEIGHT;
      var height = 0;

      for (var i = 0; i < this._debuggables.length; i++) {
        var info = this._debuggables[i].getDebugInfo();
        if (info.label !== 'Time' && info.label !== 'Game') {
          height += lineHeight; // Label
          height += info.entries.length * lineHeight; // Entries
          height += 4; // Section spacing
        }
      }

      return height;
    }

    _calculateConsoleHeight() {
      var lineHeight = Config.LINE_HEIGHT;
      var height = lineHeight; // Label

      if (this._console) {
        height += Math.min(this._console.count, Config.CONSOLE_VISIBLE_ENTRIES) * lineHeight;
        if (this._console.count === 0) {
          height += lineHeight; // "(no logs)" text
        }
      }

      return height;
    }

    _calculateEntityHeight() {
      var lineHeight = Config.LINE_HEIGHT;
      var selectedEntity = this._debugManager ? this._debugManager.selectedEntity : null;

      if (!selectedEntity) {
        return lineHeight; // Just "Click an entity to inspect" message
      }

      var info = selectedEntity.getDebugInfo();
      return lineHeight + info.entries.length * lineHeight;
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

    get activeTab() {
      return this._activeTab;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._debuggables = [];
      this._summaryProviders = [];
      this._console = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Debug.DebugPanel = DebugPanel;
})(window.VampireSurvivors.Debug);
