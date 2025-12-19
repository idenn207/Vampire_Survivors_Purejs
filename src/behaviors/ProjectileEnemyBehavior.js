/**
 * @fileoverview Projectile enemy behavior - ranged enemy that fires at player
 * @module Behaviors/ProjectileEnemyBehavior
 */
(function (Behaviors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var EnemyBehavior = Behaviors.EnemyBehavior;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Sprite = window.VampireSurvivors.Components.Sprite;

  // ============================================
  // Constants
  // ============================================
  var State = Object.freeze({
    APPROACHING: 'approaching',
    ATTACKING: 'attacking',
    RETREATING: 'retreating',
  });

  var DEFAULT_PROJECTILE_SPEED = 180;
  var DEFAULT_PROJECTILE_DAMAGE = 15;
  var DEFAULT_PROJECTILE_SIZE = 10;
  var DEFAULT_PROJECTILE_COLOR = '#88FF00';
  var DEFAULT_FIRE_RATE = 2.0;
  var DEFAULT_ATTACK_RANGE = 300;
  var DEFAULT_RETREAT_RANGE = 150;
  var PROJECTILE_LIFETIME = 5.0;

  // ============================================
  // Class Definition
  // ============================================
  class ProjectileEnemyBehavior extends EnemyBehavior {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _projectilePool = null;

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
     * Initialize behavior with dependencies
     * @param {EntityManager} entityManager
     * @param {Entity} player
     * @param {EventBus} events
     */
    initialize(entityManager, player, events) {
      super.initialize(entityManager, player, events);

      // Get enemy projectile pool
      var Pool = window.VampireSurvivors.Pool;
      if (Pool && Pool.enemyProjectilePool) {
        this._projectilePool = Pool.enemyProjectilePool;
        this._projectilePool.setPlayer(player);
      }
    }

    /**
     * Called when enemy is spawned
     * @param {Entity} enemy
     * @param {Object} config
     */
    onSpawn(enemy, config) {
      enemy.behaviorState = {
        state: State.APPROACHING,
        projectileSpeed: config.projectileSpeed || DEFAULT_PROJECTILE_SPEED,
        projectileDamage: config.projectileDamage || DEFAULT_PROJECTILE_DAMAGE,
        projectileSize: config.projectileSize || DEFAULT_PROJECTILE_SIZE,
        projectileColor: config.projectileColor || DEFAULT_PROJECTILE_COLOR,
        fireRate: config.fireRate || DEFAULT_FIRE_RATE,
        attackRange: config.attackRange || DEFAULT_ATTACK_RANGE,
        retreatRange: config.retreatRange || DEFAULT_RETREAT_RANGE,
        fireCooldown: 0,
        originalColor: config.color || '#00FF00',
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

      // Update fire cooldown
      if (state.fireCooldown > 0) {
        state.fireCooldown -= deltaTime;
      }

      var distance = this.getDistanceToPlayer(enemy);

      // Determine state based on distance
      if (distance < state.retreatRange) {
        state.state = State.RETREATING;
      } else if (distance > state.attackRange) {
        state.state = State.APPROACHING;
      } else {
        state.state = State.ATTACKING;
      }

      // Execute state behavior
      switch (state.state) {
        case State.APPROACHING:
          this._updateApproaching(enemy, deltaTime);
          break;
        case State.ATTACKING:
          this._updateAttacking(enemy, deltaTime);
          break;
        case State.RETREATING:
          this._updateRetreating(enemy, deltaTime);
          break;
      }

      enemy.behaviorState = state;
    }

    // ----------------------------------------
    // State Updates
    // ----------------------------------------
    /**
     * Update approaching state - move toward player
     * @param {Entity} enemy
     * @param {number} deltaTime
     * @private
     */
    _updateApproaching(enemy, deltaTime) {
      this.moveTowardPlayer(enemy, enemy.speed);

      // Restore color
      var sprite = enemy.getComponent(Sprite);
      if (sprite) {
        sprite.color = enemy.behaviorState.originalColor;
      }
    }

    /**
     * Update attacking state - fire at player
     * @param {Entity} enemy
     * @param {number} deltaTime
     * @private
     */
    _updateAttacking(enemy, deltaTime) {
      var state = enemy.behaviorState;

      // Stop or slow movement
      this.stopMovement(enemy);

      // Try to fire
      if (state.fireCooldown <= 0) {
        this._fireProjectile(enemy);
        state.fireCooldown = state.fireRate;

        // Visual feedback - flash when firing
        var sprite = enemy.getComponent(Sprite);
        if (sprite) {
          sprite.color = '#FFFFFF';
        }
      } else {
        // Restore color after flash
        var sprite = enemy.getComponent(Sprite);
        if (sprite && state.fireCooldown < state.fireRate - 0.1) {
          sprite.color = state.originalColor;
        }
      }
    }

    /**
     * Update retreating state - back away from player
     * @param {Entity} enemy
     * @param {number} deltaTime
     * @private
     */
    _updateRetreating(enemy, deltaTime) {
      var state = enemy.behaviorState;

      // Move away from player
      this.moveAwayFromPlayer(enemy, enemy.speed * 0.7);

      // Can still fire while retreating
      if (state.fireCooldown <= 0) {
        this._fireProjectile(enemy);
        state.fireCooldown = state.fireRate * 1.5; // Slower fire rate while retreating
      }

      // Darker color while retreating
      var sprite = enemy.getComponent(Sprite);
      if (sprite) {
        sprite.color = '#008800';
      }
    }

    /**
     * Fire a projectile at player
     * @param {Entity} enemy
     * @private
     */
    _fireProjectile(enemy) {
      if (!this._projectilePool) {
        console.warn('[ProjectileEnemyBehavior] No projectile pool available');
        return;
      }

      var state = enemy.behaviorState;
      var enemyPos = this.getEnemyPosition(enemy);
      var playerPos = this.getPlayerPosition();

      if (!enemyPos || !playerPos) return;

      // Calculate direction to player
      var dx = playerPos.x - enemyPos.x;
      var dy = playerPos.y - enemyPos.y;
      var angle = Math.atan2(dy, dx);

      // Spawn projectile
      this._projectilePool.spawn(
        enemyPos.x,
        enemyPos.y,
        angle,
        state.projectileSpeed,
        state.projectileDamage,
        state.projectileSize,
        state.projectileColor,
        PROJECTILE_LIFETIME,
        enemy
      );

      // Emit fire event
      this.emit('enemy:fired', {
        enemy: enemy,
        x: enemyPos.x,
        y: enemyPos.y,
        angle: angle,
      });
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.ProjectileEnemyBehavior = ProjectileEnemyBehavior;
})(window.VampireSurvivors.Behaviors);
