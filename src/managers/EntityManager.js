/**
 * @fileoverview Central entity registry and query system
 * @module Managers/EntityManager
 */
(function (Managers) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Class Definition
  // ============================================
  class EntityManager {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _entities = new Map();
    _entitiesByTag = new Map();
    _game = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    initialize(game) {
      this._game = game;
    }

    create(EntityClass) {
      var entity = new EntityClass();
      this._entities.set(entity.id, entity);

      // Register tags
      var self = this;
      entity.getTags().forEach(function (tag) {
        self._addEntityToTag(entity, tag);
      });

      events.emitSync('entity:created', { entity: entity });

      return entity;
    }

    add(entity) {
      this._entities.set(entity.id, entity);

      var self = this;
      entity.getTags().forEach(function (tag) {
        self._addEntityToTag(entity, tag);
      });

      events.emitSync('entity:added', { entity: entity });

      return entity;
    }

    destroy(entity) {
      if (!entity || !this._entities.has(entity.id)) return;

      // Remove from tag registry
      var self = this;
      entity.getTags().forEach(function (tag) {
        self._removeEntityFromTag(entity, tag);
      });

      this._entities.delete(entity.id);

      events.emitSync('entity:destroyed', { entity: entity });

      entity.dispose();
    }

    /**
     * Remove entity from manager WITHOUT disposing it (for pooled entities)
     * @param {Entity} entity
     */
    remove(entity) {
      if (!entity || !this._entities.has(entity.id)) return;

      // Remove from tag registry
      var self = this;
      entity.getTags().forEach(function (tag) {
        self._removeEntityFromTag(entity, tag);
      });

      this._entities.delete(entity.id);

      events.emitSync('entity:removed', { entity: entity });
    }

    getById(id) {
      return this._entities.get(id) || null;
    }

    getByTag(tag) {
      var tagSet = this._entitiesByTag.get(tag);
      if (!tagSet) return [];
      return Array.from(tagSet);
    }

    getAll() {
      return Array.from(this._entities.values());
    }

    getWithComponents() {
      var ComponentClasses = Array.prototype.slice.call(arguments);
      var result = [];

      this._entities.forEach(function (entity) {
        if (!entity.isActive) return;

        var hasAll = ComponentClasses.every(function (ComponentClass) {
          return entity.hasComponent(ComponentClass);
        });

        if (hasAll) {
          result.push(entity);
        }
      });

      return result;
    }

    getCount() {
      return this._entities.size;
    }

    getCountByTag(tag) {
      var tagSet = this._entitiesByTag.get(tag);
      return tagSet ? tagSet.size : 0;
    }

    clear() {
      var self = this;
      this._entities.forEach(function (entity) {
        entity.dispose();
      });
      this._entities.clear();
      this._entitiesByTag.clear();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _addEntityToTag(entity, tag) {
      if (!this._entitiesByTag.has(tag)) {
        this._entitiesByTag.set(tag, new Set());
      }
      this._entitiesByTag.get(tag).add(entity);
    }

    _removeEntityFromTag(entity, tag) {
      var tagSet = this._entitiesByTag.get(tag);
      if (tagSet) {
        tagSet.delete(entity);
        if (tagSet.size === 0) {
          this._entitiesByTag.delete(tag);
        }
      }
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getSummaryInfo() {
      var enemyCount = this.getCountByTag('enemy');
      return [{ key: 'Entities', value: this._entities.size + ' (E:' + enemyCount + ')' }];
    }

    getDebugInfo() {
      return {
        label: 'Entities',
        entries: [
          { key: 'Total', value: this._entities.size },
          { key: 'Players', value: this.getCountByTag('player') },
          { key: 'Enemies', value: this.getCountByTag('enemy') },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this.clear();
      this._game = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Managers.EntityManager = EntityManager;
})(window.VampireSurvivors.Managers);
