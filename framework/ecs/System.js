/**
 * @fileoverview Base system class for ECS pattern
 * @module ECS/System
 */
(function(ECS) {
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

    /**
     * Initialize the system with game and entity manager references
     * @param {Game} game
     * @param {EntityManager} entityManager
     */
    initialize(game, entityManager) {
      this._game = game;
      this._entityManager = entityManager;
    }

    /**
     * Update the system (called each frame)
     * Override in subclass
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
      // Override in subclass
    }

    /**
     * Render the system (called each frame after update)
     * Override in subclass (optional)
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      // Override in subclass (optional)
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------

    /** Game instance reference */
    get game() {
      return this._game;
    }

    /** Entity manager reference */
    get entityManager() {
      return this._entityManager;
    }

    /** Execution priority (lower = earlier) */
    get priority() {
      return this._priority;
    }

    set priority(value) {
      this._priority = value;
    }

    /** Whether the system is enabled */
    get isEnabled() {
      return this._isEnabled;
    }

    set isEnabled(value) {
      this._isEnabled = value;
    }

    /** Whether this system updates during pause */
    get updatesDuringPause() {
      return this._updatesDuringPause;
    }

    set updatesDuringPause(value) {
      this._updatesDuringPause = value;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------

    /**
     * Clean up system resources
     */
    dispose() {
      this._game = null;
      this._entityManager = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  ECS.System = System;

})(window.RoguelikeFramework.ECS);
