/**
 * @fileoverview Generic data registry with aggregation support
 * @module Lib/Patterns/Registry
 */
(function (Lib) {
  'use strict';

  // ============================================
  // Ensure namespace exists
  // ============================================
  Lib.Patterns = Lib.Patterns || {};

  // ============================================
  // Class Definition
  // ============================================
  class Registry {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _name = '';
    _data = null;
    _frozen = false;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * Create a new registry
     * @param {string} [name='Registry'] - Registry name (for debugging)
     */
    constructor(name) {
      this._name = name || 'Registry';
      this._data = new Map();
    }

    // ----------------------------------------
    // Registration
    // ----------------------------------------

    /**
     * Register an entry
     * @param {string} id - Unique identifier
     * @param {*} data - Entry data
     * @returns {Registry} this (for chaining)
     */
    register(id, data) {
      if (this._frozen) {
        console.warn('[' + this._name + '] Cannot register to frozen registry:', id);
        return this;
      }

      if (this._data.has(id)) {
        console.warn('[' + this._name + '] Overwriting existing entry:', id);
      }

      this._data.set(id, data);
      return this;
    }

    /**
     * Unregister an entry
     * @param {string} id - Entry identifier
     * @returns {boolean} True if entry was removed
     */
    unregister(id) {
      if (this._frozen) {
        console.warn('[' + this._name + '] Cannot unregister from frozen registry');
        return false;
      }

      return this._data.delete(id);
    }

    // ----------------------------------------
    // Retrieval
    // ----------------------------------------

    /**
     * Get entry by ID
     * @param {string} id - Entry identifier
     * @returns {*} Entry data or undefined
     */
    get(id) {
      return this._data.get(id);
    }

    /**
     * Check if entry exists
     * @param {string} id - Entry identifier
     * @returns {boolean}
     */
    has(id) {
      return this._data.has(id);
    }

    /**
     * Get all entries as array
     * @returns {Array} Array of [id, data] pairs
     */
    getAll() {
      return Array.from(this._data.entries());
    }

    /**
     * Get all entry IDs
     * @returns {Array<string>}
     */
    getIds() {
      return Array.from(this._data.keys());
    }

    /**
     * Get all entry values
     * @returns {Array}
     */
    getValues() {
      return Array.from(this._data.values());
    }

    /**
     * Get entry count
     * @returns {number}
     */
    get count() {
      return this._data.size;
    }

    // ----------------------------------------
    // Querying
    // ----------------------------------------

    /**
     * Filter entries by property value
     * @param {string} key - Property key
     * @param {*} value - Property value to match
     * @returns {Array} Array of matching [id, data] pairs
     */
    getByProperty(key, value) {
      var results = [];

      this._data.forEach(function (data, id) {
        if (data && data[key] === value) {
          results.push([id, data]);
        }
      });

      return results;
    }

    /**
     * Filter entries with a predicate
     * @param {Function} predicate - function(data, id) => boolean
     * @returns {Array} Array of matching [id, data] pairs
     */
    filter(predicate) {
      var results = [];

      this._data.forEach(function (data, id) {
        if (predicate(data, id)) {
          results.push([id, data]);
        }
      });

      return results;
    }

    /**
     * Find first matching entry
     * @param {Function} predicate - function(data, id) => boolean
     * @returns {*} Matching data or undefined
     */
    find(predicate) {
      var entries = this._data.entries();
      var next = entries.next();

      while (!next.done) {
        var id = next.value[0];
        var data = next.value[1];

        if (predicate(data, id)) {
          return data;
        }
        next = entries.next();
      }

      return undefined;
    }

    /**
     * Map over all entries
     * @param {Function} callback - function(data, id) => value
     * @returns {Array}
     */
    map(callback) {
      var results = [];

      this._data.forEach(function (data, id) {
        results.push(callback(data, id));
      });

      return results;
    }

    /**
     * Iterate over all entries
     * @param {Function} callback - function(data, id)
     */
    forEach(callback) {
      this._data.forEach(function (data, id) {
        callback(data, id);
      });
    }

    // ----------------------------------------
    // Aggregation
    // ----------------------------------------

    /**
     * Merge another registry into this one
     * @param {Registry} other - Registry to merge
     * @param {boolean} [overwrite=false] - Overwrite existing entries
     * @returns {Registry} this (for chaining)
     */
    merge(other, overwrite) {
      if (this._frozen) {
        console.warn('[' + this._name + '] Cannot merge into frozen registry');
        return this;
      }

      var self = this;

      other._data.forEach(function (data, id) {
        if (!self._data.has(id) || overwrite) {
          self._data.set(id, data);
        }
      });

      return this;
    }

    /**
     * Create a plain object from registry
     * @returns {Object}
     */
    toObject() {
      var obj = {};

      this._data.forEach(function (data, id) {
        obj[id] = data;
      });

      return obj;
    }

    /**
     * Import from plain object
     * @param {Object} obj - Object to import
     * @returns {Registry} this (for chaining)
     */
    fromObject(obj) {
      if (this._frozen) {
        console.warn('[' + this._name + '] Cannot import to frozen registry');
        return this;
      }

      for (var id in obj) {
        if (obj.hasOwnProperty(id)) {
          this._data.set(id, obj[id]);
        }
      }

      return this;
    }

    // ----------------------------------------
    // Freezing
    // ----------------------------------------

    /**
     * Freeze the registry (make immutable)
     * @returns {Registry} this
     */
    freeze() {
      this._frozen = true;
      return this;
    }

    /**
     * Check if registry is frozen
     * @returns {boolean}
     */
    get isFrozen() {
      return this._frozen;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: this._name,
        entries: [
          { key: 'Count', value: this._data.size },
          { key: 'Frozen', value: this._frozen ? 'Yes' : 'No' },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    clear() {
      if (this._frozen) {
        console.warn('[' + this._name + '] Cannot clear frozen registry');
        return;
      }
      this._data.clear();
    }

    dispose() {
      this._data.clear();
      this._data = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Lib.Patterns.Registry = Registry;

})(window.RoguelikeFramework.Lib = window.RoguelikeFramework.Lib || {});
