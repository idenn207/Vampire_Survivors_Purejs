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
  var events = window.VampireSurvivors.Core.events;

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
      if (!this._player || !this._player.isActive) return;

      // Get player-enemy collisions
      var collisions = this._collisionSystem.getCollisionsByTags('player', 'enemy');

      for (var i = 0; i < collisions.length; i++) {
        var collision = collisions[i];
        var player = collision.entityA; // getCollisionsByTags ensures 'player' is entityA
        var enemy = collision.entityB;

        this._handlePlayerEnemyCollision(player, enemy);
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
