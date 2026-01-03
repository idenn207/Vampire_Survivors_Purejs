/**
 * @fileoverview Cached component query system for performance
 * @module ECS/QueryManager
 */
(function(ECS) {
  'use strict';

  // ============================================
  // Query Class
  // ============================================

  /**
   * A cached query for entities with specific components
   */
  class Query {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _entityManager = null;
    _componentClasses = [];
    _results = [];
    _isDirty = true;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor(entityManager, componentClasses) {
      this._entityManager = entityManager;
      this._componentClasses = componentClasses;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------

    /**
     * Get cached query results
     * @returns {Entity[]}
     */
    get results() {
      if (this._isDirty) {
        this.refresh();
      }
      return this._results;
    }

    /**
     * Force refresh the query results
     */
    refresh() {
      this._results = this._entityManager.getWithComponents.apply(
        this._entityManager,
        this._componentClasses
      );
      this._isDirty = false;
    }

    /**
     * Mark the query as dirty (needs refresh)
     */
    invalidate() {
      this._isDirty = true;
    }

    /**
     * Iterate over results
     * @param {Function} callback - function(entity, index)
     */
    forEach(callback) {
      var results = this.results;
      for (var i = 0; i < results.length; i++) {
        callback(results[i], i);
      }
    }

    /**
     * Map over results
     * @param {Function} callback - function(entity, index) => value
     * @returns {Array}
     */
    map(callback) {
      var results = this.results;
      var mapped = [];
      for (var i = 0; i < results.length; i++) {
        mapped.push(callback(results[i], i));
      }
      return mapped;
    }

    /**
     * Filter results
     * @param {Function} callback - function(entity, index) => boolean
     * @returns {Entity[]}
     */
    filter(callback) {
      var results = this.results;
      var filtered = [];
      for (var i = 0; i < results.length; i++) {
        if (callback(results[i], i)) {
          filtered.push(results[i]);
        }
      }
      return filtered;
    }

    /**
     * Find first matching entity
     * @param {Function} callback - function(entity, index) => boolean
     * @returns {Entity|null}
     */
    find(callback) {
      var results = this.results;
      for (var i = 0; i < results.length; i++) {
        if (callback(results[i], i)) {
          return results[i];
        }
      }
      return null;
    }

    /**
     * Get result count
     * @returns {number}
     */
    get count() {
      return this.results.length;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._entityManager = null;
      this._componentClasses = [];
      this._results = [];
    }
  }

  // ============================================
  // QueryManager Class
  // ============================================

  /**
   * Manages cached component queries for performance
   */
  class QueryManager {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _entityManager = null;
    _queries = [];
    _unsubscribe = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor(entityManager) {
      this._entityManager = entityManager;
      this._queries = [];

      // Auto-invalidate queries when entities change
      var events = window.RoguelikeFramework.Core.events;
      var self = this;

      var invalidateAll = function() {
        self.invalidate();
      };

      events.on('entity:created', invalidateAll);
      events.on('entity:added', invalidateAll);
      events.on('entity:destroyed', invalidateAll);
      events.on('entity:removed', invalidateAll);

      this._unsubscribe = function() {
        events.off('entity:created', invalidateAll);
        events.off('entity:added', invalidateAll);
        events.off('entity:destroyed', invalidateAll);
        events.off('entity:removed', invalidateAll);
      };
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------

    /**
     * Create a cached query for entities with specific components
     * @param {...Function} ComponentClasses - Component classes to query for
     * @returns {Query}
     */
    createQuery() {
      var componentClasses = Array.prototype.slice.call(arguments);
      var query = new Query(this._entityManager, componentClasses);
      this._queries.push(query);
      return query;
    }

    /**
     * Invalidate all cached queries
     */
    invalidate() {
      for (var i = 0; i < this._queries.length; i++) {
        this._queries[i].invalidate();
      }
    }

    /**
     * Remove a query
     * @param {Query} query
     */
    removeQuery(query) {
      var index = this._queries.indexOf(query);
      if (index !== -1) {
        this._queries.splice(index, 1);
        query.dispose();
      }
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'QueryManager',
        entries: [
          { key: 'Queries', value: this._queries.length },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      if (this._unsubscribe) {
        this._unsubscribe();
        this._unsubscribe = null;
      }

      for (var i = 0; i < this._queries.length; i++) {
        this._queries[i].dispose();
      }
      this._queries = [];
      this._entityManager = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  ECS.Query = Query;
  ECS.QueryManager = QueryManager;

})(window.RoguelikeFramework.ECS);
