/**
 * @fileoverview TabScreenSystem - handles Tab key toggle and tab screen lifecycle
 * @module Systems/TabScreenSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var TabScreen = window.VampireSurvivors.UI.TabScreen;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Constants
  // ============================================
  var PRIORITY = 116; // After LevelUpSystem (115), before GameOverSystem (120)
  var TAB_KEY_CODE = 9; // Tab key

  // ============================================
  // Class Definition
  // ============================================
  class TabScreenSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _screen = null;
    _player = null;
    _isActive = false;

    // Debounce tab key
    _tabKeyWasPressed = false;

    // Reference to other systems to check their state
    _levelUpSystem = null;
    _gameOverSystem = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._priority = PRIORITY;
      this._updatesDuringPause = true;
      this._screen = new TabScreen();
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
     * Check if tab screen is active
     * @returns {boolean}
     */
    get isActive() {
      return this._isActive;
    }

    /**
     * Update - process Tab key and screen input
     * @param {number} deltaTime
     */
    update(deltaTime) {
      var input = this._game.input;

      // Handle Tab key toggle
      this._handleTabKey(input);

      // Handle screen input when active
      if (this._isActive && this._screen.isVisible) {
        var result = this._screen.handleInput(input);

        if (result) {
          this._handleAction(result);
        }
      }
    }

    /**
     * Render the tab screen
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
     * Handle Tab key press
     * @param {Object} input
     */
    _handleTabKey(input) {
      var isTabPressed = input.isKeyDown('Tab');

      // Detect key press (not held)
      if (isTabPressed && !this._tabKeyWasPressed) {
        if (this._isActive) {
          this._closeScreen();
        } else if (!this._isAnotherScreenActive()) {
          this._openScreen();
        }
      }

      this._tabKeyWasPressed = isTabPressed;
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

      // Check game state
      if (this._game._state === 'game_over') {
        return true;
      }

      return false;
    }

    /**
     * Open the tab screen
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

      events.emit('tabscreen:opened', {});
    }

    /**
     * Close the tab screen
     */
    _closeScreen() {
      this._screen.hide();
      this._isActive = false;
      this._game.resume();

      events.emit('tabscreen:closed', {});
    }

    /**
     * Handle action from screen
     * @param {Object} result
     */
    _handleAction(result) {
      if (!result) return;

      if (result.action === 'close') {
        this._closeScreen();
      }
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
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.TabScreenSystem = TabScreenSystem;
})(window.VampireSurvivors.Systems);
