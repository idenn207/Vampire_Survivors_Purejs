/**
 * @fileoverview Summon pool - singleton pool for efficient summon reuse
 * @module Pool/SummonPool
 */
(function (Pool) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var ObjectPool = Pool.ObjectPool;
  var Summon = window.VampireSurvivors.Entities.Summon;

  // ============================================
  // Constants
  // ============================================
  var INITIAL_SIZE = 10;
  var MAX_SIZE = 50;

  // ============================================
  // Class Definition
  // ============================================
  class SummonPool {
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
          return self._createSummon();
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
     * Spawn a summon from the pool
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} damage - Attack damage
     * @param {number} health - Summon health
     * @param {number} attackCooldown - Time between attacks
     * @param {number} attackRange - Attack range
     * @param {number} chaseSpeed - Movement speed
     * @param {number} duration - How long the summon lasts
     * @param {string} color - Summon color
     * @param {string} sourceWeaponId - ID of weapon that summoned this
     * @param {Entity} owner - The player who owns this summon
     * @param {string} [imageId] - Optional image ID for sprite
     * @param {number} [size] - Optional custom size
     * @param {number} [attackWindup] - Optional attack wind-up delay
     * @returns {Summon|null}
     */
    spawn(x, y, damage, health, attackCooldown, attackRange, chaseSpeed, duration, color, sourceWeaponId, owner, imageId, size, attackWindup) {
      var summon = this._pool.get();
      if (!summon) {
        console.warn('[SummonPool] Pool exhausted');
        return null;
      }

      // Reset summon with new values
      summon.reset(x, y, damage, health, attackCooldown, attackRange, chaseSpeed, duration, color, sourceWeaponId, owner, imageId, size, attackWindup);

      // Add to entity manager if available
      if (this._entityManager) {
        this._entityManager.add(summon);
      }

      return summon;
    }

    /**
     * Return a summon to the pool
     * @param {Summon} summon
     */
    despawn(summon) {
      if (!summon) return;

      // Mark as inactive
      summon.isActive = false;

      // Remove from entity manager
      if (this._entityManager) {
        this._entityManager.remove(summon);
      }

      // Return to pool
      this._pool.release(summon);
    }

    /**
     * Get all active summons
     * @returns {Array<Summon>}
     */
    getActiveSummons() {
      return this._pool.getActiveObjects();
    }

    /**
     * Release all summons back to pool
     */
    releaseAll() {
      var self = this;
      var active = this._pool.getActiveObjects();

      active.forEach(function (summon) {
        summon.isActive = false;
        if (self._entityManager) {
          self._entityManager.remove(summon);
        }
      });

      this._pool.releaseAll();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _createSummon() {
      return new Summon();
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
        label: 'Summon Pool',
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
   * Get the singleton summon pool instance
   * @returns {SummonPool}
   */
  function getSummonPool() {
    if (!instance) {
      instance = new SummonPool();
    }
    return instance;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Pool.SummonPool = SummonPool;
  Pool.summonPool = getSummonPool();
})(window.VampireSurvivors.Pool);
