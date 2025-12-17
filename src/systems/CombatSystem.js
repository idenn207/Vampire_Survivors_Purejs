/**
 * @fileoverview Combat system - handles damage from collisions
 * @module Systems/CombatSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var Health = window.VampireSurvivors.Components.Health;
  var ProjectileComponent = window.VampireSurvivors.Components.Projectile;
  var events = window.VampireSurvivors.Core.events;
  var projectilePool = window.VampireSurvivors.Pool.projectilePool;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_INVINCIBILITY_DURATION = 1; // seconds

  // ============================================
  // Class Definition
  // ============================================
  class CombatSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 25; // After CollisionSystem (20), before CameraSystem (50)
    _collisionSystem = null;
    _player = null;
    _damageDealt = 0;
    _damageReceived = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    setCollisionSystem(collisionSystem) {
      this._collisionSystem = collisionSystem;
    }

    setPlayer(player) {
      this._player = player;
    }

    update(deltaTime) {
      if (!this._entityManager || !this._collisionSystem) return;

      // Update all health components' invincibility timers
      this._updateHealthTimers(deltaTime);

      // Process collisions
      this._processCollisions();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _updateHealthTimers(deltaTime) {
      var entities = this._entityManager.getWithComponents(Health);

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (!entity.isActive) continue;

        var health = entity.getComponent(Health);
        if (health) {
          health.update(deltaTime);
        }
      }
    }

    _processCollisions() {
      // Process player-enemy collisions
      if (this._player && this._player.isActive) {
        var playerCollisions = this._collisionSystem.getCollisionsByTags('player', 'enemy');

        for (var i = 0; i < playerCollisions.length; i++) {
          var collision = playerCollisions[i];
          var player = collision.entityA;
          var enemy = collision.entityB;

          this._handlePlayerEnemyCollision(player, enemy);
        }
      }

      // Process hitbox-enemy collisions (projectiles hitting enemies)
      this._processHitboxCollisions();
    }

    _processHitboxCollisions() {
      // Get all hitbox-enemy collisions
      var hitboxCollisions = this._collisionSystem.getCollisionsByTags('hitbox', 'enemy');

      for (var i = 0; i < hitboxCollisions.length; i++) {
        var collision = hitboxCollisions[i];
        var hitbox = collision.entityA;
        var enemy = collision.entityB;

        this._handleHitboxEnemyCollision(hitbox, enemy);
      }
    }

    _handleHitboxEnemyCollision(hitbox, enemy) {
      // Check if hitbox is still active
      if (!hitbox.isActive || !enemy.isActive) return;

      // Get enemy health
      var enemyHealth = enemy.getComponent(Health);
      if (!enemyHealth || enemyHealth.isDead) return;

      // Handle projectile collision
      var projectileComp = hitbox.getComponent(ProjectileComponent);
      if (projectileComp) {
        // Check if already hit this enemy
        if (projectileComp.hasHitEnemy(enemy.id)) {
          return;
        }

        var damage = projectileComp.damage;

        // Apply damage
        enemyHealth.takeDamage(damage);
        this._damageDealt += damage;

        // Emit weapon hit event
        events.emit('weapon:hit', {
          hitbox: hitbox,
          enemy: enemy,
          damage: damage,
          type: 'projectile',
        });

        // Handle pierce - returns true if projectile should be destroyed
        var shouldDestroy = projectileComp.onHit(enemy.id);

        if (shouldDestroy) {
          projectilePool.despawn(hitbox);
        }
      }
    }

    _handlePlayerEnemyCollision(player, enemy) {
      var playerHealth = player.getComponent(Health);
      if (!playerHealth || playerHealth.isDead || playerHealth.isInvincible) {
        return;
      }

      // Get enemy damage (from _damage property or default)
      var damage = enemy.damage !== undefined ? enemy.damage : 10;

      // Apply damage
      var damageApplied = playerHealth.takeDamage(damage);

      if (damageApplied) {
        // Set invincibility
        playerHealth.setInvincible(DEFAULT_INVINCIBILITY_DURATION);

        // Track stats
        this._damageReceived += damage;

        // Emit player-specific event
        events.emit('player:damaged', {
          player: player,
          enemy: enemy,
          amount: damage,
          currentHealth: playerHealth.currentHealth,
          maxHealth: playerHealth.maxHealth,
        });

        // Check for player death
        if (playerHealth.isDead) {
          events.emit('player:died', {
            player: player,
            killer: enemy,
          });
        }
      }
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var playerHealth = null;
      var playerInvincible = false;

      if (this._player && this._player.isActive) {
        var health = this._player.getComponent(Health);
        if (health) {
          playerHealth = health.currentHealth + '/' + health.maxHealth;
          playerInvincible = health.isInvincible;
        }
      }

      return {
        label: 'Combat',
        entries: [
          { key: 'Player HP', value: playerHealth || 'N/A' },
          { key: 'Invincible', value: playerInvincible ? 'Yes' : 'No' },
          { key: 'Dmg Dealt', value: this._damageDealt },
          { key: 'Dmg Received', value: this._damageReceived },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._collisionSystem = null;
      this._player = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.CombatSystem = CombatSystem;
})(window.VampireSurvivors.Systems);
