/**
 * @fileoverview Base enemy behavior class - abstract class for enemy AI logic
 * @module Behaviors/EnemyBehavior
 */
(function (Behaviors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Transform = window.VampireSurvivors.Components.Transform;
  var Velocity = window.VampireSurvivors.Components.Velocity;
  var Health = window.VampireSurvivors.Components.Health;

  // ============================================
  // Class Definition
  // ============================================
  class EnemyBehavior {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _player = null;
    _entityManager = null;
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
     * @param {Entity} player - Player entity reference
     * @param {EventBus} events
     */
    initialize(entityManager, player, events) {
      this._entityManager = entityManager;
      this._player = player;
      this._events = events;
    }

    /**
     * Set the player reference
     * @param {Entity} player
     */
    setPlayer(player) {
      this._player = player;
    }

    /**
     * Update enemy behavior (abstract - override in subclass)
     * @param {Entity} enemy - Enemy entity
     * @param {number} deltaTime - Time since last update in seconds
     */
    update(enemy, deltaTime) {
      throw new Error('[EnemyBehavior] update() must be implemented by subclass');
    }

    /**
     * Called when enemy is spawned (optional override)
     * @param {Entity} enemy - Enemy entity
     * @param {Object} config - Enemy type configuration
     */
    onSpawn(enemy, config) {
      // Optional: subclasses can override for initialization
    }

    /**
     * Called when enemy dies (optional override)
     * @param {Entity} enemy - Enemy entity
     */
    onDeath(enemy) {
      // Optional: subclasses can override for cleanup/effects
    }

    // ----------------------------------------
    // Helper Methods
    // ----------------------------------------
    /**
     * Get player transform
     * @returns {Transform|null}
     */
    getPlayerTransform() {
      if (!this._player) return null;
      return this._player.getComponent(Transform);
    }

    /**
     * Get player center position
     * @returns {{x: number, y: number}|null}
     */
    getPlayerPosition() {
      var transform = this.getPlayerTransform();
      if (!transform) return null;
      return {
        x: transform.centerX,
        y: transform.centerY,
      };
    }

    /**
     * Get enemy center position
     * @param {Entity} enemy
     * @returns {{x: number, y: number}|null}
     */
    getEnemyPosition(enemy) {
      var transform = enemy.getComponent(Transform);
      if (!transform) return null;
      return {
        x: transform.centerX,
        y: transform.centerY,
      };
    }

    /**
     * Calculate distance to player
     * @param {Entity} enemy
     * @returns {number} Distance in pixels, or Infinity if no player
     */
    getDistanceToPlayer(enemy) {
      var playerPos = this.getPlayerPosition();
      var enemyPos = this.getEnemyPosition(enemy);
      if (!playerPos || !enemyPos) return Infinity;

      var dx = playerPos.x - enemyPos.x;
      var dy = playerPos.y - enemyPos.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Calculate direction to player (normalized)
     * @param {Entity} enemy
     * @returns {{x: number, y: number, distance: number}}
     */
    getDirectionToPlayer(enemy) {
      var playerPos = this.getPlayerPosition();
      var enemyPos = this.getEnemyPosition(enemy);
      if (!playerPos || !enemyPos) {
        return { x: 0, y: 0, distance: 0 };
      }

      var dx = playerPos.x - enemyPos.x;
      var dy = playerPos.y - enemyPos.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) {
        return { x: 0, y: 0, distance: 0 };
      }

      return {
        x: dx / distance,
        y: dy / distance,
        distance: distance,
      };
    }

    /**
     * Move enemy toward player at given speed
     * @param {Entity} enemy
     * @param {number} speed - Movement speed in pixels per second
     */
    moveTowardPlayer(enemy, speed) {
      var direction = this.getDirectionToPlayer(enemy);
      var velocity = enemy.getComponent(Velocity);
      if (!velocity) return;

      velocity.vx = direction.x * speed;
      velocity.vy = direction.y * speed;
    }

    /**
     * Move enemy away from player at given speed
     * @param {Entity} enemy
     * @param {number} speed - Movement speed in pixels per second
     */
    moveAwayFromPlayer(enemy, speed) {
      var direction = this.getDirectionToPlayer(enemy);
      var velocity = enemy.getComponent(Velocity);
      if (!velocity) return;

      velocity.vx = -direction.x * speed;
      velocity.vy = -direction.y * speed;
    }

    /**
     * Stop enemy movement
     * @param {Entity} enemy
     */
    stopMovement(enemy) {
      var velocity = enemy.getComponent(Velocity);
      if (!velocity) return;

      velocity.vx = 0;
      velocity.vy = 0;
    }

    /**
     * Set enemy velocity directly
     * @param {Entity} enemy
     * @param {number} vx - X velocity
     * @param {number} vy - Y velocity
     */
    setVelocity(enemy, vx, vy) {
      var velocity = enemy.getComponent(Velocity);
      if (!velocity) return;

      velocity.vx = vx;
      velocity.vy = vy;
    }

    /**
     * Damage the player
     * @param {number} amount - Damage amount
     * @param {Entity} [enemy] - Enemy that caused the damage (for event data)
     * @returns {boolean} True if damage was applied
     */
    damagePlayer(amount, enemy) {
      if (!this._player || !this._player.isActive) return false;

      var health = this._player.getComponent(Health);
      if (!health) return false;

      var damageApplied = health.takeDamage(amount);

      if (damageApplied) {
        // Emit player:damaged event
        this.emit('player:damaged', {
          player: this._player,
          enemy: enemy || null,
          amount: amount,
          currentHealth: health.currentHealth,
          maxHealth: health.maxHealth,
        });

        // Check for player death
        if (health.isDead) {
          this.emit('player:died', {
            player: this._player,
            killer: enemy || null,
          });
        }
      }

      return damageApplied;
    }

    /**
     * Emit an event
     * @param {string} eventName
     * @param {Object} data
     */
    emit(eventName, data) {
      if (this._events) {
        this._events.emit(eventName, data);
      }
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._player = null;
      this._entityManager = null;
      this._events = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.EnemyBehavior = EnemyBehavior;
})(window.VampireSurvivors.Behaviors = window.VampireSurvivors.Behaviors || {});
