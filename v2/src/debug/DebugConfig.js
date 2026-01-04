/**
 * @fileoverview Debug system configuration constants
 * @module Debug/DebugConfig
 */
(function (Debug) {
  'use strict';

  // ============================================
  // Configuration Constants
  // ============================================
  var DebugConfig = Object.freeze({
    // Toggle
    TOGGLE_KEY: 'F3',
    RESUME_KEYS: Object.freeze(['Space', 'Enter']),
    TAB_KEYS: Object.freeze(['Digit1', 'Digit2', 'Digit3', 'Digit4']),

    // Panel Position
    PANEL_X: 10,
    PANEL_Y: 10,
    PANEL_WIDTH: 280,
    PANEL_PADDING: 8,

    // Typography
    FONT_SIZE: 12,
    LINE_HEIGHT: 16,
    FONT_FAMILY: 'monospace',

    // Tab Configuration
    TAB_HEIGHT: 24,
    TAB_SPACING: 4,
    TAB_ACTIVE_COLOR: '#FFFFFF',
    TAB_INACTIVE_COLOR: '#888888',
    TAB_ACTIVE_BG: 'rgba(255, 255, 255, 0.2)',

    // Colors
    BACKGROUND_COLOR: 'rgba(0, 0, 0, 0.85)',
    BORDER_COLOR: 'rgba(255, 255, 255, 0.3)',
    HEADER_COLOR: '#FFFFFF',
    LABEL_COLOR: '#FFFF00',
    TEXT_COLOR: '#00FF00',
    VALUE_COLOR: '#00FFFF',
    SUMMARY_BG_COLOR: 'rgba(0, 100, 200, 0.2)',

    // Console
    CONSOLE_MAX_ENTRIES: 50,
    CONSOLE_VISIBLE_ENTRIES: 5,

    // Log Types
    LOG_TYPE: Object.freeze({
      INFO: 'info',
      WARN: 'warn',
      ERROR: 'error',
      EVENT: 'event',
    }),

    // Log Colors
    LOG_COLORS: Object.freeze({
      info: '#00FF00',
      warn: '#FFFF00',
      error: '#FF4444',
      event: '#00FFFF',
    }),

    // Tabs
    TABS: Object.freeze(['Performance', 'Systems', 'Console', 'Entity']),

    // Entity Selection
    SELECTION_BORDER_COLOR: '#FFFF00',
    SELECTION_BORDER_WIDTH: 2,
  });

  // ============================================
  // Export to Namespace
  // ============================================
  Debug.DebugConfig = DebugConfig;
})(window.VampireSurvivors.Debug);
