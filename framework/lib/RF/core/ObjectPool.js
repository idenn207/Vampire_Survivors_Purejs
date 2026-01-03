/**
 * @fileoverview Generic object pool for efficient object reuse
 * @module Lib/Core/ObjectPool
 */
(function (Lib) {
  'use strict';

  // ============================================
  // Ensure namespace exists
  // ============================================
  Lib.Core = Lib.Core || {};

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_INITIAL_SIZE = 50;
  var DEFAULT_MAX_SIZE = 500;

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
     * Create a new object pool
     * @param {Function} createFn - Function that creates a new object
     * @param {Function} [resetFn] - Function that resets an object for reuse
     * @param {number} [initialSize=50] - Initial pool size
     * @param {number} [maxSize=500] - Maximum pool size
     */
    constructor(createFn, resetFn, initialSize, maxSize) {
      this._createFn = createFn;
      this._resetFn = resetFn || null;
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
     * @returns {*} Object from pool or newly created, null if max reached
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
     * Clear the entire pool (destroys all objects)
     */
    clear() {
      this._pool = [];
      this._active.clear();
    }

    /**
     * Execute a callback for each active object
     * @param {Function} callback - function(obj, index)
     */
    forEach(callback) {
      var index = 0;
      this._active.forEach(function (obj) {
        callback(obj, index++);
      });
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

    /** Number of active (in-use) objects */
    get activeCount() {
      return this._active.size;
    }

    /** Number of available (pooled) objects */
    get availableCount() {
      return this._pool.length;
    }

    /** Total number of objects (active + available) */
    get totalCount() {
      return this._active.size + this._pool.length;
    }

    /** Maximum pool size */
    get maxSize() {
      return this._maxSize;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'ObjectPool',
        entries: [
          { key: 'Active', value: this._active.size },
          { key: 'Available', value: this._pool.length },
          { key: 'Max', value: this._maxSize },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._pool = [];
      this._active.clear();
      this._createFn = null;
      this._resetFn = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Lib.Core.ObjectPool = ObjectPool;

})(window.RoguelikeFramework.Lib = window.RoguelikeFramework.Lib || {});
