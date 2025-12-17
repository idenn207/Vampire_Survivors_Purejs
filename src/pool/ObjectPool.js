/**
 * @fileoverview Generic object pool for efficient object reuse
 * @module Pool/ObjectPool
 */
(function (Pool) {
  'use strict';

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_INITIAL_SIZE = 50;
  var DEFAULT_MAX_SIZE = 200;

  // ============================================
  // Class Definition
  // ============================================
  class ObjectPool {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _createFn = null;
    _resetFn = null;
    _pool = [];
    _active = null;
    _maxSize = DEFAULT_MAX_SIZE;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * @param {Function} createFn - Function that creates a new object
     * @param {Function} resetFn - Function that resets an object for reuse
     * @param {number} [initialSize] - Initial pool size
     * @param {number} [maxSize] - Maximum pool size
     */
    constructor(createFn, resetFn, initialSize, maxSize) {
      this._createFn = createFn;
      this._resetFn = resetFn;
      this._active = new Set();
      this._maxSize = maxSize || DEFAULT_MAX_SIZE;

      var size = initialSize || DEFAULT_INITIAL_SIZE;
      this._preallocate(size);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Get an object from the pool
     * @returns {*} Object from pool or newly created
     */
    get() {
      var obj;

      if (this._pool.length > 0) {
        obj = this._pool.pop();
      } else if (this._active.size < this._maxSize) {
        obj = this._createFn();
      } else {
        console.warn('[ObjectPool] Max pool size reached:', this._maxSize);
        return null;
      }

      this._active.add(obj);
      return obj;
    }

    /**
     * Release an object back to the pool
     * @param {*} obj - Object to release
     */
    release(obj) {
      if (!this._active.has(obj)) {
        return;
      }

      this._active.delete(obj);
      this._pool.push(obj);
    }

    /**
     * Reset an object with new parameters
     * @param {*} obj - Object to reset
     * @param {...*} args - Arguments to pass to reset function
     */
    reset(obj) {
      if (this._resetFn) {
        var args = Array.prototype.slice.call(arguments);
        this._resetFn.apply(null, args);
      }
    }

    /**
     * Get all active objects
     * @returns {Array} Array of active objects
     */
    getActiveObjects() {
      return Array.from(this._active);
    }

    /**
     * Release all active objects back to pool
     */
    releaseAll() {
      var self = this;
      this._active.forEach(function (obj) {
        self._pool.push(obj);
      });
      this._active.clear();
    }

    /**
     * Clear the entire pool
     */
    clear() {
      this._pool = [];
      this._active.clear();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _preallocate(count) {
      for (var i = 0; i < count; i++) {
        this._pool.push(this._createFn());
      }
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get activeCount() {
      return this._active.size;
    }

    get availableCount() {
      return this._pool.length;
    }

    get totalCount() {
      return this._active.size + this._pool.length;
    }

    get maxSize() {
      return this._maxSize;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Pool.ObjectPool = ObjectPool;
})(window.VampireSurvivors.Pool = window.VampireSurvivors.Pool || {});
