/**
 * @fileoverview Invisible enemy behavior - chase with distance-based visibility
 * @module Behaviors/InvisibleEnemyBehavior
 */
(function (Behaviors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var EnemyBehavior = Behaviors.EnemyBehavior;
  var Sprite = window.VampireSurvivors.Components.Sprite;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_VISIBILITY_RADIUS = 120;
  var DEFAULT_FADE_SPEED = 2.0;
  var DEFAULT_MIN_ALPHA = 0.1;

  // ============================================
  // Class Definition
  // ============================================
  class InvisibleEnemyBehavior extends EnemyBehavior {
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
      // Initialize invisibility state
      enemy.behaviorState = {
        visibilityRadius: config.visibilityRadius || DEFAULT_VISIBILITY_RADIUS,
        fadeSpeed: config.fadeSpeed || DEFAULT_FADE_SPEED,
        minAlpha: config.minAlpha || DEFAULT_MIN_ALPHA,
        currentAlpha: config.minAlpha || DEFAULT_MIN_ALPHA,
      };

      // Start with minimum visibility
      var sprite = enemy.getComponent(Sprite);
      if (sprite) {
        sprite.alpha = enemy.behaviorState.minAlpha;
      }
    }

    /**
     * Update enemy - chase with visibility control
     * @param {Entity} enemy
     * @param {number} deltaTime
     */
    update(enemy, deltaTime) {
      if (!enemy.isActive) return;

      // Chase player
      this.moveTowardPlayer(enemy, enemy.speed);

      // Update visibility based on distance
      this._updateVisibility(enemy, deltaTime);
    }

    /**
     * Update sprite alpha based on distance to player
     * @param {Entity} enemy
     * @param {number} deltaTime
     * @private
     */
    _updateVisibility(enemy, deltaTime) {
      var state = enemy.behaviorState || {};
      var visibilityRadius = state.visibilityRadius || DEFAULT_VISIBILITY_RADIUS;
      var fadeSpeed = state.fadeSpeed || DEFAULT_FADE_SPEED;
      var minAlpha = state.minAlpha || DEFAULT_MIN_ALPHA;
      var currentAlpha = state.currentAlpha || minAlpha;

      // Get distance to player
      var distance = this.getDistanceToPlayer(enemy);

      // Calculate target alpha based on distance
      var targetAlpha;
      if (distance < visibilityRadius) {
        // Within visibility radius - fully visible
        // Scale alpha from minAlpha at edge to 1.0 at center
        var t = 1 - distance / visibilityRadius;
        targetAlpha = minAlpha + (1 - minAlpha) * t;
      } else {
        // Outside visibility radius - minimum visibility
        targetAlpha = minAlpha;
      }

      // Smoothly fade toward target alpha
      var fadeAmount = fadeSpeed * deltaTime;
      if (currentAlpha < targetAlpha) {
        currentAlpha = Math.min(currentAlpha + fadeAmount, targetAlpha);
      } else if (currentAlpha > targetAlpha) {
        currentAlpha = Math.max(currentAlpha - fadeAmount, targetAlpha);
      }

      // Update state
      state.currentAlpha = currentAlpha;
      enemy.behaviorState = state;

      // Apply to sprite
      var sprite = enemy.getComponent(Sprite);
      if (sprite) {
        sprite.alpha = currentAlpha;
      }
    }

    /**
     * Called when enemy dies
     * @param {Entity} enemy
     */
    onDeath(enemy) {
      // Make fully visible on death
      var sprite = enemy.getComponent(Sprite);
      if (sprite) {
        sprite.alpha = 1;
      }
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.InvisibleEnemyBehavior = InvisibleEnemyBehavior;
})(window.VampireSurvivors.Behaviors);
