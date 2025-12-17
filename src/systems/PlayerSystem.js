/**
 * @fileoverview Player system - handles player input to velocity
 * @module Systems/PlayerSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;

  // ============================================
  // Class Definition
  // ============================================
  class PlayerSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 5; // Before MovementSystem (10)
    _player = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    setPlayer(player) {
      this._player = player;
    }

    update(deltaTime) {
      if (!this._player || !this._player.isActive) return;
      if (!this._game || !this._game.input) return;

      this._player.update(deltaTime, this._game.input);
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get player() {
      return this._player;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._player = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.PlayerSystem = PlayerSystem;
})(window.VampireSurvivors.Systems);
