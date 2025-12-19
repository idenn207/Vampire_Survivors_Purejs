/**
 * @fileoverview Mine pool - singleton pool for efficient mine reuse
 * @module Pool/MinePool
 */
(function (Pool) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var ObjectPool = Pool.ObjectPool;
  var Mine = window.VampireSurvivors.Entities.Mine;

  // ============================================
  // Constants
  // ============================================
  var INITIAL_SIZE = 20;
  var MAX_SIZE = 50;

  // ============================================
  // Class Definition
  // ============================================
  class MinePool {
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
          return self._createMine();
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
     * Spawn a mine from the pool
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} damage - Explosion damage
     * @param {number} explosionRadius - Explosion radius
     * @param {number} triggerRadius - Trigger detection radius
     * @param {number} duration - How long the mine lasts
     * @param {string} color - Mine color
     * @param {string} sourceWeaponId - ID of weapon that deployed this
     * @returns {Mine|null}
     */
    spawn(x, y, damage, explosionRadius, triggerRadius, duration, color, sourceWeaponId) {
      var mine = this._pool.get();
      if (!mine) {
        console.warn('[MinePool] Pool exhausted');
        return null;
      }

      // Reset mine with new values
      mine.reset(x, y, damage, explosionRadius, triggerRadius, duration, color, sourceWeaponId);

      // Add to entity manager if available
      if (this._entityManager) {
        this._entityManager.add(mine);
      }

      return mine;
    }

    /**
     * Return a mine to the pool
     * @param {Mine} mine
     */
    despawn(mine) {
      if (!mine) return;

      // Mark as inactive
      mine.isActive = false;

      // Remove from entity manager
      if (this._entityManager) {
        this._entityManager.remove(mine);
      }

      // Return to pool
      this._pool.release(mine);
    }

    /**
     * Get all active mines
     * @returns {Array<Mine>}
     */
    getActiveMines() {
      return this._pool.getActiveObjects();
    }

    /**
     * Release all mines back to pool
     */
    releaseAll() {
      var self = this;
      var active = this._pool.getActiveObjects();

      active.forEach(function (mine) {
        mine.isActive = false;
        if (self._entityManager) {
          self._entityManager.remove(mine);
        }
      });

      this._pool.releaseAll();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _createMine() {
      return new Mine();
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
        label: 'Mine Pool',
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
   * Get the singleton mine pool instance
   * @returns {MinePool}
   */
  function getMinePool() {
    if (!instance) {
      instance = new MinePool();
    }
    return instance;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Pool.MinePool = MinePool;
  Pool.minePool = getMinePool();
})(window.VampireSurvivors.Pool);
