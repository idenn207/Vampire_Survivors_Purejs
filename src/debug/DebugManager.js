/**
 * @fileoverview Central debug system controller
 * @module Debug/DebugManager
 */
(function (Debug) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Config = Debug.DebugConfig;
  var DebugPanel = Debug.DebugPanel;
  var DebugConsole = Debug.DebugConsole;

  // ============================================
  // Class Definition
  // ============================================
  class DebugManager {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _isEnabled = false;
    _game = null;
    _panel = null;
    _console = null;

    _boundHandleKeyDown = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._console = new DebugConsole();
      this._panel = new DebugPanel(this._console);

      this._boundHandleKeyDown = this._handleKeyDown.bind(this);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    initialize(game) {
      this._game = game;

      window.addEventListener('keydown', this._boundHandleKeyDown);

      // Register core systems for debug info
      if (game.time) {
        this._panel.addSection(game.time);
      }

      this._panel.addSection(game);

      if (game.input) {
        this._panel.addSection(game.input);
      }

      // Register global EventBus
      var events = window.VampireSurvivors.Core.events;
      if (events) {
        this._panel.addSection(events);
      }

      this._console.info('Debug system initialized');
    }

    toggle() {
      // Toggle panel visibility only - no game state change
      this._isEnabled = !this._isEnabled;

      if (this._isEnabled) {
        this._console.info('Debug panel opened');
      }
    }

    togglePause() {
      // Toggle game pause state while keeping panel open
      if (!this._game) return;

      if (this._game.state === 'paused') {
        this._game.resume();
        this._console.info('Game resumed');
      } else if (this._game.state === 'running') {
        this._game.pause();
        this._console.info('Game paused');
      }
    }

    enable() {
      this._isEnabled = true;
    }

    disable() {
      this._isEnabled = false;
    }

    register(debuggable) {
      this._panel.addSection(debuggable);
    }

    registerSummary(provider) {
      this._panel.addSummaryProvider(provider);
    }

    unregister(label) {
      this._panel.removeSection(label);
    }

    log(message, type) {
      this._console.log(message, type);
    }

    info(message) {
      this._console.info(message);
    }

    warn(message) {
      this._console.warn(message);
    }

    error(message) {
      this._console.error(message);
    }

    event(message) {
      this._console.event(message);
    }

    update(deltaTime) {
      // Reserved for future use (animations, etc.)
    }

    render(ctx) {
      if (!this._isEnabled) return;

      // Save context state
      ctx.save();

      // Reset transforms for UI rendering
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      this._panel.render(ctx);

      // Restore context state
      ctx.restore();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _handleKeyDown(e) {
      if (e.code === Config.TOGGLE_KEY) {
        e.preventDefault();
        this.toggle();
        return;
      }

      // Handle pause/resume keys when debug panel is open
      if (this._isEnabled && Config.RESUME_KEYS.indexOf(e.code) !== -1) {
        e.preventDefault();
        this.togglePause(); // Toggle pause, keep panel open
        return;
      }

      // Handle tab switching keys when debug panel is open
      if (this._isEnabled) {
        var tabIndex = Config.TAB_KEYS.indexOf(e.code);
        if (tabIndex !== -1) {
          e.preventDefault();
          this._panel.setActiveTab(tabIndex);
        }
      }
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get isEnabled() {
      return this._isEnabled;
    }

    get console() {
      return this._console;
    }

    get panel() {
      return this._panel;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      window.removeEventListener('keydown', this._boundHandleKeyDown);

      if (this._panel) {
        this._panel.dispose();
        this._panel = null;
      }

      if (this._console) {
        this._console.dispose();
        this._console = null;
      }

      this._game = null;
    }
  }

  // ============================================
  // Singleton Instance
  // ============================================
  Debug.DebugManager = DebugManager;
  Debug.debugManager = new DebugManager();
})(window.VampireSurvivors.Debug);
