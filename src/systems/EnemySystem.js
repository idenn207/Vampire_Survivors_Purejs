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
  var Health = window.VampireSurvivors.Components.Health;
  var Enemy = window.VampireSurvivors.Entities.Enemy;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Constants (Base values - modified by wave system)
  // ============================================
  var BASE_SPAWN_INTERVAL = 0.3; // seconds
  var SPAWN_DISTANCE = 300; // pixels from player
  var BASE_MAX_ENEMIES = 100;
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

    // Wave difficulty modifiers
    _difficultyModifiers = null;

    // Event handlers
    _boundOnWaveStarted = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._boundOnWaveStarted = this._onWaveStarted.bind(this);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    initialize(game, entityManager) {
      super.initialize(game, entityManager);

      // Subscribe to wave events
      events.on('wave:started', this._boundOnWaveStarted);
    }

    setPlayer(player) {
      this._player = player;
    }

    update(deltaTime) {
      if (!this._entityManager || !this._player || !this._player.isActive) return;

      // Calculate spawn interval based on difficulty modifiers
      var modifiers = this._difficultyModifiers || {};
      var spawnInterval = BASE_SPAWN_INTERVAL / (modifiers.spawnRateMultiplier || 1);

      // Update spawn timer
      this._spawnTimer += deltaTime;
      if (this._spawnTimer >= spawnInterval) {
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
      // Calculate max enemies based on difficulty modifiers
      var modifiers = this._difficultyModifiers || {};
      var maxEnemies = Math.floor(BASE_MAX_ENEMIES * (modifiers.maxEnemiesMultiplier || 1));

      var enemyCount = this._entityManager.getCountByTag('enemy');
      if (enemyCount >= maxEnemies) {
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

      // Apply difficulty modifiers to enemy stats
      if (modifiers.enemyDamageMultiplier) {
        enemy.damage = Math.floor(enemy.damage * modifiers.enemyDamageMultiplier);
      }
      if (modifiers.enemyHealthMultiplier) {
        var health = enemy.getComponent(Health);
        if (health) {
          var newMaxHealth = Math.max(1, Math.floor(health.maxHealth * modifiers.enemyHealthMultiplier));
          health.setMaxHealth(newMaxHealth, true);
        }
      }
    }

    _onWaveStarted(data) {
      this._difficultyModifiers = data.modifiers;
      console.log('[EnemySystem] Wave ' + data.wave + ' started, modifiers:', data.modifiers);
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

        // Skip traversal enemies - they have their own movement patterns
        if (enemy.hasTag('traversal')) continue;

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

      var modifiers = this._difficultyModifiers || {};
      var maxEnemies = Math.floor(BASE_MAX_ENEMIES * (modifiers.maxEnemiesMultiplier || 1));
      var spawnInterval = BASE_SPAWN_INTERVAL / (modifiers.spawnRateMultiplier || 1);

      return {
        label: 'Enemies',
        entries: [
          { key: 'Count', value: count + '/' + maxEnemies },
          { key: 'Spawn Rate', value: spawnInterval.toFixed(2) + 's' },
          { key: 'Spawn Timer', value: this._spawnTimer.toFixed(1) + 's' },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      events.off('wave:started', this._boundOnWaveStarted);

      this._player = null;
      this._difficultyModifiers = null;
      this._boundOnWaveStarted = null;

      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.EnemySystem = EnemySystem;
})(window.VampireSurvivors.Systems);
