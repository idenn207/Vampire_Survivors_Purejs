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

    // Pending spawn queue for arrow indicators
    _pendingSpawns = []; // Array of { patternType, directions, timer, spawnData }

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

      var warningTime = TraversalEnemyData.TraversalConfig.WARNING_TIME;
      var spawnInterval = TraversalEnemyData.getSpawnInterval(this._currentWave);

      // Update spawn timer
      this._spawnTimer += deltaTime;

      // Queue spawn when warning time is reached
      if (this._spawnTimer >= spawnInterval - warningTime && this._spawnTimer - deltaTime < spawnInterval - warningTime) {
        this._queueNextSpawn();
      }

      // Reset timer when interval reached
      if (this._spawnTimer >= spawnInterval) {
        this._spawnTimer = 0;
      }

      // Update pending spawns
      this._updatePendingSpawns(deltaTime);

      // Update existing traversal enemies
      this._updateTraversalEnemies(deltaTime);
    }

    /**
     * Get pending spawn indicators for rendering
     * @returns {Array} Array of { patternType, directions, color, progress }
     */
    getPendingIndicators() {
      var indicators = [];
      var warningTime = TraversalEnemyData.TraversalConfig.WARNING_TIME;

      for (var i = 0; i < this._pendingSpawns.length; i++) {
        var pending = this._pendingSpawns[i];
        indicators.push({
          patternType: pending.patternType,
          directions: pending.directions,
          color: TraversalEnemyData.getPatternColor(pending.patternType),
          progress: 1 - pending.timer / warningTime, // 0 to 1 as spawn approaches
        });
      }

      return indicators;
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _onWaveStarted(data) {
      this._currentWave = data.wave;
    }

    /**
     * Queue the next spawn with pre-calculated directions
     */
    _queueNextSpawn() {
      var patternType = TraversalEnemyData.selectRandomPattern();
      var warningTime = TraversalEnemyData.TraversalConfig.WARNING_TIME;
      var directions = [];
      var spawnData = {};

      // Pre-calculate directions based on pattern type
      switch (patternType) {
        case 'CIRCULAR':
          // Circular spawns around player - show all 4 directions
          directions = ['top', 'bottom', 'left', 'right'];
          break;

        case 'DASH':
          // Dash comes from one edge
          var edge = Math.floor(Math.random() * 4);
          directions = [this._edgeToDirection(edge)];
          spawnData.edge = edge;
          break;

        case 'LASER':
          // Laser can come from 1-4 directions
          directions = TraversalEnemyData.selectLaserDirections();
          spawnData.directions = directions;
          spawnData.isTargeted = TraversalEnemyData.isLaserTargeted();
          spawnData.enemiesPerLine = TraversalEnemyData.getEnemiesPerLine();
          break;
      }

      this._pendingSpawns.push({
        patternType: patternType,
        directions: directions,
        timer: warningTime,
        spawnData: spawnData,
      });
    }

    /**
     * Update pending spawns and execute when timer reaches 0
     */
    _updatePendingSpawns(deltaTime) {
      for (var i = this._pendingSpawns.length - 1; i >= 0; i--) {
        var pending = this._pendingSpawns[i];
        pending.timer -= deltaTime;

        if (pending.timer <= 0) {
          // Execute the spawn
          this._executeSpawn(pending);
          this._pendingSpawns.splice(i, 1);
        }
      }
    }

    /**
     * Execute a queued spawn
     */
    _executeSpawn(pending) {
      var config = TraversalEnemyData.getPatternConfig(pending.patternType);

      switch (pending.patternType) {
        case 'CIRCULAR':
          this._spawnCircularWave(config);
          break;

        case 'DASH':
          this._spawnDashGroupAtEdge(config, pending.spawnData.edge);
          break;

        case 'LASER':
          this._spawnLaserLinesWithData(config, pending.spawnData);
          break;
      }
    }

    /**
     * Convert edge number to direction string
     */
    _edgeToDirection(edge) {
      switch (edge) {
        case 0:
          return 'top';
        case 1:
          return 'right';
        case 2:
          return 'bottom';
        case 3:
        default:
          return 'left';
      }
    }

    // ----------------------------------------
    // Group Spawning Methods
    // ----------------------------------------
    _spawnPattern(patternType) {
      var config = TraversalEnemyData.getPatternConfig(patternType);

      switch (patternType) {
        case 'CIRCULAR':
          this._spawnCircularWave(config);
          break;
        case 'DASH':
          this._spawnDashGroup(config);
          break;
        case 'LASER':
          this._spawnLaserLines(config);
          break;
      }
    }

    /**
     * Spawn a stationary ring of enemies around the player
     */
    _spawnCircularWave(config) {
      var playerTransform = this._player.getComponent(Transform);
      if (!playerTransform) return;

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;
      var count = TraversalEnemyData.getEnemyCount('CIRCULAR');
      var angleStep = (Math.PI * 2) / count;

      for (var i = 0; i < count; i++) {
        var angle = i * angleStep;
        var x = playerX + Math.cos(angle) * config.spawnRadius;
        var y = playerY + Math.sin(angle) * config.spawnRadius;

        var enemy = this._createTraversalEnemy('CIRCULAR', config);
        var transform = enemy.getComponent(Transform);
        transform.x = x - transform.width / 2;
        transform.y = y - transform.height / 2;
        // Velocity stays at 0 - STATIONARY
      }
    }

    /**
     * Spawn a clustered group of enemies that charge toward player
     */
    _spawnDashGroup(config) {
      var edge = Math.floor(Math.random() * 4);
      this._spawnDashGroupAtEdge(config, edge);
    }

    /**
     * Spawn a clustered group of enemies from a specific edge
     */
    _spawnDashGroupAtEdge(config, edge) {
      var playerTransform = this._player.getComponent(Transform);
      if (!playerTransform) return;

      var targetX = playerTransform.centerX;
      var targetY = playerTransform.centerY;
      var count = TraversalEnemyData.getEnemyCount('DASH');

      // Get base position for the specified edge
      var basePos = this._getEdgePosition(edge);

      for (var i = 0; i < count; i++) {
        // Spread enemies in cluster
        var offsetX = (Math.random() - 0.5) * config.groupSpread;
        var offsetY = (Math.random() - 0.5) * config.groupSpread;

        var enemy = this._createTraversalEnemy('DASH', config);
        var transform = enemy.getComponent(Transform);
        transform.x = basePos.x + offsetX - transform.width / 2;
        transform.y = basePos.y + offsetY - transform.height / 2;

        // All enemies target the same position (player at spawn time)
        enemy.setDashTarget(targetX, targetY);
        enemy.startCharge();
      }
    }

    /**
     * Spawn line formations from 1-4 screen edges
     */
    _spawnLaserLines(config) {
      var directions = TraversalEnemyData.selectLaserDirections();
      var isTargeted = TraversalEnemyData.isLaserTargeted();
      var enemiesPerLine = TraversalEnemyData.getEnemiesPerLine();

      for (var i = 0; i < directions.length; i++) {
        this._spawnLaserLine(directions[i], enemiesPerLine, config, isTargeted);
      }
    }

    /**
     * Spawn laser lines with pre-calculated data
     */
    _spawnLaserLinesWithData(config, spawnData) {
      var directions = spawnData.directions;
      var isTargeted = spawnData.isTargeted;
      var enemiesPerLine = spawnData.enemiesPerLine;

      for (var i = 0; i < directions.length; i++) {
        this._spawnLaserLine(directions[i], enemiesPerLine, config, isTargeted);
      }
    }

    /**
     * Spawn a single line of enemies from a specific direction
     */
    _spawnLaserLine(direction, count, config, isTargeted) {
      var playerTransform = this._player.getComponent(Transform);
      if (!playerTransform) return;

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;
      var spacing = config.enemySpacing;
      var moveSpeed = config.moveSpeed;
      // Use spawnOffset for wider spawn area outside viewport
      var spawnOffset = config.spawnOffset || SPAWN_MARGIN;

      var viewportWidth = this._camera ? this._camera.viewportWidth : 800;
      var viewportHeight = this._camera ? this._camera.viewportHeight : 600;
      var cameraX = this._camera ? this._camera.x : 0;
      var cameraY = this._camera ? this._camera.y : 0;

      // Calculate line center and spawn position based on direction
      var lineLength = count * spacing;
      var halfLength = lineLength / 2;

      for (var i = 0; i < count; i++) {
        var enemy = this._createTraversalEnemy('LASER', config);
        var transform = enemy.getComponent(Transform);
        var velocity = enemy.getComponent(Velocity);

        var spawnX, spawnY, vx, vy;
        var lineOffset = (i - (count - 1) / 2) * spacing; // Center the line

        switch (direction) {
          case 'top':
            spawnX = playerX + lineOffset;
            spawnY = cameraY - spawnOffset;
            if (isTargeted) {
              // Aim at player
              var dx = playerX - spawnX;
              var dy = playerY - spawnY;
              var dist = Math.sqrt(dx * dx + dy * dy);
              vx = dist > 0 ? (dx / dist) * moveSpeed : 0;
              vy = dist > 0 ? (dy / dist) * moveSpeed : moveSpeed;
            } else {
              vx = 0;
              vy = moveSpeed;
            }
            break;

          case 'bottom':
            spawnX = playerX + lineOffset;
            spawnY = cameraY + viewportHeight + spawnOffset;
            if (isTargeted) {
              var dx2 = playerX - spawnX;
              var dy2 = playerY - spawnY;
              var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
              vx = dist2 > 0 ? (dx2 / dist2) * moveSpeed : 0;
              vy = dist2 > 0 ? (dy2 / dist2) * moveSpeed : -moveSpeed;
            } else {
              vx = 0;
              vy = -moveSpeed;
            }
            break;

          case 'left':
            spawnX = cameraX - spawnOffset;
            spawnY = playerY + lineOffset;
            if (isTargeted) {
              var dx3 = playerX - spawnX;
              var dy3 = playerY - spawnY;
              var dist3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);
              vx = dist3 > 0 ? (dx3 / dist3) * moveSpeed : moveSpeed;
              vy = dist3 > 0 ? (dy3 / dist3) * moveSpeed : 0;
            } else {
              vx = moveSpeed;
              vy = 0;
            }
            break;

          case 'right':
            spawnX = cameraX + viewportWidth + spawnOffset;
            spawnY = playerY + lineOffset;
            if (isTargeted) {
              var dx4 = playerX - spawnX;
              var dy4 = playerY - spawnY;
              var dist4 = Math.sqrt(dx4 * dx4 + dy4 * dy4);
              vx = dist4 > 0 ? (dx4 / dist4) * moveSpeed : -moveSpeed;
              vy = dist4 > 0 ? (dy4 / dist4) * moveSpeed : 0;
            } else {
              vx = -moveSpeed;
              vy = 0;
            }
            break;
        }

        transform.x = spawnX - transform.width / 2;
        transform.y = spawnY - transform.height / 2;
        velocity.vx = vx;
        velocity.vy = vy;
      }
    }

    /**
     * Get spawn position at screen edge
     */
    _getEdgePosition(edge) {
      var viewportWidth = this._camera ? this._camera.viewportWidth : 800;
      var viewportHeight = this._camera ? this._camera.viewportHeight : 600;
      var cameraX = this._camera ? this._camera.x : 0;
      var cameraY = this._camera ? this._camera.y : 0;

      switch (edge) {
        case 0: // Top
          return {
            x: cameraX + viewportWidth / 2,
            y: cameraY - SPAWN_MARGIN,
          };
        case 1: // Right
          return {
            x: cameraX + viewportWidth + SPAWN_MARGIN,
            y: cameraY + viewportHeight / 2,
          };
        case 2: // Bottom
          return {
            x: cameraX + viewportWidth / 2,
            y: cameraY + viewportHeight + SPAWN_MARGIN,
          };
        case 3: // Left
        default:
          return {
            x: cameraX - SPAWN_MARGIN,
            y: cameraY + viewportHeight / 2,
          };
      }
    }

    /**
     * Create a single traversal enemy with pattern config
     */
    _createTraversalEnemy(patternType, config) {
      var enemy = this._entityManager.create(TraversalEnemy);
      enemy.init(patternType, config);

      // Apply wave health scaling
      var healthMultiplier = TraversalEnemyData.getWaveHealthMultiplier(this._currentWave);
      var health = enemy.getComponent(Health);
      if (health) {
        var newMaxHealth = Math.max(1, Math.floor(health.maxHealth * healthMultiplier));
        health.setMaxHealth(newMaxHealth, true);
      }

      return enemy;
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
      this._pendingSpawns = [];
      this._boundOnWaveStarted = null;

      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.TraversalEnemySystem = TraversalEnemySystem;
})(window.VampireSurvivors.Systems);
