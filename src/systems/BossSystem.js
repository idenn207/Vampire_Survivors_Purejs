/**
 * @fileoverview Boss system - spawns and manages boss enemies
 * @module Systems/BossSystem
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
  var Boss = window.VampireSurvivors.Entities.Boss;
  var BossData = window.VampireSurvivors.Data.BossData;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Constants
  // ============================================
  var SPAWN_DISTANCE = 400; // Distance from player to spawn boss
  var AI_UPDATE_INTERVAL = 0.1; // How often to update AI (seconds)
  var ATTACK_RANGE = 500; // Max range for attack selection
  var CHASE_STOP_DISTANCE = 100; // Stop chasing when this close

  // Boss projectile constants
  var PROJECTILE_SIZE = 16;
  var PROJECTILE_COLOR = '#FF4444';
  var PROJECTILE_LIFETIME = 5.0;

  // ============================================
  // Class Definition
  // ============================================
  class BossSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 105; // After RenderSystem (100), before HUDSystem (110)
    _player = null;
    _camera = null;
    _hudSystem = null;
    _currentWave = 1;
    _activeBosses = [];
    _aiTimer = 0;

    // Boss projectiles (manually managed)
    _bossProjectiles = [];

    // Event handlers
    _boundOnWaveStarted = null;
    _boundOnEntityDied = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._boundOnWaveStarted = this._onWaveStarted.bind(this);
      this._boundOnEntityDied = this._onEntityDied.bind(this);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    initialize(game, entityManager) {
      super.initialize(game, entityManager);

      events.on('wave:started', this._boundOnWaveStarted);
      events.on('entity:died', this._boundOnEntityDied);
    }

    setPlayer(player) {
      this._player = player;
    }

    setCamera(camera) {
      this._camera = camera;
    }

    setHUDSystem(hudSystem) {
      this._hudSystem = hudSystem;
    }

    update(deltaTime) {
      if (!this._entityManager || !this._player || !this._player.isActive) return;

      // Update AI timer
      this._aiTimer += deltaTime;

      // Update all active bosses
      this._updateBosses(deltaTime);

      // Update boss projectiles
      this._updateProjectiles(deltaTime);

      // Cleanup inactive bosses
      this._cleanupInactiveBosses();
    }

    /**
     * Get the primary boss (first active boss)
     * @returns {Boss|null}
     */
    getPrimaryBoss() {
      return this._activeBosses.length > 0 ? this._activeBosses[0] : null;
    }

    /**
     * Get all active bosses
     * @returns {Array<Boss>}
     */
    getActiveBosses() {
      return this._activeBosses;
    }

    // ----------------------------------------
    // Private Methods - Event Handlers
    // ----------------------------------------
    _onWaveStarted(data) {
      this._currentWave = data.wave;

      // Check for boss wave
      if (data.specialWave && data.specialWave.isBossWave) {
        this._spawnBossWave(data.specialWave, data.wave);
      }
    }

    _onEntityDied(data) {
      if (!data || !data.entity) return;

      // Check if it's a boss
      if (data.entity.hasTag && data.entity.hasTag('boss')) {
        this._handleBossDeath(data.entity);
      }
    }

    // ----------------------------------------
    // Private Methods - Spawning
    // ----------------------------------------
    _spawnBossWave(specialWave, wave) {
      var bossType = specialWave.bossType;
      var bossCount = specialWave.bossCount || 1;

      for (var i = 0; i < bossCount; i++) {
        this._spawnBoss(bossType, wave, i, bossCount);
      }
    }

    _spawnBoss(bossType, wave, index, totalCount) {
      var playerTransform = this._player.getComponent(Transform);
      if (!playerTransform) return;

      // Calculate spawn position (spread around player)
      var angleOffset = totalCount > 1 ? (index / totalCount) * Math.PI * 2 : Math.random() * Math.PI * 2;
      var spawnX = playerTransform.centerX + Math.cos(angleOffset) * SPAWN_DISTANCE;
      var spawnY = playerTransform.centerY + Math.sin(angleOffset) * SPAWN_DISTANCE;

      // Create boss entity
      var boss = this._entityManager.create(Boss);
      boss.init(bossType, wave);

      // Set position
      var transform = boss.getComponent(Transform);
      transform.x = spawnX - transform.width / 2;
      transform.y = spawnY - transform.height / 2;

      // Add to active list
      this._activeBosses.push(boss);

      // Notify HUD
      if (this._hudSystem && this._activeBosses.length === 1) {
        this._hudSystem.setBoss(boss);
      }

      console.log('[BossSystem] Spawned', bossType, 'boss at wave', wave);
    }

    _handleBossDeath(boss) {
      // Remove from active list
      var index = this._activeBosses.indexOf(boss);
      if (index !== -1) {
        this._activeBosses.splice(index, 1);
      }

      // Update HUD
      if (this._hudSystem) {
        if (this._activeBosses.length > 0) {
          this._hudSystem.setBoss(this._activeBosses[0]);
        } else {
          this._hudSystem.clearBoss();
        }
      }

      console.log('[BossSystem] Boss defeated!');
    }

    // ----------------------------------------
    // Private Methods - Boss Updates
    // ----------------------------------------
    _updateBosses(deltaTime) {
      for (var i = 0; i < this._activeBosses.length; i++) {
        var boss = this._activeBosses[i];
        if (!boss.isActive) continue;

        // Update cooldowns
        boss.updateCooldowns(deltaTime);

        // Update telegraph
        if (boss.isTelegraphing) {
          if (boss.updateTelegraph(deltaTime)) {
            // Telegraph complete - execute attack
            this._executeAttack(boss);
          }
          continue; // Don't do other updates during telegraph
        }

        // Update dash
        if (boss.isDashing) {
          boss.updateDash(deltaTime);
          continue; // Don't chase while dashing
        }

        // Check phase transition
        var phaseChanged = boss.updatePhase();
        if (phaseChanged) {
          // Visual feedback could be added here
          console.log('[BossSystem] Boss entered phase', boss.currentPhaseIndex + 1);
        }

        // AI update (throttled)
        if (this._aiTimer >= AI_UPDATE_INTERVAL) {
          this._updateBossAI(boss);
        }
      }

      // Reset AI timer
      if (this._aiTimer >= AI_UPDATE_INTERVAL) {
        this._aiTimer = 0;
      }
    }

    _updateBossAI(boss) {
      var playerTransform = this._player.getComponent(Transform);
      var bossTransform = boss.getComponent(Transform);
      if (!playerTransform || !bossTransform) return;

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;
      var bossX = bossTransform.centerX;
      var bossY = bossTransform.centerY;

      var dx = playerX - bossX;
      var dy = playerY - bossY;
      var distance = Math.sqrt(dx * dx + dy * dy);

      // Try to use an attack
      var availableAttacks = boss.getAvailableAttacks();

      if (availableAttacks.length > 0 && distance < ATTACK_RANGE) {
        // Prioritize attacks: ring > dash > projectile
        var attackPriority = ['ring', 'dash', 'projectile'];
        var selectedAttack = null;

        for (var i = 0; i < attackPriority.length; i++) {
          if (availableAttacks.indexOf(attackPriority[i]) !== -1) {
            selectedAttack = attackPriority[i];
            break;
          }
        }

        if (selectedAttack) {
          boss.startTelegraph(selectedAttack, playerX, playerY);
          return;
        }
      }

      // Chase player if not attacking
      this._chasePlayer(boss, dx, dy, distance);
    }

    _chasePlayer(boss, dx, dy, distance) {
      var velocity = boss.getComponent(Velocity);
      if (!velocity) return;

      if (distance <= CHASE_STOP_DISTANCE) {
        // Close enough, stop
        velocity.vx = 0;
        velocity.vy = 0;
        return;
      }

      // Move toward player
      var speed = boss.getCurrentSpeed();
      velocity.vx = (dx / distance) * speed;
      velocity.vy = (dy / distance) * speed;
    }

    // ----------------------------------------
    // Private Methods - Attack Execution
    // ----------------------------------------
    _executeAttack(boss) {
      var attackData = boss.executePendingAttack();
      if (!attackData) return;

      switch (attackData.type) {
        case 'dash':
          this._executeDash(boss, attackData);
          break;
        case 'projectile':
          this._executeProjectile(boss, attackData);
          break;
        case 'ring':
          this._executeRing(boss, attackData);
          break;
      }
    }

    _executeDash(boss, attackData) {
      boss.startDash(attackData.targetX, attackData.targetY, attackData.config);
    }

    _executeProjectile(boss, attackData) {
      var bossTransform = boss.getComponent(Transform);
      if (!bossTransform) return;

      var config = attackData.config;
      var startX = bossTransform.centerX;
      var startY = bossTransform.centerY;
      var dx = attackData.targetX - startX;
      var dy = attackData.targetY - startY;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist === 0) return;

      var vx = (dx / dist) * config.speed;
      var vy = (dy / dist) * config.speed;

      this._spawnBossProjectile(startX, startY, vx, vy, config.damage);
    }

    _executeRing(boss, attackData) {
      var bossTransform = boss.getComponent(Transform);
      if (!bossTransform) return;

      var config = attackData.config;
      var startX = bossTransform.centerX;
      var startY = bossTransform.centerY;
      var count = config.projectileCount;
      var speed = config.projectileSpeed;
      var damage = config.damage;

      // Spawn projectiles in a ring
      var angleStep = (Math.PI * 2) / count;
      for (var i = 0; i < count; i++) {
        var angle = i * angleStep;
        var vx = Math.cos(angle) * speed;
        var vy = Math.sin(angle) * speed;
        this._spawnBossProjectile(startX, startY, vx, vy, damage);
      }
    }

    // ----------------------------------------
    // Private Methods - Boss Projectiles
    // ----------------------------------------
    _spawnBossProjectile(x, y, vx, vy, damage) {
      this._bossProjectiles.push({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        damage: damage,
        lifetime: PROJECTILE_LIFETIME,
        size: PROJECTILE_SIZE,
        color: PROJECTILE_COLOR,
      });
    }

    _updateProjectiles(deltaTime) {
      var playerTransform = this._player.getComponent(Transform);
      var playerHealth = this._player.getComponent(Health);
      if (!playerTransform) return;

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;
      var playerRadius = playerTransform.width / 2;

      for (var i = this._bossProjectiles.length - 1; i >= 0; i--) {
        var proj = this._bossProjectiles[i];

        // Update position
        proj.x += proj.vx * deltaTime;
        proj.y += proj.vy * deltaTime;

        // Update lifetime
        proj.lifetime -= deltaTime;
        if (proj.lifetime <= 0) {
          this._bossProjectiles.splice(i, 1);
          continue;
        }

        // Check collision with player
        if (playerHealth && !playerHealth.isInvincible) {
          var dx = proj.x - playerX;
          var dy = proj.y - playerY;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < proj.size / 2 + playerRadius) {
            // Hit player
            playerHealth.takeDamage(proj.damage);
            playerHealth.setInvincible(1.0);

            // Emit damage event
            events.emit('player:damaged', {
              amount: proj.damage,
              currentHealth: playerHealth.currentHealth,
              maxHealth: playerHealth.maxHealth,
            });

            // Check for player death
            if (playerHealth.isDead) {
              events.emit('player:died', {
                player: this._player,
                killer: null, // Boss projectile
              });
            }

            // Remove projectile
            this._bossProjectiles.splice(i, 1);
          }
        }
      }
    }

    render(ctx) {
      this._renderProjectiles(ctx);
    }

    /**
     * Render boss projectiles
     * @param {CanvasRenderingContext2D} ctx
     */
    _renderProjectiles(ctx) {
      if (!this._camera) return;

      for (var i = 0; i < this._bossProjectiles.length; i++) {
        var proj = this._bossProjectiles[i];

        // Convert to screen coordinates
        var screenPos = this._camera.worldToScreen(proj.x, proj.y);

        ctx.fillStyle = proj.color;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, proj.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // ----------------------------------------
    // Private Methods - Cleanup
    // ----------------------------------------
    _cleanupInactiveBosses() {
      for (var i = this._activeBosses.length - 1; i >= 0; i--) {
        if (!this._activeBosses[i].isActive) {
          this._activeBosses.splice(i, 1);
        }
      }
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var primaryBoss = this.getPrimaryBoss();
      var entries = [
        { key: 'Active Bosses', value: this._activeBosses.length },
        { key: 'Projectiles', value: this._bossProjectiles.length },
      ];

      if (primaryBoss) {
        var health = primaryBoss.getComponent(Health);
        entries.push({ key: 'Boss HP', value: health ? health.currentHealth + '/' + health.maxHealth : 'N/A' });
        entries.push({ key: 'Phase', value: primaryBoss.currentPhaseIndex + 1 });
      }

      return {
        label: 'Boss System',
        entries: entries,
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      events.off('wave:started', this._boundOnWaveStarted);
      events.off('entity:died', this._boundOnEntityDied);

      this._player = null;
      this._camera = null;
      this._hudSystem = null;
      this._activeBosses = [];
      this._bossProjectiles = [];
      this._boundOnWaveStarted = null;
      this._boundOnEntityDied = null;

      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.BossSystem = BossSystem;
})(window.VampireSurvivors.Systems);
