/**
 * @fileoverview Dash attack enemy behavior - stalk, charge, and dash at player
 * @module Behaviors/DashAttackBehavior
 */
(function (Behaviors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var EnemyBehavior = Behaviors.EnemyBehavior;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Sprite = window.VampireSurvivors.Components.Sprite;
  var Velocity = window.VampireSurvivors.Components.Velocity;

  // ============================================
  // Constants
  // ============================================
  var State = Object.freeze({
    STALKING: 'stalking',
    CHARGING: 'charging',
    DASHING: 'dashing',
    COOLDOWN: 'cooldown',
  });

  var DEFAULT_CHARGE_TIME = 1.0;
  var DEFAULT_DASH_SPEED = 400;
  var DEFAULT_DASH_DURATION = 0.5;
  var DEFAULT_DASH_COOLDOWN = 3.0;
  var DEFAULT_DASH_RANGE = 200;
  var SHAKE_INTENSITY = 3;
  var SHAKE_SPEED = 30;

  // ============================================
  // Class Definition
  // ============================================
  class DashAttackBehavior extends EnemyBehavior {
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
        state: State.STALKING,
        chargeTime: config.chargeTime || DEFAULT_CHARGE_TIME,
        dashSpeed: config.dashSpeed || DEFAULT_DASH_SPEED,
        dashDuration: config.dashDuration || DEFAULT_DASH_DURATION,
        dashCooldown: config.dashCooldown || DEFAULT_DASH_COOLDOWN,
        dashRange: config.dashRange || DEFAULT_DASH_RANGE,
        stateTimer: 0,
        dashDirection: { x: 0, y: 0 },
        originalColor: config.color || '#CC0000',
        shakeOffset: { x: 0, y: 0 },
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
        case State.STALKING:
          this._updateStalking(enemy, deltaTime);
          break;
        case State.CHARGING:
          this._updateCharging(enemy, deltaTime);
          break;
        case State.DASHING:
          this._updateDashing(enemy, deltaTime);
          break;
        case State.COOLDOWN:
          this._updateCooldown(enemy, deltaTime);
          break;
      }
    }

    // ----------------------------------------
    // State Updates
    // ----------------------------------------
    /**
     * Update stalking state - slow approach
     * @param {Entity} enemy
     * @param {number} deltaTime
     * @private
     */
    _updateStalking(enemy, deltaTime) {
      var state = enemy.behaviorState;
      var distance = this.getDistanceToPlayer(enemy);

      // Slow approach toward player
      this.moveTowardPlayer(enemy, enemy.speed);

      // Check if in range to start charging
      if (distance < state.dashRange) {
        state.state = State.CHARGING;
        state.stateTimer = 0;
        // Store direction to player at start of charge
        var direction = this.getDirectionToPlayer(enemy);
        state.dashDirection = { x: direction.x, y: direction.y };
        enemy.behaviorState = state;
      }
    }

    /**
     * Update charging state - telegraph attack
     * @param {Entity} enemy
     * @param {number} deltaTime
     * @private
     */
    _updateCharging(enemy, deltaTime) {
      var state = enemy.behaviorState;
      state.stateTimer += deltaTime;

      // Stop movement during charge
      this.stopMovement(enemy);

      // Shake effect
      state.shakeOffset.x = Math.sin(state.stateTimer * SHAKE_SPEED) * SHAKE_INTENSITY;
      state.shakeOffset.y = Math.cos(state.stateTimer * SHAKE_SPEED * 1.3) * SHAKE_INTENSITY;

      // Visual feedback - flash color
      var sprite = enemy.getComponent(Sprite);
      if (sprite) {
        var chargeProgress = state.stateTimer / state.chargeTime;
        if (chargeProgress > 0.7) {
          sprite.color = '#FFFFFF'; // White flash near end
        } else {
          sprite.color = state.originalColor;
        }
      }

      // Apply shake offset to transform (visual only)
      var transform = enemy.getComponent(Transform);
      if (transform) {
        // Note: This is a visual offset, actual position stays the same
        // The render system would need to account for this
      }

      // Check if charge complete
      if (state.stateTimer >= state.chargeTime) {
        state.state = State.DASHING;
        state.stateTimer = 0;
        state.shakeOffset = { x: 0, y: 0 };

        // Update dash direction to current player position for more accurate dash
        var direction = this.getDirectionToPlayer(enemy);
        state.dashDirection = { x: direction.x, y: direction.y };

        enemy.behaviorState = state;
      } else {
        enemy.behaviorState = state;
      }
    }

    /**
     * Update dashing state - fast movement
     * @param {Entity} enemy
     * @param {number} deltaTime
     * @private
     */
    _updateDashing(enemy, deltaTime) {
      var state = enemy.behaviorState;
      state.stateTimer += deltaTime;

      // Move in dash direction at dash speed
      this.setVelocity(
        enemy,
        state.dashDirection.x * state.dashSpeed,
        state.dashDirection.y * state.dashSpeed
      );

      // Visual feedback
      var sprite = enemy.getComponent(Sprite);
      if (sprite) {
        sprite.color = '#FF4444'; // Bright red during dash
      }

      // Check if dash complete
      if (state.stateTimer >= state.dashDuration) {
        state.state = State.COOLDOWN;
        state.stateTimer = 0;

        // Restore color
        if (sprite) {
          sprite.color = state.originalColor;
        }

        enemy.behaviorState = state;
      } else {
        enemy.behaviorState = state;
      }
    }

    /**
     * Update cooldown state - recovery
     * @param {Entity} enemy
     * @param {number} deltaTime
     * @private
     */
    _updateCooldown(enemy, deltaTime) {
      var state = enemy.behaviorState;
      state.stateTimer += deltaTime;

      // Slow movement during cooldown
      this.moveTowardPlayer(enemy, enemy.speed * 0.3);

      // Visual feedback - slightly darker
      var sprite = enemy.getComponent(Sprite);
      if (sprite) {
        sprite.color = '#880000'; // Dark red during cooldown
      }

      // Check if cooldown complete
      if (state.stateTimer >= state.dashCooldown) {
        state.state = State.STALKING;
        state.stateTimer = 0;

        // Restore color
        if (sprite) {
          sprite.color = state.originalColor;
        }

        enemy.behaviorState = state;
      } else {
        enemy.behaviorState = state;
      }
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.DashAttackBehavior = DashAttackBehavior;
})(window.VampireSurvivors.Behaviors);
