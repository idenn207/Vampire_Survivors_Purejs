/**
 * @fileoverview Projectile pool - singleton pool for efficient projectile reuse
 * @module Pool/ProjectilePool
 */
(function (Pool) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var ObjectPool = Pool.ObjectPool;
  var Projectile = window.VampireSurvivors.Entities.Projectile;

  // ============================================
  // Constants
  // ============================================
  var INITIAL_SIZE = 100;
  var MAX_SIZE = 300;

  // ============================================
  // Class Definition
  // ============================================
  class ProjectilePool {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _pool = null;
    _entityManager = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      var self = this;

      this._pool = new ObjectPool(
        function () {
          return self._createProjectile();
        },
        null, // Reset is handled by entity's reset method
        INITIAL_SIZE,
        MAX_SIZE
      );
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Initialize pool with entity manager
     * @param {EntityManager} entityManager
     */
    initialize(entityManager) {
      this._entityManager = entityManager;
    }

    /**
     * Spawn a projectile from the pool
     * @param {number} x - Starting X position
     * @param {number} y - Starting Y position
     * @param {number} angle - Direction angle in radians
     * @param {number} speed - Movement speed
     * @param {number} damage - Damage dealt
     * @param {number} pierce - Pierce count
     * @param {string} color - Projectile color
     * @param {number} size - Projectile size
     * @param {number} [lifetime] - Time before despawn (default 3.0)
     * @param {string} [sourceWeaponId] - ID of weapon that fired this
     * @param {Object} [ricochet] - Ricochet config { bounces, damageDecay, bounceRange }
     * @returns {Projectile|null}
     */
    spawn(x, y, angle, speed, damage, pierce, color, size, lifetime, sourceWeaponId, ricochet) {
      var projectile = this._pool.get();
      if (!projectile) {
        console.warn('[ProjectilePool] Pool exhausted');
        return null;
      }

      // Calculate velocity from angle and speed
      var vx = Math.cos(angle) * speed;
      var vy = Math.sin(angle) * speed;

      // Reset projectile with new values
      projectile.reset(
        x,
        y,
        vx,
        vy,
        damage,
        pierce,
        color,
        size,
        lifetime || 3.0,
        sourceWeaponId,
        ricochet
      );

      // Add to entity manager if available
      if (this._entityManager) {
        this._entityManager.add(projectile);
      }

      return projectile;
    }

    /**
     * Spawn a projectile with velocity instead of angle
     * @param {number} x
     * @param {number} y
     * @param {number} vx
     * @param {number} vy
     * @param {number} damage
     * @param {number} pierce
     * @param {string} color
     * @param {number} size
     * @param {number} [lifetime]
     * @param {string} [sourceWeaponId]
     * @param {Object} [ricochet]
     * @returns {Projectile|null}
     */
    spawnWithVelocity(x, y, vx, vy, damage, pierce, color, size, lifetime, sourceWeaponId, ricochet) {
      var projectile = this._pool.get();
      if (!projectile) {
        console.warn('[ProjectilePool] Pool exhausted');
        return null;
      }

      projectile.reset(x, y, vx, vy, damage, pierce, color, size, lifetime || 3.0, sourceWeaponId, ricochet);

      if (this._entityManager) {
        this._entityManager.add(projectile);
      }

      return projectile;
    }

    /**
     * Return a projectile to the pool
     * @param {Projectile} projectile
     */
    despawn(projectile) {
      if (!projectile) return;

      // Mark as inactive
      projectile.isActive = false;

      // Remove from entity manager (use remove, not destroy, to preserve components)
      if (this._entityManager) {
        this._entityManager.remove(projectile);
      }

      // Return to pool
      this._pool.release(projectile);
    }

    /**
     * Get all active projectiles
     * @returns {Array<Projectile>}
     */
    getActiveProjectiles() {
      return this._pool.getActiveObjects();
    }

    /**
     * Release all projectiles back to pool
     */
    releaseAll() {
      var self = this;
      var active = this._pool.getActiveObjects();

      active.forEach(function (projectile) {
        projectile.isActive = false;
        if (self._entityManager) {
          self._entityManager.remove(projectile);
        }
      });

      this._pool.releaseAll();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _createProjectile() {
      return new Projectile();
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

    get totalCount() {
      return this._pool.totalCount;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'Projectile Pool',
        entries: [
          { key: 'Active', value: this._pool.activeCount },
          { key: 'Available', value: this._pool.availableCount },
          { key: 'Total', value: this._pool.totalCount },
        ],
      };
    }
  }

  // ============================================
  // Singleton Instance
  // ============================================
  var instance = null;

  /**
   * Get the singleton projectile pool instance
   * @returns {ProjectilePool}
   */
  function getProjectilePool() {
    if (!instance) {
      instance = new ProjectilePool();
    }
    return instance;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Pool.ProjectilePool = ProjectilePool;
  Pool.projectilePool = getProjectilePool();
})(window.VampireSurvivors.Pool);
