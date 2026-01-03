/**
 * @fileoverview Base behavior class for strategy pattern
 * @module Lib/Patterns/Behavior
 */
(function (Lib) {
  'use strict';

  // ============================================
  // Ensure namespace exists
  // ============================================
  Lib.Patterns = Lib.Patterns || {};

  // ============================================
  // Class Definition
  // ============================================
  class Behavior {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _isInitialized = false;
    _context = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Lifecycle Methods
    // ----------------------------------------

    /**
     * Initialize the behavior with dependencies
     * @param {Object} context - Context object with dependencies
     * @virtual
     */
    initialize(context) {
      this._context = context;
      this._isInitialized = true;
    }

    /**
     * Execute the behavior
     * @param {Entity} owner - Entity executing this behavior
     * @param {number} [deltaTime] - Time since last update
     * @abstract
     */
    execute(owner, deltaTime) {
      throw new Error('Behavior.execute() must be implemented by subclass');
    }

    /**
     * Check if behavior can execute
     * @param {Entity} owner - Entity to check
     * @returns {boolean}
     * @virtual
     */
    canExecute(owner) {
      return this._isInitialized;
    }

    /**
     * Clean up resources
     * @virtual
     */
    dispose() {
      this._context = null;
      this._isInitialized = false;
    }

    // ----------------------------------------
    // Protected Helper Methods
    // ----------------------------------------

    /**
     * Get entity manager from context
     * @protected
     * @returns {EntityManager|null}
     */
    _getEntityManager() {
      return this._context ? this._context.entityManager : null;
    }

    /**
     * Get input from context
     * @protected
     * @returns {Input|null}
     */
    _getInput() {
      return this._context ? this._context.input : null;
    }

    /**
     * Get event bus from context
     * @protected
     * @returns {EventBus|null}
     */
    _getEvents() {
      return this._context ? this._context.events : null;
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------

    /** Is behavior initialized? */
    get isInitialized() {
      return this._isInitialized;
    }

    /** Context object */
    get context() {
      return this._context;
    }
  }

  // ============================================
  // Weapon Behavior Base (Example Extension)
  // ============================================
  class WeaponBehavior extends Behavior {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _player = null;

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------

    /**
     * Initialize with additional player reference
     * @param {Object} context - Context with entityManager, input, events
     * @override
     */
    initialize(context) {
      super.initialize(context);
    }

    /**
     * Set current player reference
     * @param {Entity} player
     */
    setPlayer(player) {
      this._player = player;
    }

    // ----------------------------------------
    // Targeting Helpers
    // ----------------------------------------

    /**
     * Find nearest enemy to player
     * @param {number} range - Search range
     * @returns {Entity|null}
     */
    findNearestEnemy(range) {
      var player = this._player;
      if (!player) return null;

      var Transform = window.RoguelikeFramework.Components.Transform;
      var playerTransform = player.getComponent(Transform);
      if (!playerTransform) return null;

      var enemies = this._getEntityManager().getByTag('enemy');
      var rangeSq = range * range;

      var nearest = null;
      var nearestDistSq = Infinity;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        var dx = enemyTransform.centerX - playerTransform.centerX;
        var dy = enemyTransform.centerY - playerTransform.centerY;
        var distSq = dx * dx + dy * dy;

        if (distSq <= rangeSq && distSq < nearestDistSq) {
          nearestDistSq = distSq;
          nearest = enemy;
        }
      }

      return nearest;
    }

    /**
     * Find random enemy in range
     * @param {number} range - Search range
     * @returns {Entity|null}
     */
    findRandomEnemy(range) {
      var player = this._player;
      if (!player) return null;

      var Transform = window.RoguelikeFramework.Components.Transform;
      var playerTransform = player.getComponent(Transform);
      if (!playerTransform) return null;

      var enemies = this._getEntityManager().getByTag('enemy');
      var rangeSq = range * range;
      var inRange = [];

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        var dx = enemyTransform.centerX - playerTransform.centerX;
        var dy = enemyTransform.centerY - playerTransform.centerY;
        var distSq = dx * dx + dy * dy;

        if (distSq <= rangeSq) {
          inRange.push(enemy);
        }
      }

      if (inRange.length === 0) return null;
      return inRange[Math.floor(Math.random() * inRange.length)];
    }

    /**
     * Get all enemies in range
     * @param {number} range - Search range
     * @returns {Array<Entity>}
     */
    getEnemiesInRange(range) {
      var player = this._player;
      if (!player) return [];

      var Transform = window.RoguelikeFramework.Components.Transform;
      var playerTransform = player.getComponent(Transform);
      if (!playerTransform) return [];

      var enemies = this._getEntityManager().getByTag('enemy');
      var rangeSq = range * range;
      var inRange = [];

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        var dx = enemyTransform.centerX - playerTransform.centerX;
        var dy = enemyTransform.centerY - playerTransform.centerY;
        var distSq = dx * dx + dy * dy;

        if (distSq <= rangeSq) {
          inRange.push(enemy);
        }
      }

      return inRange;
    }

    // ----------------------------------------
    // Direction Helpers
    // ----------------------------------------

    /**
     * Get direction from mouse position
     * @returns {{ x: number, y: number }}
     */
    getMouseDirection() {
      var player = this._player;
      var input = this._getInput();
      if (!player || !input) return { x: 1, y: 0 };

      var Transform = window.RoguelikeFramework.Components.Transform;
      var playerTransform = player.getComponent(Transform);
      if (!playerTransform) return { x: 1, y: 0 };

      var mousePos = input.mouseWorldPosition;
      var dx = mousePos.x - playerTransform.centerX;
      var dy = mousePos.y - playerTransform.centerY;
      var length = Math.sqrt(dx * dx + dy * dy);

      if (length === 0) return { x: 1, y: 0 };

      return { x: dx / length, y: dy / length };
    }

    /**
     * Get direction to target entity
     * @param {Entity} target - Target entity
     * @returns {{ x: number, y: number }}
     */
    getDirectionToTarget(target) {
      var player = this._player;
      if (!player || !target) return { x: 1, y: 0 };

      var Transform = window.RoguelikeFramework.Components.Transform;
      var playerTransform = player.getComponent(Transform);
      var targetTransform = target.getComponent(Transform);
      if (!playerTransform || !targetTransform) return { x: 1, y: 0 };

      var dx = targetTransform.centerX - playerTransform.centerX;
      var dy = targetTransform.centerY - playerTransform.centerY;
      var length = Math.sqrt(dx * dx + dy * dy);

      if (length === 0) return { x: 1, y: 0 };

      return { x: dx / length, y: dy / length };
    }

    /**
     * Get random direction
     * @returns {{ x: number, y: number }}
     */
    getRandomDirection() {
      var angle = Math.random() * Math.PI * 2;
      return { x: Math.cos(angle), y: Math.sin(angle) };
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------

    /** Current player reference */
    get player() {
      return this._player;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Lib.Patterns.Behavior = Behavior;
  Lib.Patterns.WeaponBehavior = WeaponBehavior;

})(window.RoguelikeFramework.Lib = window.RoguelikeFramework.Lib || {});
