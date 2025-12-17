/**
 * @fileoverview Enemy system - handles spawning and AI
 * @module Systems/EnemySystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Velocity = window.VampireSurvivors.Components.Velocity;
  var Enemy = window.VampireSurvivors.Entities.Enemy;

  // ============================================
  // Constants
  // ============================================
  var SPAWN_INTERVAL = 2; // seconds
  var SPAWN_DISTANCE = 300; // pixels from player
  var MAX_ENEMIES = 50;
  var AI_UPDATE_INTERVAL = 0.2; // seconds

  // ============================================
  // Class Definition
  // ============================================
  class EnemySystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 8; // Before MovementSystem (10)
    _player = null;
    _spawnTimer = 0;
    _aiUpdateTimer = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    setPlayer(player) {
      this._player = player;
    }

    update(deltaTime) {
      if (!this._entityManager || !this._player || !this._player.isActive) return;

      // Update spawn timer
      this._spawnTimer += deltaTime;
      if (this._spawnTimer >= SPAWN_INTERVAL) {
        this._spawnTimer = 0;
        this._spawnEnemy();
      }

      // Update AI timer
      this._aiUpdateTimer += deltaTime;
      if (this._aiUpdateTimer >= AI_UPDATE_INTERVAL) {
        this._aiUpdateTimer = 0;
        this._updateEnemyAI();
      }

      // Cleanup dead enemies
      this._cleanupDeadEnemies();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _spawnEnemy() {
      var enemyCount = this._entityManager.getCountByTag('enemy');
      if (enemyCount >= MAX_ENEMIES) {
        return;
      }

      var playerTransform = this._player.getComponent(Transform);
      if (!playerTransform) return;

      // Random angle around player
      var angle = Math.random() * Math.PI * 2;
      var x = playerTransform.centerX + Math.cos(angle) * SPAWN_DISTANCE;
      var y = playerTransform.centerY + Math.sin(angle) * SPAWN_DISTANCE;

      // Create enemy at spawn position
      var enemy = this._entityManager.create(Enemy);
      var transform = enemy.getComponent(Transform);
      transform.x = x - transform.width / 2;
      transform.y = y - transform.height / 2;
    }

    _updateEnemyAI() {
      var enemies = this._entityManager.getByTag('enemy');
      if (!enemies || enemies.length === 0) return;

      var playerTransform = this._player.getComponent(Transform);
      if (!playerTransform) return;

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var transform = enemy.getComponent(Transform);
        var velocity = enemy.getComponent(Velocity);
        if (!transform || !velocity) continue;

        // Calculate direction to player
        var dx = playerX - transform.centerX;
        var dy = playerY - transform.centerY;
        var distance = Math.sqrt(dx * dx + dy * dy);

        // Normalize and apply speed
        if (distance > 0) {
          velocity.vx = (dx / distance) * enemy.speed;
          velocity.vy = (dy / distance) * enemy.speed;
        }
      }
    }

    _cleanupDeadEnemies() {
      var enemies = this._entityManager.getByTag('enemy');
      if (!enemies) return;

      for (var i = enemies.length - 1; i >= 0; i--) {
        var enemy = enemies[i];
        if (!enemy.isActive) {
          this._entityManager.destroy(enemy);
        }
      }
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var count = 0;
      if (this._entityManager) {
        count = this._entityManager.getCountByTag('enemy');
      }

      return {
        label: 'Enemies',
        entries: [
          { key: 'Count', value: count + '/' + MAX_ENEMIES },
          { key: 'Spawn Timer', value: this._spawnTimer.toFixed(1) + 's' },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._player = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.EnemySystem = EnemySystem;
})(window.VampireSurvivors.Systems);
