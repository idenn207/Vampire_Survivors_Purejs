/**
 * @fileoverview Enemy projectile pool - pool for enemy-fired projectiles
 * @module Pool/EnemyProjectilePool
 */
(function (Pool) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var ObjectPool = Pool.ObjectPool;

  // ============================================
  // Constants
  // ============================================
  var INITIAL_SIZE = 50;
  var MAX_SIZE = 150;

  // ============================================
  // Enemy Projectile Object
  // ============================================
  /**
   * Simple projectile object for enemies (not a full entity)
   */
  function EnemyProjectile() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.damage = 10;
    this.size = 10;
    this.color = '#88FF00';
    this.lifetime = 5.0;
    this.age = 0;
    this.isActive = false;
    this.sourceEnemy = null;
  }

  EnemyProjectile.prototype.reset = function (x, y, vx, vy, damage, size, color, lifetime) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage || 10;
    this.size = size || 10;
    this.color = color || '#88FF00';
    this.lifetime = lifetime || 5.0;
    this.age = 0;
    this.isActive = true;
    this.sourceEnemy = null;
  };

  EnemyProjectile.prototype.update = function (deltaTime) {
    if (!this.isActive) return;

    // Update position
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    // Update age
    this.age += deltaTime;
    if (this.age >= this.lifetime) {
      this.isActive = false;
    }
  };

  // ============================================
  // Class Definition
  // ============================================
  class EnemyProjectilePool {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _pool = null;
    _player = null;
    _events = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      var self = this;

      this._pool = new ObjectPool(
        function () {
          return new EnemyProjectile();
        },
        null,
        INITIAL_SIZE,
        MAX_SIZE
      );
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Initialize pool with player reference
     * @param {Entity} player
     * @param {EventBus} events
     */
    initialize(player, events) {
      this._player = player;
      this._events = events;
    }

    /**
     * Set player reference
     * @param {Entity} player
     */
    setPlayer(player) {
      this._player = player;
    }

    /**
     * Spawn a projectile
     * @param {number} x - Starting X position
     * @param {number} y - Starting Y position
     * @param {number} angle - Direction angle in radians
     * @param {number} speed - Movement speed
     * @param {number} damage - Damage dealt
     * @param {number} size - Projectile size
     * @param {string} color - Projectile color
     * @param {number} lifetime - Time before despawn
     * @param {Entity} sourceEnemy - Enemy that fired this
     * @returns {EnemyProjectile|null}
     */
    spawn(x, y, angle, speed, damage, size, color, lifetime, sourceEnemy) {
      var projectile = this._pool.get();
      if (!projectile) {
        console.warn('[EnemyProjectilePool] Pool exhausted');
        return null;
      }

      var vx = Math.cos(angle) * speed;
      var vy = Math.sin(angle) * speed;

      projectile.reset(x, y, vx, vy, damage, size, color, lifetime);
      projectile.sourceEnemy = sourceEnemy;

      return projectile;
    }

    /**
     * Return a projectile to the pool
     * @param {EnemyProjectile} projectile
     */
    despawn(projectile) {
      if (!projectile) return;
      projectile.isActive = false;
      this._pool.release(projectile);
    }

    /**
     * Update all active projectiles and check collisions
     * @param {number} deltaTime
     */
    update(deltaTime) {
      var active = this._pool.getActiveObjects();
      var Transform = window.VampireSurvivors.Components.Transform;
      var Health = window.VampireSurvivors.Components.Health;

      for (var i = 0; i < active.length; i++) {
        var projectile = active[i];

        // Update projectile
        projectile.update(deltaTime);

        // Check if still active after update
        if (!projectile.isActive) {
          this._pool.release(projectile);
          continue;
        }

        // Check collision with player
        if (this._player && this._player.isActive) {
          var playerTransform = this._player.getComponent(Transform);
          if (playerTransform) {
            var dx = projectile.x - playerTransform.centerX;
            var dy = projectile.y - playerTransform.centerY;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var hitRadius = projectile.size / 2 + playerTransform.width / 2;

            if (distance < hitRadius) {
              // Hit player
              var playerHealth = this._player.getComponent(Health);
              if (playerHealth) {
                playerHealth.takeDamage(projectile.damage);
              }

              // Emit hit event
              if (this._events) {
                this._events.emit('enemy_projectile:hit', {
                  projectile: projectile,
                  damage: projectile.damage,
                });
              }

              // Despawn projectile
              projectile.isActive = false;
              this._pool.release(projectile);
            }
          }
        }
      }
    }

    /**
     * Render all active projectiles
     * @param {CanvasRenderingContext2D} ctx
     * @param {Camera} camera
     */
    render(ctx, camera) {
      var active = this._pool.getActiveObjects();
      var offsetX = camera ? camera.offsetX : 0;
      var offsetY = camera ? camera.offsetY : 0;

      for (var i = 0; i < active.length; i++) {
        var projectile = active[i];
        if (!projectile.isActive) continue;

        var screenX = projectile.x - offsetX;
        var screenY = projectile.y - offsetY;

        // Draw glow
        ctx.beginPath();
        ctx.arc(screenX, screenY, projectile.size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = projectile.color;
        ctx.globalAlpha = 0.3;
        ctx.fill();

        // Draw projectile
        ctx.beginPath();
        ctx.arc(screenX, screenY, projectile.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = projectile.color;
        ctx.globalAlpha = 1;
        ctx.fill();
      }
    }

    /**
     * Get all active projectiles
     * @returns {Array<EnemyProjectile>}
     */
    getActiveProjectiles() {
      return this._pool.getActiveObjects().filter(function (p) {
        return p.isActive;
      });
    }

    /**
     * Release all projectiles back to pool
     */
    releaseAll() {
      var active = this._pool.getActiveObjects();
      for (var i = 0; i < active.length; i++) {
        active[i].isActive = false;
      }
      this._pool.releaseAll();
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get activeCount() {
      return this._pool.activeCount;
    }

    get availableCount() {
      return this._pool.availableCount;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'Enemy Projectiles',
        entries: [
          { key: 'Active', value: this._pool.activeCount },
          { key: 'Available', value: this._pool.availableCount },
        ],
      };
    }
  }

  // ============================================
  // Singleton Instance
  // ============================================
  var instance = null;

  /**
   * Get the singleton enemy projectile pool instance
   * @returns {EnemyProjectilePool}
   */
  function getEnemyProjectilePool() {
    if (!instance) {
      instance = new EnemyProjectilePool();
    }
    return instance;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Pool.EnemyProjectile = EnemyProjectile;
  Pool.EnemyProjectilePool = EnemyProjectilePool;
  Pool.enemyProjectilePool = getEnemyProjectilePool();
})(window.VampireSurvivors.Pool);
