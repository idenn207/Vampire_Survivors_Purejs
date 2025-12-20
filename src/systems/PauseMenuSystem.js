/**
 * @fileoverview PauseMenuSystem - handles ESC key toggle and pause menu lifecycle
 * @module Systems/PauseMenuSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var PauseMenuScreen = window.VampireSurvivors.UI.PauseMenuScreen;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Constants
  // ============================================
  var PRIORITY = 117; // After TabScreenSystem (116), before GameOverSystem (120)

  // ============================================
  // Class Definition
  // ============================================
  class PauseMenuSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _screen = null;
    _player = null;
    _isActive = false;

    // Debounce ESC key
    _escKeyWasPressed = false;

    // Reference to other systems for conflict prevention
    _levelUpSystem = null;
    _gameOverSystem = null;
    _tabScreenSystem = null;
    _techTreeSystem = null;
    _coreSelectionSystem = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._priority = PRIORITY;
      this._updatesDuringPause = true;
      this._screen = new PauseMenuScreen();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Initialize with game and entity manager
     * @param {Object} game
     * @param {Object} entityManager
     */
    initialize(game, entityManager) {
      super.initialize(game, entityManager);

      // Listen for resolution change events
      events.on('settings:resolutionChanged', this._handleResolutionChange.bind(this));
    }

    /**
     * Set player reference
     * @param {Entity} player
     */
    setPlayer(player) {
      this._player = player;
    }

    /**
     * Set reference to LevelUpSystem for conflict prevention
     * @param {Object} levelUpSystem
     */
    setLevelUpSystem(levelUpSystem) {
      this._levelUpSystem = levelUpSystem;
    }

    /**
     * Set reference to GameOverSystem for conflict prevention
     * @param {Object} gameOverSystem
     */
    setGameOverSystem(gameOverSystem) {
      this._gameOverSystem = gameOverSystem;
    }

    /**
     * Set reference to TabScreenSystem for conflict prevention
     * @param {Object} tabScreenSystem
     */
    setTabScreenSystem(tabScreenSystem) {
      this._tabScreenSystem = tabScreenSystem;
    }

    /**
     * Set reference to TechTreeSystem for conflict prevention
     * @param {Object} techTreeSystem
     */
    setTechTreeSystem(techTreeSystem) {
      this._techTreeSystem = techTreeSystem;
    }

    /**
     * Set reference to CoreSelectionSystem for conflict prevention
     * @param {Object} coreSelectionSystem
     */
    setCoreSelectionSystem(coreSelectionSystem) {
      this._coreSelectionSystem = coreSelectionSystem;
    }

    /**
     * Check if pause menu is active
     * @returns {boolean}
     */
    get isActive() {
      return this._isActive;
    }

    /**
     * Update - process ESC key and screen input
     * @param {number} deltaTime
     */
    update(deltaTime) {
      var input = this._game.input;

      // Handle ESC key toggle
      this._handleEscKey(input);

      // Handle screen input when active
      if (this._isActive && this._screen.isVisible) {
        var result = this._screen.handleInput(input);

        if (result) {
          this._handleAction(result);
        }
      }
    }

    /**
     * Render the pause menu
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      if (this._isActive && this._screen) {
        this._screen.render(ctx);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    /**
     * Handle ESC key press
     * @param {Object} input
     */
    _handleEscKey(input) {
      var isEscPressed = input.isKeyDown('Escape');

      // Detect key press (not held)
      if (isEscPressed && !this._escKeyWasPressed) {
        if (this._isActive) {
          // Handle ESC navigation within the menu
          var result = this._screen.handleEscPress();
          if (result && result.action === 'close') {
            this._closeScreen();
          }
        } else if (!this._isAnotherScreenActive()) {
          this._openScreen();
        }
      }

      this._escKeyWasPressed = isEscPressed;
    }

    /**
     * Check if another modal screen is active
     * @returns {boolean}
     */
    _isAnotherScreenActive() {
      // Check LevelUpSystem
      if (this._levelUpSystem && this._levelUpSystem._isActive) {
        return true;
      }

      // Check GameOverSystem
      if (this._gameOverSystem && this._gameOverSystem._isActive) {
        return true;
      }

      // Check TabScreenSystem
      if (this._tabScreenSystem && this._tabScreenSystem.isActive) {
        return true;
      }

      // Check TechTreeSystem popup
      if (this._techTreeSystem && this._techTreeSystem._isPopupActive) {
        return true;
      }

      // Check CoreSelectionSystem
      if (this._coreSelectionSystem && this._coreSelectionSystem._isActive) {
        return true;
      }

      // Check game state
      if (this._game._state === 'game_over') {
        return true;
      }

      return false;
    }

    /**
     * Open the pause menu
     */
    _openScreen() {
      if (!this._player) return;

      this._game.pause();
      this._isActive = true;
      this._screen.show(
        this._player,
        this._game,
        this._game.width,
        this._game.height
      );

      events.emit('pausemenu:opened', {});
    }

    /**
     * Close the pause menu
     */
    _closeScreen() {
      this._screen.hide();
      this._isActive = false;
      this._game.resume();

      events.emit('pausemenu:closed', {});
    }

    /**
     * Handle action from screen
     * @param {Object} result
     */
    _handleAction(result) {
      if (!result) return;

      switch (result.action) {
        case 'continue':
          this._closeScreen();
          break;
      }
    }

    /**
     * Handle resolution change event
     * @param {Object} data
     */
    _handleResolutionChange(data) {
      if (!data || !data.width || !data.height) return;

      // Update game canvas size
      if (this._game && this._game._canvas) {
        this._game._canvas.width = data.width;
        this._game._canvas.height = data.height;
        this._game._width = data.width;
        this._game._height = data.height;

        // Update screen if visible
        if (this._isActive && this._screen.isVisible) {
          this._screen.show(
            this._player,
            this._game,
            data.width,
            data.height
          );
        }
      }
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        name: 'PauseMenuSystem',
        isActive: this._isActive,
        currentView: this._screen ? this._screen._currentView : 'none',
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      if (this._screen) {
        this._screen.dispose();
        this._screen = null;
      }
      this._player = null;
      this._levelUpSystem = null;
      this._gameOverSystem = null;
      this._tabScreenSystem = null;
      this._techTreeSystem = null;
      this._coreSelectionSystem = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.PauseMenuSystem = PauseMenuSystem;
})(window.VampireSurvivors.Systems);
