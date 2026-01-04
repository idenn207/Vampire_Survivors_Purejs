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
    _selectedEntity = null;
    _entityManager = null;

    _boundHandleKeyDown = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._console = new DebugConsole();
      this._panel = new DebugPanel(this._console);
      this._panel.setDebugManager(this);

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
      this._isEnabled = !this._isEnabled;

      if (this._isEnabled) {
        // Pause game when debug mode is activated
        if (this._game && this._game.state === 'running') {
          this._game.pause();
          this._console.info('Debug panel opened (game paused)');
        } else {
          this._console.info('Debug panel opened');
        }
      } else {
        // Resume game when debug panel is closed
        if (this._game && this._game.state === 'paused') {
          this._game.resume();
          this._console.info('Debug panel closed (game resumed)');
        }
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

    setEntityManager(entityManager) {
      this._entityManager = entityManager;
    }

    handleClick(input) {
      if (!this._isEnabled) return;
      if (!input.isMousePressed(0)) return;

      // Skip if clicking inside debug panel
      var mouseScreen = input.mousePosition;
      if (this._isInsidePanel(mouseScreen.x, mouseScreen.y)) return;

      var mouseWorld = input.mouseWorldPosition;
      var clicked = this._findEntityAtPosition(mouseWorld.x, mouseWorld.y);

      if (clicked) {
        if (clicked === this._selectedEntity) {
          this.clearSelection(); // Click same entity = deselect
        } else {
          this.selectEntity(clicked);
        }
      } else {
        this.clearSelection(); // Click empty space = deselect
      }
    }

    selectEntity(entity) {
      if (this._selectedEntity) {
        this._selectedEntity.removeTag('debug:selected');
      }
      this._selectedEntity = entity;
      entity.addTag('debug:selected');
      this._panel.setActiveTab(3); // Switch to Entity tab
      this._console.info('Selected entity #' + entity.id);
    }

    clearSelection() {
      if (this._selectedEntity) {
        this._selectedEntity.removeTag('debug:selected');
        this._console.info('Deselected entity');
        this._selectedEntity = null;
      }
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

    _isInsidePanel(screenX, screenY) {
      var panelHeight = this._panel._calculateTotalHeight();
      return (
        screenX >= this._panel._x &&
        screenX <= this._panel._x + this._panel._width &&
        screenY >= this._panel._y &&
        screenY <= this._panel._y + panelHeight
      );
    }

    _findEntityAtPosition(worldX, worldY) {
      if (!this._entityManager) return null;

      var Transform = window.VampireSurvivors.Components.Transform;
      var Sprite = window.VampireSurvivors.Components.Sprite;
      var entities = this._entityManager.getWithComponents(Transform, Sprite);

      // Sort by zIndex descending (top-most first)
      entities.sort(function (a, b) {
        return b.getComponent(Sprite).zIndex - a.getComponent(Sprite).zIndex;
      });

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (!entity.isActive) continue;

        var transform = entity.getComponent(Transform);
        var width = transform.width * transform.scale;
        var height = transform.height * transform.scale;

        // Point-in-rectangle check
        if (
          worldX >= transform.x &&
          worldX <= transform.x + width &&
          worldY >= transform.y &&
          worldY <= transform.y + height
        ) {
          return entity;
        }
      }
      return null;
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

    get selectedEntity() {
      return this._selectedEntity;
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
