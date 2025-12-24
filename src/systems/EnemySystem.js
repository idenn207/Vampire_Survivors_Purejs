/**
 * @fileoverview Enemy system - handles spawning and AI with behavior pattern
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
  var EnemyData = window.VampireSurvivors.Data.EnemyData;
  var Behaviors = window.VampireSurvivors.Behaviors;
  var Pool = window.VampireSurvivors.Pool;

  // ============================================
  // Constants (Base values - modified by wave system)
  // ============================================
  var BASE_SPAWN_INTERVAL = 0.3; // seconds
  var SPAWN_DISTANCE = 300; // pixels from player
  var BASE_MAX_ENEMIES = 100;
  var AI_UPDATE_INTERVAL = 0.2; // seconds

  // Behaviors that need per-frame updates (for smooth animation)
  var ANIMATING_BEHAVIORS = ['jump_drop', 'self_destruct'];

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
    _currentWave = 1;

    // Behavior instances
    _behaviors = null;

    // Event handlers
    _boundOnWaveStarted = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._boundOnWaveStarted = this._onWaveStarted.bind(this);
      this._behaviors = {};
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    initialize(game, entityManager) {
      super.initialize(game, entityManager);

      // Subscribe to wave events
      events.on('wave:started', this._boundOnWaveStarted);

      // Initialize behaviors (will be fully set up when player is set)
      this._initializeBehaviors();
    }

    /**
     * Initialize all enemy behaviors
     * @private
     */
    _initializeBehaviors() {
      // Create behavior instances for each behavior type
      // Note: More behaviors will be added as they are implemented
      if (Behaviors.ChaseEnemyBehavior) {
        this._behaviors['chase'] = new Behaviors.ChaseEnemyBehavior();
      }
      if (Behaviors.FlyingEnemyBehavior) {
        this._behaviors['flying'] = new Behaviors.FlyingEnemyBehavior();
      }
      if (Behaviors.InvisibleEnemyBehavior) {
        this._behaviors['invisible'] = new Behaviors.InvisibleEnemyBehavior();
      }
      if (Behaviors.SelfDestructBehavior) {
        this._behaviors['self_destruct'] = new Behaviors.SelfDestructBehavior();
      }
      if (Behaviors.DashAttackBehavior) {
        this._behaviors['dash_attack'] = new Behaviors.DashAttackBehavior();
      }
      if (Behaviors.ProjectileEnemyBehavior) {
        this._behaviors['projectile'] = new Behaviors.ProjectileEnemyBehavior();
      }
      if (Behaviors.JumpDropBehavior) {
        this._behaviors['jump_drop'] = new Behaviors.JumpDropBehavior();
      }
    }

    /**
     * Get behavior for a given behavior type
     * @param {string} behaviorType - Behavior type key
     * @returns {EnemyBehavior|null}
     */
    getBehavior(behaviorType) {
      return this._behaviors[behaviorType] || this._behaviors['chase'] || null;
    }

    setPlayer(player) {
      this._player = player;

      // Log available behaviors for debugging
      console.log('[EnemySystem] setPlayer called, behaviors:', Object.keys(this._behaviors));

      // Initialize all behaviors with player reference
      for (var behaviorType in this._behaviors) {
        var behavior = this._behaviors[behaviorType];
        if (behavior) {
          behavior.initialize(this._entityManager, player, events);
        }
      }
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

      // Update animating enemies every frame (for smooth animation)
      this._updateAnimatingEnemies(deltaTime);

      // Update AI timer
      this._aiUpdateTimer += deltaTime;
      if (this._aiUpdateTimer >= AI_UPDATE_INTERVAL) {
        this._aiUpdateTimer = 0;
        this._updateEnemyAI();
      }

      // Update enemy projectiles
      if (Pool.enemyProjectilePool) {
        Pool.enemyProjectilePool.update(deltaTime);
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

      // Select enemy type based on current wave
      var enemyType = EnemyData.selectRandomType(this._currentWave);
      var config = EnemyData.getConfig(enemyType);

      // Random angle around player
      var angle = Math.random() * Math.PI * 2;
      var x = playerTransform.centerX + Math.cos(angle) * SPAWN_DISTANCE;
      var y = playerTransform.centerY + Math.sin(angle) * SPAWN_DISTANCE;

      // Create enemy at spawn position
      var enemy = this._entityManager.create(Enemy);

      // Configure enemy from type
      enemy.configureFromType(enemyType, config);

      // Position enemy
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

      // Notify behavior of spawn
      var behavior = this.getBehavior(config.behavior);
      if (behavior && behavior.onSpawn) {
        behavior.onSpawn(enemy, config);
      }
    }

    _onWaveStarted(data) {
      this._difficultyModifiers = data.modifiers;
      this._currentWave = data.wave;
      console.log('[EnemySystem] Wave ' + data.wave + ' started, modifiers:', data.modifiers);
    }

    /**
     * Update enemies with behaviors that need per-frame animation
     * @param {number} deltaTime
     * @private
     */
    _updateAnimatingEnemies(deltaTime) {
      var enemies = this._entityManager.getByTag('enemy');
      if (!enemies || enemies.length === 0) return;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        // Skip traversal enemies - they have their own movement patterns
        if (enemy.hasTag('traversal')) continue;

        var config = enemy.config;
        var behaviorType = config ? config.behavior : null;

        // Only update behaviors that need per-frame animation
        if (ANIMATING_BEHAVIORS.indexOf(behaviorType) === -1) continue;

        var behavior = this.getBehavior(behaviorType);
        if (behavior) {
          behavior.update(enemy, deltaTime);
        }
      }
    }

    _updateEnemyAI() {
      var enemies = this._entityManager.getByTag('enemy');
      if (!enemies || enemies.length === 0) return;

      // AI update uses fixed deltaTime based on interval
      var deltaTime = AI_UPDATE_INTERVAL;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        // Skip traversal enemies - they have their own movement patterns
        if (enemy.hasTag('traversal')) continue;

        // Get the behavior for this enemy type
        var config = enemy.config;
        var behaviorType = config ? config.behavior : 'chase';

        // Skip behaviors that are updated per-frame (avoid double update)
        if (ANIMATING_BEHAVIORS.indexOf(behaviorType) !== -1) continue;

        var behavior = this.getBehavior(behaviorType);

        if (behavior) {
          // Delegate AI to behavior
          behavior.update(enemy, deltaTime);
        } else {
          // Fallback: simple chase if no behavior found
          this._fallbackChase(enemy);
        }
      }
    }

    /**
     * Fallback chase behavior when no behavior class is available
     * @param {Entity} enemy
     * @private
     */
    _fallbackChase(enemy) {
      var playerTransform = this._player.getComponent(Transform);
      if (!playerTransform) return;

      var transform = enemy.getComponent(Transform);
      var velocity = enemy.getComponent(Velocity);
      if (!transform || !velocity) return;

      var dx = playerTransform.centerX - transform.centerX;
      var dy = playerTransform.centerY - transform.centerY;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        velocity.vx = (dx / distance) * enemy.speed;
        velocity.vy = (dy / distance) * enemy.speed;
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
    // Rendering
    // ----------------------------------------
    /**
     * Render enemy effects (called from RenderSystem before entities)
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} cameraX
     * @param {number} cameraY
     */
    renderEnemyEffects(ctx, cameraX, cameraY) {
      if (!this._entityManager) return;

      var enemies = this._entityManager.getByTag('enemy');
      if (!enemies) return;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var state = enemy.behaviorState;
        if (!state) continue;

        // Only render aurora for self_destruct enemies
        var config = enemy.config;
        if (!config || config.behavior !== 'self_destruct') continue;

        this._renderSelfDestructAurora(ctx, enemy, state, cameraX, cameraY);
      }
    }

    /**
     * Render red aurora for self-destruct enemy
     * @param {CanvasRenderingContext2D} ctx
     * @param {Entity} enemy
     * @param {Object} state - behaviorState
     * @param {number} cameraX
     * @param {number} cameraY
     * @private
     */
    _renderSelfDestructAurora(ctx, enemy, state, cameraX, cameraY) {
      var transform = enemy.getComponent(Transform);
      if (!transform) return;

      var screenX = transform.centerX - cameraX;
      var screenY = transform.centerY - cameraY;

      var radius = state.auroraRadius || state.explosionRadius || state.triggerRadius;
      if (radius <= 0) return;

      var auroraColor = state.auroraColor || '#FF0000';

      ctx.save();

      // Parse color for gradient (assuming hex format #RRGGBB)
      var r = parseInt(auroraColor.slice(1, 3), 16);
      var g = parseInt(auroraColor.slice(3, 5), 16);
      var b = parseInt(auroraColor.slice(5, 7), 16);

      // Determine alpha based on state - brighter during ignition
      var isIgnited = state.state === 'primed';
      var baseAlpha = isIgnited ? 0.4 : 0.25;

      // Pulsing effect
      var pulse = Math.sin(Date.now() / 300) * 0.05 + 1;
      var drawRadius = radius * pulse;

      // Radial gradient for fading edge effect
      var gradient = ctx.createRadialGradient(
        screenX,
        screenY,
        0,
        screenX,
        screenY,
        drawRadius
      );

      gradient.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ', 0.0)');
      gradient.addColorStop(0.6, 'rgba(' + r + ',' + g + ',' + b + ',' + baseAlpha * 0.3 + ')');
      gradient.addColorStop(0.85, 'rgba(' + r + ',' + g + ',' + b + ',' + baseAlpha + ')');
      gradient.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',' + baseAlpha * 0.5 + ')');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(screenX, screenY, drawRadius, 0, Math.PI * 2);
      ctx.fill();

      // Ring border (always visible, brighter during ignition)
      var ringAlpha = isIgnited ? 0.6 : 0.35;
      ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + ringAlpha + ')';
      ctx.lineWidth = isIgnited ? 2 : 1;
      ctx.beginPath();
      ctx.arc(screenX, screenY, drawRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
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

      // Dispose behaviors
      for (var behaviorType in this._behaviors) {
        var behavior = this._behaviors[behaviorType];
        if (behavior && behavior.dispose) {
          behavior.dispose();
        }
      }

      this._player = null;
      this._difficultyModifiers = null;
      this._boundOnWaveStarted = null;
      this._behaviors = {};

      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.EnemySystem = EnemySystem;
})(window.VampireSurvivors.Systems);
