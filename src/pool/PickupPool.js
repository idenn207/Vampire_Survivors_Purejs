/**
 * @fileoverview Pickup pool - singleton pool for efficient pickup reuse
 * @module Pool/PickupPool
 */
(function (Pool) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var ObjectPool = Pool.ObjectPool;
  var Pickup = window.VampireSurvivors.Entities.Pickup;

  // ============================================
  // Constants
  // ============================================
  var INITIAL_SIZE = 100;
  var MAX_SIZE = 2000;

  // ============================================
  // Class Definition
  // ============================================
  class PickupPool {
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
          return self._createPickup();
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
     * Spawn a pickup from the pool
     * @param {string} type - Pickup type ('exp', 'gold', 'health')
     * @param {number} value - Value to grant
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {Pickup|null}
     */
    spawn(type, value, x, y) {
      var pickup = this._pool.get();
      if (!pickup) {
        console.warn('[PickupPool] Pool exhausted');
        return null;
      }

      // Reset pickup with new values
      pickup.reset(type, value, x, y);

      // Add to entity manager if available
      if (this._entityManager) {
        this._entityManager.add(pickup);
      }

      return pickup;
    }

    /**
     * Return a pickup to the pool
     * @param {Pickup} pickup
     */
    despawn(pickup) {
      if (!pickup) return;

      // Mark as inactive
      pickup.isActive = false;

      // Remove from entity manager (use remove, not destroy, to preserve components)
      if (this._entityManager) {
        this._entityManager.remove(pickup);
      }

      // Return to pool
      this._pool.release(pickup);
    }

    /**
     * Get all active pickups
     * @returns {Array<Pickup>}
     */
    getActivePickups() {
      return this._pool.getActiveObjects();
    }

    /**
     * Release all pickups back to pool
     */
    releaseAll() {
      var self = this;
      var active = this._pool.getActiveObjects();

      active.forEach(function (pickup) {
        pickup.isActive = false;
        if (self._entityManager) {
          self._entityManager.remove(pickup);
        }
      });

      this._pool.releaseAll();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _createPickup() {
      return new Pickup();
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
        label: 'Pickup Pool',
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
   * Get the singleton pickup pool instance
   * @returns {PickupPool}
   */
  function getPickupPool() {
    if (!instance) {
      instance = new PickupPool();
    }
    return instance;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Pool.PickupPool = PickupPool;
  Pool.pickupPool = getPickupPool();
})(window.VampireSurvivors.Pool);
