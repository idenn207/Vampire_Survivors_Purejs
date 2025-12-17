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

    // Panel Position
    PANEL_X: 10,
    PANEL_Y: 10,
    PANEL_WIDTH: 220,
    PANEL_PADDING: 8,

    // Typography
    FONT_SIZE: 12,
    LINE_HEIGHT: 16,
    FONT_FAMILY: 'monospace',

    // Colors
    BACKGROUND_COLOR: 'rgba(0, 0, 0, 0.75)',
    BORDER_COLOR: 'rgba(255, 255, 255, 0.3)',
    HEADER_COLOR: '#FFFFFF',
    LABEL_COLOR: '#FFFF00',
    TEXT_COLOR: '#00FF00',
    VALUE_COLOR: '#00FFFF',

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
  });

  // ============================================
  // Export to Namespace
  // ============================================
  Debug.DebugConfig = DebugConfig;
})(window.VampireSurvivors.Debug);
