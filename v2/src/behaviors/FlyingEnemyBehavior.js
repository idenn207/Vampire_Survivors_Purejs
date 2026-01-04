/**
 * @fileoverview Flying enemy behavior - chase with sinusoidal hover movement
 * @module Behaviors/FlyingEnemyBehavior
 */
(function (Behaviors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var EnemyBehavior = Behaviors.EnemyBehavior;
  var Velocity = window.VampireSurvivors.Components.Velocity;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_AMPLITUDE = 30;
  var DEFAULT_FREQUENCY = 2;

  // ============================================
  // Class Definition
  // ============================================
  class FlyingEnemyBehavior extends EnemyBehavior {
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
      // Initialize hover state
      enemy.behaviorState = {
        hoverTime: Math.random() * Math.PI * 2, // Random starting phase
        amplitude: config.hoverAmplitude || DEFAULT_AMPLITUDE,
        frequency: config.hoverFrequency || DEFAULT_FREQUENCY,
      };
    }

    /**
     * Update enemy - chase with hover
     * @param {Entity} enemy
     * @param {number} deltaTime
     */
    update(enemy, deltaTime) {
      if (!enemy.isActive) return;

      var state = enemy.behaviorState || {};
      var amplitude = state.amplitude || DEFAULT_AMPLITUDE;
      var frequency = state.frequency || DEFAULT_FREQUENCY;

      // Update hover time
      state.hoverTime = (state.hoverTime || 0) + deltaTime;
      enemy.behaviorState = state;

      // Get direction to player
      var direction = this.getDirectionToPlayer(enemy);
      var velocity = enemy.getComponent(Velocity);
      if (!velocity) return;

      // Calculate base velocity toward player
      var baseVx = direction.x * enemy.speed;
      var baseVy = direction.y * enemy.speed;

      // Add sinusoidal hover offset to vertical movement
      // The hover effect is perpendicular to movement direction
      var hoverOffset = Math.sin(state.hoverTime * frequency * Math.PI * 2) * amplitude;

      // Apply hover perpendicular to movement direction
      // If moving mostly horizontal, hover vertically
      // If moving mostly vertical, hover horizontally
      var perpX = -direction.y; // Perpendicular vector
      var perpY = direction.x;

      // Reduce perpendicular effect based on speed (hover less when moving fast)
      var hoverScale = 1.0;

      velocity.vx = baseVx + perpX * hoverOffset * hoverScale * 0.5;
      velocity.vy = baseVy + perpY * hoverOffset * hoverScale;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.FlyingEnemyBehavior = FlyingEnemyBehavior;
})(window.VampireSurvivors.Behaviors);
