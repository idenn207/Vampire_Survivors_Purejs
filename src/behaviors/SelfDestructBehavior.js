/**
 * @fileoverview Self-destruct enemy behavior - chase and explode when close
 * @module Behaviors/SelfDestructBehavior
 */
(function (Behaviors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var EnemyBehavior = Behaviors.EnemyBehavior;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Sprite = window.VampireSurvivors.Components.Sprite;
  var Health = window.VampireSurvivors.Components.Health;

  // ============================================
  // Constants
  // ============================================
  var State = Object.freeze({
    APPROACHING: 'approaching',
    PRIMED: 'primed',
    EXPLODING: 'exploding',
  });

  var DEFAULT_EXPLOSION_RADIUS = 60;
  var DEFAULT_EXPLOSION_DAMAGE = 30;
  var DEFAULT_FUSE_TIME = 3.0;
  var DEFAULT_TRIGGER_RADIUS = 50;
  var PULSE_FREQUENCY_START = 2; // Pulses per second at start
  var PULSE_FREQUENCY_END = 10; // Pulses per second near explosion

  // ============================================
  // Class Definition
  // ============================================
  class SelfDestructBehavior extends EnemyBehavior {
    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Called when enemy is spawned
     * @param {Entity} enemy
     * @param {Object} config
     */
    onSpawn(enemy, config) {
      enemy.behaviorState = {
        state: State.APPROACHING,
        explosionRadius: config.explosionRadius || DEFAULT_EXPLOSION_RADIUS,
        explosionDamage: config.explosionDamage || DEFAULT_EXPLOSION_DAMAGE,
        fuseTime: config.fuseTime || DEFAULT_FUSE_TIME,
        triggerRadius: config.triggerRadius || DEFAULT_TRIGGER_RADIUS,
        fuseTimer: 0,
        pulseTime: 0,
        originalColor: config.color || '#FF6600',
        originalSize: config.size || 28,
      };
    }

    /**
     * Update enemy
     * @param {Entity} enemy
     * @param {number} deltaTime
     */
    update(enemy, deltaTime) {
      if (!enemy.isActive) return;

      var state = enemy.behaviorState;
      if (!state) return;

      switch (state.state) {
        case State.APPROACHING:
          this._updateApproaching(enemy, deltaTime);
          break;
        case State.PRIMED:
          this._updatePrimed(enemy, deltaTime);
          break;
        case State.EXPLODING:
          this._updateExploding(enemy, deltaTime);
          break;
      }
    }

    // ----------------------------------------
    // State Updates
    // ----------------------------------------
    /**
     * Update approaching state - chase player
     * @param {Entity} enemy
     * @param {number} deltaTime
     * @private
     */
    _updateApproaching(enemy, deltaTime) {
      var state = enemy.behaviorState;
      var distance = this.getDistanceToPlayer(enemy);

      // Chase player
      this.moveTowardPlayer(enemy, enemy.speed);

      // Check if close enough to prime
      if (distance < state.triggerRadius) {
        state.state = State.PRIMED;
        state.fuseTimer = 0;
        enemy.behaviorState = state;
      }
    }

    /**
     * Update primed state - countdown to explosion
     * @param {Entity} enemy
     * @param {number} deltaTime
     * @private
     */
    _updatePrimed(enemy, deltaTime) {
      var state = enemy.behaviorState;

      // Still chase but slower
      this.moveTowardPlayer(enemy, enemy.speed * 0.5);

      // Update fuse timer
      state.fuseTimer += deltaTime;
      state.pulseTime += deltaTime;

      // Calculate pulse frequency based on remaining fuse time
      var fuseProgress = state.fuseTimer / state.fuseTime;
      var pulseFrequency =
        PULSE_FREQUENCY_START + (PULSE_FREQUENCY_END - PULSE_FREQUENCY_START) * fuseProgress;

      // Visual pulsing effect
      var sprite = enemy.getComponent(Sprite);
      if (sprite) {
        var pulseValue = Math.sin(state.pulseTime * pulseFrequency * Math.PI * 2);
        // Pulse between original color and white
        if (pulseValue > 0) {
          sprite.color = '#FFFF00'; // Yellow flash
        } else {
          sprite.color = state.originalColor;
        }
      }

      // Size pulsing - grow slightly as fuse progresses
      var transform = enemy.getComponent(Transform);
      if (transform) {
        var sizeMultiplier = 1 + fuseProgress * 0.3; // Up to 30% larger
        var newSize = state.originalSize * sizeMultiplier;
        transform.width = newSize;
        transform.height = newSize;
      }

      // Check if fuse is complete
      if (state.fuseTimer >= state.fuseTime) {
        state.state = State.EXPLODING;
        enemy.behaviorState = state;
        this._explode(enemy);
      }

      enemy.behaviorState = state;
    }

    /**
     * Update exploding state
     * @param {Entity} enemy
     * @param {number} deltaTime
     * @private
     */
    _updateExploding(enemy, deltaTime) {
      // Explosion already triggered, enemy will be destroyed
      this.stopMovement(enemy);
    }

    /**
     * Trigger explosion
     * @param {Entity} enemy
     * @private
     */
    _explode(enemy) {
      var state = enemy.behaviorState;
      var enemyPos = this.getEnemyPosition(enemy);
      if (!enemyPos) return;

      // Check if player is in explosion radius
      var playerPos = this.getPlayerPosition();
      if (playerPos) {
        var dx = playerPos.x - enemyPos.x;
        var dy = playerPos.y - enemyPos.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < state.explosionRadius) {
          // Damage player
          this.damagePlayer(state.explosionDamage);
        }
      }

      // Emit explosion event for visual effects
      this.emit('enemy:exploded', {
        x: enemyPos.x,
        y: enemyPos.y,
        radius: state.explosionRadius,
        damage: state.explosionDamage,
      });

      // Kill the enemy
      var health = enemy.getComponent(Health);
      if (health) {
        health.die();
      }
    }

    /**
     * Called when enemy dies
     * @param {Entity} enemy
     */
    onDeath(enemy) {
      // If enemy was primed and killed before exploding, still trigger explosion
      var state = enemy.behaviorState;
      if (state && state.state === State.PRIMED) {
        this._explode(enemy);
      }
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.SelfDestructBehavior = SelfDestructBehavior;
})(window.VampireSurvivors.Behaviors);
