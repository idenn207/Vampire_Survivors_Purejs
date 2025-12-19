/**
 * @fileoverview Jump/Drop enemy behavior - jumps to player position and lands with area damage
 * @module Behaviors/JumpDropBehavior
 */
(function (Behaviors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var EnemyBehavior = Behaviors.EnemyBehavior;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Sprite = window.VampireSurvivors.Components.Sprite;
  var Collider = window.VampireSurvivors.Components.Collider;

  // ============================================
  // Constants
  // ============================================
  var State = Object.freeze({
    GROUNDED: 'grounded',
    JUMPING: 'jumping',
    LANDING: 'landing',
    COOLDOWN: 'cooldown',
  });

  var DEFAULT_JUMP_HEIGHT = 200;
  var DEFAULT_JUMP_DURATION = 1.0;
  var DEFAULT_JUMP_COOLDOWN = 2.5;
  var DEFAULT_LANDING_RADIUS = 40;
  var DEFAULT_SHADOW_SIZE = 24;
  var LANDING_IMPACT_TIME = 0.1; // Brief pause on landing

  // ============================================
  // Class Definition
  // ============================================
  class JumpDropBehavior extends EnemyBehavior {
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
        state: State.GROUNDED,
        jumpHeight: config.jumpHeight || DEFAULT_JUMP_HEIGHT,
        jumpDuration: config.jumpDuration || DEFAULT_JUMP_DURATION,
        jumpCooldown: config.jumpCooldown || DEFAULT_JUMP_COOLDOWN,
        landingRadius: config.landingRadius || DEFAULT_LANDING_RADIUS,
        shadowSize: config.shadowSize || DEFAULT_SHADOW_SIZE,
        stateTimer: 0,
        jumpProgress: 0,
        startPosition: { x: 0, y: 0 },
        targetPosition: { x: 0, y: 0 },
        originalSize: config.size || 30,
        originalColor: config.color || '#8800FF',
        groundedTimer: 0, // Time before first jump
      };

      // Start with a brief delay before first jump
      enemy.behaviorState.groundedTimer = Math.random() * 1.5 + 0.5;
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
        case State.GROUNDED:
          this._updateGrounded(enemy, deltaTime);
          break;
        case State.JUMPING:
          this._updateJumping(enemy, deltaTime);
          break;
        case State.LANDING:
          this._updateLanding(enemy, deltaTime);
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
     * Update grounded state - wait then jump
     * @param {Entity} enemy
     * @param {number} deltaTime
     * @private
     */
    _updateGrounded(enemy, deltaTime) {
      var state = enemy.behaviorState;
      state.groundedTimer -= deltaTime;

      // Stay still
      this.stopMovement(enemy);

      // Check if ready to jump
      if (state.groundedTimer <= 0) {
        this._startJump(enemy);
      }

      enemy.behaviorState = state;
    }

    /**
     * Start jump toward player
     * @param {Entity} enemy
     * @private
     */
    _startJump(enemy) {
      var state = enemy.behaviorState;
      var enemyPos = this.getEnemyPosition(enemy);
      var playerPos = this.getPlayerPosition();

      if (!enemyPos || !playerPos) return;

      state.state = State.JUMPING;
      state.stateTimer = 0;
      state.jumpProgress = 0;
      state.startPosition = { x: enemyPos.x, y: enemyPos.y };
      state.targetPosition = { x: playerPos.x, y: playerPos.y };

      // Disable collision during jump
      var collider = enemy.getComponent(Collider);
      if (collider) {
        collider.isEnabled = false;
      }

      enemy.behaviorState = state;
    }

    /**
     * Update jumping state - arc toward target
     * @param {Entity} enemy
     * @param {number} deltaTime
     * @private
     */
    _updateJumping(enemy, deltaTime) {
      var state = enemy.behaviorState;
      state.stateTimer += deltaTime;
      state.jumpProgress = Math.min(1, state.stateTimer / state.jumpDuration);

      // Calculate position along arc
      var t = state.jumpProgress;
      var startX = state.startPosition.x;
      var startY = state.startPosition.y;
      var endX = state.targetPosition.x;
      var endY = state.targetPosition.y;

      // Linear interpolation for X/Y
      var currentX = startX + (endX - startX) * t;
      var currentY = startY + (endY - startY) * t;

      // Parabolic arc for height (used for visual scale effect)
      // h = 4 * jumpHeight * t * (1 - t) gives a nice parabola
      var heightOffset = 4 * state.jumpHeight * t * (1 - t);

      // Update position
      var transform = enemy.getComponent(Transform);
      if (transform) {
        transform.x = currentX - transform.width / 2;
        transform.y = currentY - transform.height / 2;
      }

      // Visual: Scale enemy based on height (smaller when higher = farther)
      var sprite = enemy.getComponent(Sprite);
      if (sprite && transform) {
        // Scale from 1.0 at ground to 0.5 at peak
        var scaleProgress = heightOffset / state.jumpHeight;
        var scale = 1.0 - scaleProgress * 0.5;

        var newSize = state.originalSize * scale;
        transform.width = newSize;
        transform.height = newSize;

        // Lighten color when high
        if (scaleProgress > 0.3) {
          sprite.color = '#AA44FF'; // Lighter purple
        } else {
          sprite.color = state.originalColor;
        }
      }

      // Stop velocity - position is set directly
      this.stopMovement(enemy);

      // Check if landed
      if (state.jumpProgress >= 1) {
        state.state = State.LANDING;
        state.stateTimer = 0;
        enemy.behaviorState = state;
        this._onLand(enemy);
      } else {
        enemy.behaviorState = state;
      }
    }

    /**
     * Handle landing impact
     * @param {Entity} enemy
     * @private
     */
    _onLand(enemy) {
      var state = enemy.behaviorState;
      var enemyPos = this.getEnemyPosition(enemy);
      if (!enemyPos) return;

      // Re-enable collision
      var collider = enemy.getComponent(Collider);
      if (collider) {
        collider.isEnabled = true;
      }

      // Restore size
      var transform = enemy.getComponent(Transform);
      if (transform) {
        transform.width = state.originalSize;
        transform.height = state.originalSize;
      }

      // Restore color
      var sprite = enemy.getComponent(Sprite);
      if (sprite) {
        sprite.color = state.originalColor;
      }

      // Check if player is in landing radius
      var playerPos = this.getPlayerPosition();
      if (playerPos) {
        var dx = playerPos.x - enemyPos.x;
        var dy = playerPos.y - enemyPos.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < state.landingRadius) {
          // Damage player
          this.damagePlayer(enemy.damage);
        }
      }

      // Emit landing event for visual effects
      this.emit('enemy:landed', {
        x: enemyPos.x,
        y: enemyPos.y,
        radius: state.landingRadius,
      });
    }

    /**
     * Update landing state - brief pause
     * @param {Entity} enemy
     * @param {number} deltaTime
     * @private
     */
    _updateLanding(enemy, deltaTime) {
      var state = enemy.behaviorState;
      state.stateTimer += deltaTime;

      // Stay still during impact
      this.stopMovement(enemy);

      // Visual feedback - flash
      var sprite = enemy.getComponent(Sprite);
      if (sprite) {
        sprite.color = '#FFFFFF'; // White flash on impact
      }

      // Check if landing impact complete
      if (state.stateTimer >= LANDING_IMPACT_TIME) {
        state.state = State.COOLDOWN;
        state.stateTimer = 0;

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

      // Stay still during cooldown
      this.stopMovement(enemy);

      // Check if cooldown complete
      if (state.stateTimer >= state.jumpCooldown) {
        state.state = State.GROUNDED;
        state.groundedTimer = 0.2; // Brief delay before next jump
        enemy.behaviorState = state;
      } else {
        enemy.behaviorState = state;
      }
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.JumpDropBehavior = JumpDropBehavior;
})(window.VampireSurvivors.Behaviors);
