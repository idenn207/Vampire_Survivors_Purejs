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

      var input = this._game.input;

      // Update dash timer (always)
      this._player.updateDash(deltaTime);

      // Check for dash input (Shift key)
      if (input.isKeyPressed('ShiftLeft') || input.isKeyPressed('ShiftRight')) {
        var direction = input.getMovementDirection();
        // If no movement, use last movement direction
        if (direction.x === 0 && direction.y === 0) {
          direction = input.lastMovementDirection;
        }
        this._player.startDash(direction);
      }

      // Update player (handles velocity)
      this._player.update(deltaTime, input);

      // Update magnet timer
      this._player.updateMagnet(deltaTime);
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
