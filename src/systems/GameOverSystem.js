/**
 * @fileoverview Game Over system - handles game over state and restart
 * @module Systems/GameOverSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var GameOverScreen = window.VampireSurvivors.UI.GameOverScreen;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Constants
  // ============================================
  var PRIORITY = 120; // After LevelUpSystem (115)

  // ============================================
  // Class Definition
  // ============================================
  class GameOverSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _screen = null;
    _player = null;
    _hudSystem = null;
    _isActive = false;
    _finalStats = null;

    // Event handlers
    _boundOnPlayerDied = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._priority = PRIORITY;
      this._updatesDuringPause = true; // Process input in GAME_OVER state
      this._screen = new GameOverScreen();
      this._boundOnPlayerDied = this._onPlayerDied.bind(this);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    initialize(game, entityManager) {
      super.initialize(game, entityManager);

      // Listen for player death event
      events.on('player:died', this._boundOnPlayerDied);
    }

    /**
     * Set player reference
     * @param {Entity} player
     */
    setPlayer(player) {
      this._player = player;
    }

    /**
     * Set HUD system reference (for accessing kill count)
     * @param {HUDSystem} hudSystem
     */
    setHUDSystem(hudSystem) {
      this._hudSystem = hudSystem;
    }

    update(deltaTime) {
      if (!this._isActive || !this._screen.isVisible) return;

      var input = this._game.input;
      var result = this._screen.handleInput(input);

      if (result && result.action === 'restart') {
        this._handleRestart();
      }
    }

    render(ctx) {
      if (this._screen && this._screen.isVisible) {
        this._screen.render(ctx);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _onPlayerDied(data) {
      if (this._isActive) return; // Already showing

      // Collect final stats before state changes
      this._finalStats = this._collectStats();

      // Trigger game over state
      this._game.gameOver();
      this._isActive = true;

      // Show the game over screen
      this._screen.show(this._finalStats, this._game.width, this._game.height);
    }

    _collectStats() {
      var stats = {
        timeSurvived: 0,
        level: 1,
        kills: 0,
        gold: 0,
      };

      // Time from game
      if (this._game) {
        stats.timeSurvived = this._game.elapsedTime || 0;
      }

      // Player stats
      if (this._player) {
        // Level
        if (this._player.experience) {
          stats.level = this._player.experience.level || 1;
        }

        // Gold
        if (this._player.gold) {
          stats.gold = this._player.gold.currentGold || 0;
        }
      }

      // Kill count from HUD system
      if (this._hudSystem && this._hudSystem._hud) {
        stats.kills = this._hudSystem._hud.killCount || 0;
      }

      return stats;
    }

    _handleRestart() {
      this._screen.hide();
      this._isActive = false;
      this._finalStats = null;

      // Emit restart event for app.js to handle
      events.emitSync('game:restart', {});
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get isActive() {
      return this._isActive;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'Game Over',
        entries: [{ key: 'Active', value: this._isActive ? 'Yes' : 'No' }],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      events.off('player:died', this._boundOnPlayerDied);

      if (this._screen) {
        this._screen.dispose();
        this._screen = null;
      }

      this._player = null;
      this._hudSystem = null;
      this._finalStats = null;
      this._boundOnPlayerDied = null;

      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.GameOverSystem = GameOverSystem;
})(window.VampireSurvivors.Systems);
