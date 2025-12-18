/**
 * @fileoverview Base weapon behavior class - abstract class for weapon execution logic
 * @module Behaviors/WeaponBehavior
 */
(function (Behaviors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Transform = window.VampireSurvivors.Components.Transform;
  var Health = window.VampireSurvivors.Components.Health;
  var Vector2 = window.VampireSurvivors.Utils.Vector2;

  // ============================================
  // Class Definition
  // ============================================
  class WeaponBehavior {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _entityManager = null;
    _input = null;
    _events = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Initialize behavior with dependencies
     * @param {EntityManager} entityManager
     * @param {Input} input
     * @param {EventBus} events
     */
    initialize(entityManager, input, events) {
      this._entityManager = entityManager;
      this._input = input;
      this._events = events;
    }

    /**
     * Execute the weapon behavior (abstract - override in subclass)
     * @param {Weapon} weapon - Weapon component
     * @param {Entity} player - Player entity
     * @returns {Array} Array of spawned entities/effects
     */
    execute(weapon, player) {
      throw new Error('[WeaponBehavior] execute() must be implemented by subclass');
    }

    // ----------------------------------------
    // Targeting Helpers
    // ----------------------------------------
    /**
     * Find the nearest enemy to the player
     * @param {Entity} player
     * @param {number} range - Max search range
     * @returns {Entity|null}
     */
    findNearestEnemy(player, range) {
      if (!this._entityManager) return null;

      var playerTransform = player.getComponent(Transform);
      if (!playerTransform) return null;

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;

      var enemies = this._entityManager.getByTag('enemy');
      var nearest = null;
      var nearestDist = range * range; // Compare squared distances

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        var dx = enemyTransform.centerX - playerX;
        var dy = enemyTransform.centerY - playerY;
        var distSq = dx * dx + dy * dy;

        if (distSq < nearestDist) {
          nearestDist = distSq;
          nearest = enemy;
        }
      }

      return nearest;
    }

    /**
     * Find the enemy with lowest health
     * @param {Entity} player
     * @param {number} range
     * @returns {Entity|null}
     */
    findWeakestEnemy(player, range) {
      if (!this._entityManager) return null;

      var playerTransform = player.getComponent(Transform);
      if (!playerTransform) return null;

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;
      var rangeSq = range * range;

      var enemies = this._entityManager.getByTag('enemy');
      var weakest = null;
      var lowestHealth = Infinity;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        var dx = enemyTransform.centerX - playerX;
        var dy = enemyTransform.centerY - playerY;
        var distSq = dx * dx + dy * dy;

        if (distSq > rangeSq) continue;

        var health = enemy.getComponent(Health);
        var currentHealth = health ? health.currentHealth : 1;

        if (currentHealth < lowestHealth) {
          lowestHealth = currentHealth;
          weakest = enemy;
        }
      }

      return weakest;
    }

    /**
     * Find a random enemy within range
     * @param {Entity} player
     * @param {number} range
     * @returns {Entity|null}
     */
    findRandomEnemy(player, range) {
      if (!this._entityManager) return null;

      var playerTransform = player.getComponent(Transform);
      if (!playerTransform) return null;

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;
      var rangeSq = range * range;

      var enemies = this._entityManager.getByTag('enemy');
      var inRange = [];

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        var dx = enemyTransform.centerX - playerX;
        var dy = enemyTransform.centerY - playerY;
        var distSq = dx * dx + dy * dy;

        if (distSq <= rangeSq) {
          inRange.push(enemy);
        }
      }

      if (inRange.length === 0) return null;

      var randomIndex = Math.floor(Math.random() * inRange.length);
      return inRange[randomIndex];
    }

    /**
     * Get all enemies within range
     * @param {Entity} player
     * @param {number} range
     * @returns {Array<Entity>}
     */
    getEnemiesInRange(player, range) {
      if (!this._entityManager) return [];

      var playerTransform = player.getComponent(Transform);
      if (!playerTransform) return [];

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;
      var rangeSq = range * range;

      var enemies = this._entityManager.getByTag('enemy');
      var inRange = [];

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        var dx = enemyTransform.centerX - playerX;
        var dy = enemyTransform.centerY - playerY;
        var distSq = dx * dx + dy * dy;

        if (distSq <= rangeSq) {
          inRange.push(enemy);
        }
      }

      return inRange;
    }

    /**
     * Get direction from player to mouse position (world coordinates)
     * @param {Entity} player
     * @returns {{x: number, y: number, angle: number}}
     */
    getMouseDirection(player) {
      if (!this._input) {
        return { x: 1, y: 0, angle: 0 };
      }

      var playerTransform = player.getComponent(Transform);
      if (!playerTransform) {
        return { x: 1, y: 0, angle: 0 };
      }

      // Use mouseWorldPosition which accounts for camera offset
      var mousePos = this._input.mouseWorldPosition;
      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;

      var dx = mousePos.x - playerX;
      var dy = mousePos.y - playerY;
      var length = Math.sqrt(dx * dx + dy * dy);

      if (length === 0) {
        return { x: 1, y: 0, angle: 0 };
      }

      return {
        x: dx / length,
        y: dy / length,
        angle: Math.atan2(dy, dx),
      };
    }

    /**
     * Get direction based on auto mode (uses last movement direction)
     * @returns {{x: number, y: number, angle: number}}
     */
    getAutoModeDirection() {
      if (!this._input) {
        return { x: 1, y: 0, angle: 0 };
      }

      var lastDir = this._input.lastMovementDirection;
      return {
        x: lastDir.x,
        y: lastDir.y,
        angle: Math.atan2(lastDir.y, lastDir.x),
      };
    }

    /**
     * Get direction from player to a target entity
     * @param {Entity} player
     * @param {Entity} target
     * @returns {{x: number, y: number, angle: number}}
     */
    getDirectionToTarget(player, target) {
      var playerTransform = player.getComponent(Transform);
      var targetTransform = target.getComponent(Transform);

      if (!playerTransform || !targetTransform) {
        return { x: 1, y: 0, angle: 0 };
      }

      var dx = targetTransform.centerX - playerTransform.centerX;
      var dy = targetTransform.centerY - playerTransform.centerY;
      var length = Math.sqrt(dx * dx + dy * dy);

      if (length === 0) {
        return { x: 1, y: 0, angle: 0 };
      }

      return {
        x: dx / length,
        y: dy / length,
        angle: Math.atan2(dy, dx),
      };
    }

    /**
     * Get a random direction
     * @returns {{x: number, y: number, angle: number}}
     */
    getRandomDirection() {
      var angle = Math.random() * Math.PI * 2;
      return {
        x: Math.cos(angle),
        y: Math.sin(angle),
        angle: angle,
      };
    }

    // ----------------------------------------
    // Damage Helpers
    // ----------------------------------------
    /**
     * Calculate damage (with optional critical hit)
     * @param {Weapon} weapon
     * @param {number} [critChance] - Critical hit chance (0-1)
     * @param {number} [critMultiplier] - Critical damage multiplier
     * @returns {{damage: number, isCritical: boolean}}
     */
    calculateDamage(weapon, critChance, critMultiplier) {
      var baseDamage = weapon.damage;
      var isCritical = false;

      if (critChance && Math.random() < critChance) {
        isCritical = true;
        baseDamage *= critMultiplier || 2;
      }

      return {
        damage: Math.floor(baseDamage),
        isCritical: isCritical,
      };
    }

    // ----------------------------------------
    // Utility Helpers
    // ----------------------------------------
    /**
     * Get player center position
     * @param {Entity} player
     * @returns {{x: number, y: number}}
     */
    getPlayerCenter(player) {
      var transform = player.getComponent(Transform);
      if (!transform) {
        return { x: 0, y: 0 };
      }
      return {
        x: transform.centerX,
        y: transform.centerY,
      };
    }

    /**
     * Convert degrees to radians
     * @param {number} degrees
     * @returns {number}
     */
    degreesToRadians(degrees) {
      return (degrees * Math.PI) / 180;
    }

    /**
     * Convert radians to degrees
     * @param {number} radians
     * @returns {number}
     */
    radiansToDegrees(radians) {
      return (radians * 180) / Math.PI;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._entityManager = null;
      this._input = null;
      this._events = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.WeaponBehavior = WeaponBehavior;
})(window.VampireSurvivors.Behaviors = window.VampireSurvivors.Behaviors || {});
