/**
 * @fileoverview Base system class for ECS pattern
 * @module Systems/System
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Class Definition
  // ============================================
  class System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _game = null;
    _entityManager = null;
    _priority = 0;
    _isEnabled = true;
    _updatesDuringPause = false; // Set to true for UI systems that need input during pause

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    initialize(game, entityManager) {
      this._game = game;
      this._entityManager = entityManager;
    }

    update(deltaTime) {
      // Override in subclass
    }

    render(ctx) {
      // Override in subclass (optional)
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get game() {
      return this._game;
    }

    get entityManager() {
      return this._entityManager;
    }

    get priority() {
      return this._priority;
    }

    set priority(value) {
      this._priority = value;
    }

    get isEnabled() {
      return this._isEnabled;
    }

    set isEnabled(value) {
      this._isEnabled = value;
    }

    get updatesDuringPause() {
      return this._updatesDuringPause;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._game = null;
      this._entityManager = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.System = System;
})(window.VampireSurvivors.Systems);
