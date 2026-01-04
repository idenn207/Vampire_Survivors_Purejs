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
    ASCENDING: 'ascending',
    JUMPING: 'jumping',
    LANDING: 'landing',
    COOLDOWN: 'cooldown',
  });

  var DEFAULT_JUMP_HEIGHT = 200;
  var DEFAULT_JUMP_DURATION = 2.0;
  var DEFAULT_JUMP_COOLDOWN = 2.5;
  var DEFAULT_LANDING_RADIUS = 40;
  var DEFAULT_SHADOW_SIZE = 24;
  var LANDING_IMPACT_TIME = 0.1; // Brief pause on landing
  var DEFAULT_ASCEND_DURATION = 0.4;
  var DEFAULT_ASCEND_HEIGHT = 50;
  var DEFAULT_WARNING_TIME = 1.5;

  /**
   * Ease-in-out quadratic function for smooth animation
   * @param {number} t - Progress value (0-1)
   * @returns {number} Eased value (0-1)
   */
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

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
        // Ascend state
        ascendDuration: config.ascendDuration || DEFAULT_ASCEND_DURATION,
        ascendHeight: config.ascendHeight || DEFAULT_ASCEND_HEIGHT,
        ascendTimer: 0,
        ascendStartY: 0,
        // Warning state
        warningTime: config.warningTime || DEFAULT_WARNING_TIME,
        warningEntity: null,
        warningSpawned: false,
        // Shadow state
        showShadow: false,
        shadowX: 0,
        shadowY: 0,
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
        case State.ASCENDING:
          this._updateAscending(enemy, deltaTime);
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

      // Check if ready to ascend (before jump)
      if (state.groundedTimer <= 0) {
        this._startAscend(enemy);
      }

      enemy.behaviorState = state;
    }

    /**
     * Start ascending state - fade out and move up
     * @param {Entity} enemy
     * @private
     */
    _startAscend(enemy) {
      var state = enemy.behaviorState;
      var enemyPos = this.getEnemyPosition(enemy);

      if (!enemyPos) return;

      state.state = State.ASCENDING;
      state.ascendTimer = 0;
      state.ascendStartY = enemyPos.y;

      // Show shadow at current position immediately
      state.showShadow = true;
      state.shadowX = enemyPos.x;
      state.shadowY = enemyPos.y;

      // Make enemy invulnerable during jump (keep 'enemy' tag for update loop)
      enemy.addTag('invulnerable');

      // Disable collision during ascend/jump
      var collider = enemy.getComponent(Collider);
      if (collider) {
        collider.isEnabled = false;
      }

      enemy.behaviorState = state;
    }

    /**
     * Update ascending state - fade out and move up
     * @param {Entity} enemy
     * @param {number} deltaTime
     * @private
     */
    _updateAscending(enemy, deltaTime) {
      var state = enemy.behaviorState;
      state.ascendTimer += deltaTime;

      // Stay still (no velocity-based movement)
      this.stopMovement(enemy);

      // Calculate ascend progress with easing
      var ascendProgress = Math.min(1, state.ascendTimer / state.ascendDuration);
      var easedProgress = easeInOutQuad(ascendProgress);

      // Move enemy upward
      var transform = enemy.getComponent(Transform);
      if (transform) {
        var offsetY = state.ascendHeight * easedProgress;
        transform.y = state.ascendStartY - offsetY - transform.height / 2;
      }

      // Fade out sprite
      var sprite = enemy.getComponent(Sprite);
      if (sprite) {
        sprite.alpha = 1.0 - easedProgress; // 1.0 -> 0.0
      }

      // Check if ascend complete
      if (ascendProgress >= 1) {
        // Hide sprite completely
        if (sprite) {
          sprite.isVisible = false;
          sprite.alpha = 1.0; // Reset alpha for later
        }
        this._startJump(enemy);
      }

      enemy.behaviorState = state;
    }

    /**
     * Start jump toward player (called after ascend is complete)
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
      state.warningSpawned = false;

      // Move shadow to target (landing) position
      state.shadowX = playerPos.x;
      state.shadowY = playerPos.y;

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

      // Calculate position along arc with easing
      var t = state.jumpProgress;
      var easedT = easeInOutQuad(t);
      var startX = state.startPosition.x;
      var startY = state.startPosition.y;
      var endX = state.targetPosition.x;
      var endY = state.targetPosition.y;

      // Eased interpolation for X/Y (smooth acceleration/deceleration)
      var currentX = startX + (endX - startX) * easedT;
      var currentY = startY + (endY - startY) * easedT;

      // Update position (even though invisible, used for reference)
      var transform = enemy.getComponent(Transform);
      if (transform) {
        transform.x = currentX - transform.width / 2;
        transform.y = currentY - transform.height / 2;
      }

      // Check if warning should appear (when remaining time <= warningTime)
      var remainingTime = state.jumpDuration - state.stateTimer;
      if (!state.warningSpawned && remainingTime <= state.warningTime) {
        this._spawnWarningCircle(enemy);
        state.warningSpawned = true;
      }

      // Smooth warning alpha animation (gradually brighten)
      if (state.warningEntity && state.warningEntity.isActive) {
        var warningSprite = state.warningEntity.getComponent(Sprite);
        if (warningSprite) {
          // Calculate how long warning has been visible
          var warningElapsed = state.stateTimer - (state.jumpDuration - state.warningTime);
          var warningProgress = Math.max(0, Math.min(1, warningElapsed / state.warningTime));
          // Smoothly increase alpha from 0.1 to 0.6
          warningSprite.alpha = 0.1 + warningProgress * 0.5;
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
     * Spawn red warning circle at landing position
     * @param {Entity} enemy
     * @private
     */
    _spawnWarningCircle(enemy) {
      var state = enemy.behaviorState;
      var areaEffectPool = window.VampireSurvivors.Pool.areaEffectPool;

      if (!areaEffectPool) return;

      var warningDuration = state.warningTime;
      state.warningEntity = areaEffectPool.spawn(
        state.targetPosition.x,
        state.targetPosition.y,
        state.landingRadius * 1.5, // Slightly larger for visibility
        '#FF0000', // Solid red (alpha controlled by sprite)
        0, // No damage
        warningDuration,
        0, // No tick rate
        null, // No weapon source
        null // No image
      );

      if (state.warningEntity) {
        state.warningEntity.addTag('warning_indicator');
        // Start with low alpha for smooth animation
        var warningSprite = state.warningEntity.getComponent(Sprite);
        if (warningSprite) {
          warningSprite.alpha = 0.1;
        }
      }
    }

    /**
     * Handle landing impact
     * @param {Entity} enemy
     * @private
     */
    _onLand(enemy) {
      var state = enemy.behaviorState;
      var landingPos = {
        x: state.targetPosition.x,
        y: state.targetPosition.y,
      };

      // Re-enable sprite visibility
      var sprite = enemy.getComponent(Sprite);
      if (sprite) {
        sprite.isVisible = true;
        sprite.alpha = 1.0;
        sprite.color = state.originalColor;
      }

      // Disable shadow mode
      state.showShadow = false;

      // Re-enable collision
      var collider = enemy.getComponent(Collider);
      if (collider) {
        collider.isEnabled = true;
      }

      // Remove invulnerable tag (enemy tag was kept during jump)
      enemy.removeTag('invulnerable');

      // Restore size
      var transform = enemy.getComponent(Transform);
      if (transform) {
        transform.width = state.originalSize;
        transform.height = state.originalSize;
      }

      // Cleanup warning entity if still exists
      if (state.warningEntity) {
        var areaEffectPool = window.VampireSurvivors.Pool.areaEffectPool;
        if (areaEffectPool) {
          areaEffectPool.despawn(state.warningEntity);
        }
        state.warningEntity = null;
      }

      // Apply landing damage
      this._applyLandingDamage(enemy, landingPos, state);

      // Emit landing event for visual effects
      this.emit('enemy:landed', {
        x: landingPos.x,
        y: landingPos.y,
        radius: state.landingRadius,
      });
    }

    /**
     * Apply damage to player in landing radius
     * @param {Entity} enemy
     * @param {Object} landingPos - {x, y}
     * @param {Object} state - behaviorState
     * @private
     */
    _applyLandingDamage(enemy, landingPos, state) {
      var landingRadius = state.landingRadius;

      // Check player for damage
      var playerPos = this.getPlayerPosition();
      if (playerPos && this._player) {
        var dx = playerPos.x - landingPos.x;
        var dy = playerPos.y - landingPos.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < landingRadius) {
          // Damage player
          this.damagePlayer(enemy.damage, enemy);
        }
      }
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
