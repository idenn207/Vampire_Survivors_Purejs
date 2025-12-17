/**
 * @fileoverview Area effect pool - singleton pool for area damage zones
 * @module Pool/AreaEffectPool
 */
(function (Pool) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var ObjectPool = Pool.ObjectPool;
  var AreaEffect = window.VampireSurvivors.Entities.AreaEffect;

  // ============================================
  // Constants
  // ============================================
  var INITIAL_SIZE = 20;
  var MAX_SIZE = 50;

  // ============================================
  // Class Definition
  // ============================================
  class AreaEffectPool {
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
          return self._createAreaEffect();
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
     * Initialize pool with entity manager
     * @param {EntityManager} entityManager
     */
    initialize(entityManager) {
      this._entityManager = entityManager;
    }

    /**
     * Spawn an area effect from the pool
     * @param {number} x - Center X position
     * @param {number} y - Center Y position
     * @param {number} radius - Effect radius
     * @param {string} color - Effect color
     * @param {number} damage - Damage per tick
     * @param {number} duration - Total duration
     * @param {number} tickRate - Damage ticks per second
     * @param {string} [sourceWeaponId] - ID of weapon that created this
     * @returns {AreaEffect|null}
     */
    spawn(x, y, radius, color, damage, duration, tickRate, sourceWeaponId) {
      var areaEffect = this._pool.get();
      if (!areaEffect) {
        console.warn('[AreaEffectPool] Pool exhausted');
        return null;
      }

      areaEffect.reset(x, y, radius, color, damage, duration, tickRate, sourceWeaponId);

      if (this._entityManager) {
        this._entityManager.add(areaEffect);
      }

      return areaEffect;
    }

    /**
     * Return an area effect to the pool
     * @param {AreaEffect} areaEffect
     */
    despawn(areaEffect) {
      if (!areaEffect) return;

      areaEffect.isActive = false;

      // Remove from entity manager (use remove, not destroy, to preserve components)
      if (this._entityManager) {
        this._entityManager.remove(areaEffect);
      }

      this._pool.release(areaEffect);
    }

    /**
     * Get all active area effects
     * @returns {Array<AreaEffect>}
     */
    getActiveEffects() {
      return this._pool.getActiveObjects();
    }

    /**
     * Release all area effects back to pool
     */
    releaseAll() {
      var self = this;
      var active = this._pool.getActiveObjects();

      active.forEach(function (effect) {
        effect.isActive = false;
        if (self._entityManager) {
          self._entityManager.remove(effect);
        }
      });

      this._pool.releaseAll();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _createAreaEffect() {
      return new AreaEffect();
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
        label: 'AreaEffect Pool',
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

  function getAreaEffectPool() {
    if (!instance) {
      instance = new AreaEffectPool();
    }
    return instance;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Pool.AreaEffectPool = AreaEffectPool;
  Pool.areaEffectPool = getAreaEffectPool();
})(window.VampireSurvivors.Pool);
