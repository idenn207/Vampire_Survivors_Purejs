/**
 * @fileoverview Traversal enemy system - spawns and manages traversal enemies
 * @module Systems/TraversalEnemySystem
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
  var TraversalEnemy = window.VampireSurvivors.Entities.TraversalEnemy;
  var TraversalEnemyData = window.VampireSurvivors.Data.TraversalEnemyData;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Constants
  // ============================================
  var SPAWN_MARGIN = 100; // Spawn this far outside viewport

  // ============================================
  // Class Definition
  // ============================================
  class TraversalEnemySystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 9; // After EnemySystem (8), before MovementSystem (10)
    _player = null;
    _camera = null;
    _spawnTimer = 0;
    _currentWave = 1;

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

    setCamera(camera) {
      this._camera = camera;
    }

    update(deltaTime) {
      if (!this._entityManager || !this._player || !this._player.isActive) return;

      // Don't spawn until configured start wave
      if (this._currentWave < TraversalEnemyData.TraversalConfig.START_WAVE) {
        return;
      }

      // Update spawn timer
      var spawnInterval = TraversalEnemyData.getSpawnInterval(this._currentWave);
      this._spawnTimer += deltaTime;

      if (this._spawnTimer >= spawnInterval) {
        this._spawnTimer = 0;
        this._spawnTraversalEnemy();
      }

      // Update existing traversal enemies
      this._updateTraversalEnemies(deltaTime);
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _onWaveStarted(data) {
      this._currentWave = data.wave;
    }

    _spawnTraversalEnemy() {
      // Select random pattern
      var patternType = TraversalEnemyData.selectRandomPattern();
      var config = TraversalEnemyData.getPatternConfig(patternType);

      // Create enemy and initialize with pattern/config
      var enemy = this._entityManager.create(TraversalEnemy);
      enemy.init(patternType, config);

      // Apply wave health scaling
      var healthMultiplier = TraversalEnemyData.getWaveHealthMultiplier(this._currentWave);
      var health = enemy.getComponent(Health);
      if (health) {
        var newMaxHealth = Math.max(1, Math.floor(health.maxHealth * healthMultiplier));
        health.setMaxHealth(newMaxHealth, true);
      }

      // Initialize pattern (position and velocity)
      this._initializePattern(enemy, patternType, config);
    }

    _initializePattern(enemy, patternType, config) {
      var playerTransform = this._player.getComponent(Transform);
      if (!playerTransform) return;

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;
      var transform = enemy.getComponent(Transform);
      var velocity = enemy.getComponent(Velocity);

      switch (patternType) {
        case 'CIRCULAR':
          this._initCircularPattern(enemy, transform, velocity, playerX, playerY, config);
          break;

        case 'DASH':
          this._initDashPattern(enemy, transform, velocity, playerX, playerY, config);
          break;

        case 'LASER':
          this._initLaserPattern(enemy, transform, velocity, playerX, playerY, config);
          break;
      }
    }

    _initCircularPattern(enemy, transform, velocity, playerX, playerY, config) {
      // Spawn in a circle around player
      var angle = Math.random() * Math.PI * 2;
      var spawnRadius = config.spawnRadius || 200;

      var spawnX = playerX + Math.cos(angle) * spawnRadius;
      var spawnY = playerY + Math.sin(angle) * spawnRadius;

      transform.x = spawnX - transform.width / 2;
      transform.y = spawnY - transform.height / 2;

      // Move outward from spawn position (away from player)
      var moveSpeed = config.moveSpeed || 180;
      velocity.vx = Math.cos(angle) * moveSpeed;
      velocity.vy = Math.sin(angle) * moveSpeed;
    }

    _initDashPattern(enemy, transform, velocity, playerX, playerY, config) {
      // Spawn at random edge of viewport
      var viewportWidth = this._camera ? this._camera.viewportWidth : 800;
      var viewportHeight = this._camera ? this._camera.viewportHeight : 600;
      var cameraX = this._camera ? this._camera.x : 0;
      var cameraY = this._camera ? this._camera.y : 0;

      var edge = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
      var spawnX, spawnY;

      switch (edge) {
        case 0: // Top
          spawnX = cameraX + Math.random() * viewportWidth;
          spawnY = cameraY - SPAWN_MARGIN;
          break;
        case 1: // Right
          spawnX = cameraX + viewportWidth + SPAWN_MARGIN;
          spawnY = cameraY + Math.random() * viewportHeight;
          break;
        case 2: // Bottom
          spawnX = cameraX + Math.random() * viewportWidth;
          spawnY = cameraY + viewportHeight + SPAWN_MARGIN;
          break;
        case 3: // Left
          spawnX = cameraX - SPAWN_MARGIN;
          spawnY = cameraY + Math.random() * viewportHeight;
          break;
      }

      transform.x = spawnX - transform.width / 2;
      transform.y = spawnY - transform.height / 2;

      // Store target (player position at spawn time)
      enemy.setDashTarget(playerX, playerY);

      // Start charging (stationary pause before dashing)
      enemy.startCharge();
      velocity.vx = 0;
      velocity.vy = 0;
    }

    _initLaserPattern(enemy, transform, velocity, playerX, playerY, config) {
      // Spawn off-screen, move horizontally or vertically
      var viewportWidth = this._camera ? this._camera.viewportWidth : 800;
      var viewportHeight = this._camera ? this._camera.viewportHeight : 600;
      var cameraX = this._camera ? this._camera.x : 0;
      var cameraY = this._camera ? this._camera.y : 0;

      var isHorizontal = Math.random() < 0.5;
      var moveSpeed = config.moveSpeed || 250;
      var spawnX, spawnY;

      if (isHorizontal) {
        // Spawn left or right
        var fromLeft = Math.random() < 0.5;
        spawnX = fromLeft ? cameraX - SPAWN_MARGIN : cameraX + viewportWidth + SPAWN_MARGIN;
        spawnY = playerY; // Aligned with player's Y position

        velocity.vx = fromLeft ? moveSpeed : -moveSpeed;
        velocity.vy = 0;
      } else {
        // Spawn top or bottom
        var fromTop = Math.random() < 0.5;
        spawnX = playerX; // Aligned with player's X position
        spawnY = fromTop ? cameraY - SPAWN_MARGIN : cameraY + viewportHeight + SPAWN_MARGIN;

        velocity.vx = 0;
        velocity.vy = fromTop ? moveSpeed : -moveSpeed;
      }

      transform.x = spawnX - transform.width / 2;
      transform.y = spawnY - transform.height / 2;
    }

    _updateTraversalEnemies(deltaTime) {
      var traversals = this._entityManager.getByTag('traversal');
      if (!traversals || traversals.length === 0) return;

      for (var i = traversals.length - 1; i >= 0; i--) {
        var enemy = traversals[i];
        if (!enemy.isActive) continue;

        // Update decay
        var decayed = enemy.updateDecay(deltaTime);
        if (decayed) {
          enemy.isActive = false;
          this._entityManager.destroy(enemy);
          continue;
        }

        // Handle DASH pattern charging
        if (enemy.patternType === 'DASH' && enemy.isCharging) {
          var chargeComplete = enemy.updateCharge(deltaTime);
          if (chargeComplete) {
            // Launch the dash
            this._launchDash(enemy);
          }
        }

        // Visual feedback: fade out as decay approaches
        var sprite = enemy.sprite;
        if (sprite && enemy.decayProgress < 0.3) {
          // Start fading when less than 30% time remaining
          sprite.alpha = enemy.decayProgress / 0.3;
        }
      }
    }

    _launchDash(enemy) {
      var transform = enemy.getComponent(Transform);
      var velocity = enemy.getComponent(Velocity);
      if (!transform || !velocity) return;

      // Calculate direction to stored target
      var dx = enemy.targetX - transform.centerX;
      var dy = enemy.targetY - transform.centerY;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        var dashSpeed = enemy.speed;
        velocity.vx = (dx / distance) * dashSpeed;
        velocity.vy = (dy / distance) * dashSpeed;
      }
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var count = 0;
      if (this._entityManager) {
        count = this._entityManager.getCountByTag('traversal');
      }

      var spawnInterval = TraversalEnemyData.getSpawnInterval(this._currentWave);

      return {
        label: 'Traversal',
        entries: [
          { key: 'Count', value: count },
          { key: 'Spawn Timer', value: this._spawnTimer.toFixed(1) + '/' + spawnInterval.toFixed(1) + 's' },
          { key: 'Wave', value: this._currentWave },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      events.off('wave:started', this._boundOnWaveStarted);

      this._player = null;
      this._camera = null;
      this._boundOnWaveStarted = null;

      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.TraversalEnemySystem = TraversalEnemySystem;
})(window.VampireSurvivors.Systems);
