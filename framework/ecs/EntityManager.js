/**
 * @fileoverview Central entity registry and query system
 * @module ECS/EntityManager
 */
(function(ECS) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var events = window.RoguelikeFramework.Core.events;

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

    /**
     * Initialize the entity manager
     * @param {Game} game
     */
    initialize(game) {
      this._game = game;
    }

    /**
     * Create a new entity and register it
     * @param {Function} EntityClass - Entity class constructor
     * @returns {Entity}
     */
    create(EntityClass) {
      var entity = new EntityClass();
      this._entities.set(entity.id, entity);

      // Register tags
      var self = this;
      entity.getTags().forEach(function(tag) {
        self._addEntityToTag(entity, tag);
      });

      events.emitSync('entity:created', { entity: entity });

      return entity;
    }

    /**
     * Add an existing entity to the manager
     * @param {Entity} entity
     * @returns {Entity}
     */
    add(entity) {
      this._entities.set(entity.id, entity);

      var self = this;
      entity.getTags().forEach(function(tag) {
        self._addEntityToTag(entity, tag);
      });

      events.emitSync('entity:added', { entity: entity });

      return entity;
    }

    /**
     * Destroy an entity (remove and dispose)
     * @param {Entity} entity
     */
    destroy(entity) {
      if (!entity || !this._entities.has(entity.id)) return;

      // Remove from tag registry
      var self = this;
      entity.getTags().forEach(function(tag) {
        self._removeEntityFromTag(entity, tag);
      });

      this._entities.delete(entity.id);

      events.emitSync('entity:destroyed', { entity: entity });

      entity.dispose();
    }

    /**
     * Remove entity from manager WITHOUT disposing (for pooled entities)
     * @param {Entity} entity
     */
    remove(entity) {
      if (!entity || !this._entities.has(entity.id)) return;

      // Remove from tag registry
      var self = this;
      entity.getTags().forEach(function(tag) {
        self._removeEntityFromTag(entity, tag);
      });

      this._entities.delete(entity.id);

      events.emitSync('entity:removed', { entity: entity });
    }

    /**
     * Get entity by ID
     * @param {number} id
     * @returns {Entity|null}
     */
    getById(id) {
      return this._entities.get(id) || null;
    }

    /**
     * Get all entities with a specific tag
     * @param {string} tag
     * @returns {Entity[]}
     */
    getByTag(tag) {
      var tagSet = this._entitiesByTag.get(tag);
      if (!tagSet) return [];
      return Array.from(tagSet);
    }

    /**
     * Get all entities
     * @returns {Entity[]}
     */
    getAll() {
      return Array.from(this._entities.values());
    }

    /**
     * Get all active entities with specific components
     * @param {...Function} ComponentClasses - Component classes to filter by
     * @returns {Entity[]}
     */
    getWithComponents() {
      var ComponentClasses = Array.prototype.slice.call(arguments);
      var result = [];

      this._entities.forEach(function(entity) {
        if (!entity.isActive) return;

        var hasAll = ComponentClasses.every(function(ComponentClass) {
          return entity.hasComponent(ComponentClass);
        });

        if (hasAll) {
          result.push(entity);
        }
      });

      return result;
    }

    /**
     * Get total entity count
     * @returns {number}
     */
    getCount() {
      return this._entities.size;
    }

    /**
     * Get entity count for a specific tag
     * @param {string} tag
     * @returns {number}
     */
    getCountByTag(tag) {
      var tagSet = this._entitiesByTag.get(tag);
      return tagSet ? tagSet.size : 0;
    }

    /**
     * Clear all entities
     */
    clear() {
      var self = this;
      this._entities.forEach(function(entity) {
        entity.dispose();
      });
      this._entities.clear();
      this._entitiesByTag.clear();
    }

    /**
     * Register a tag for an entity (call when entity adds tag after creation)
     * @param {Entity} entity
     * @param {string} tag
     */
    registerTag(entity, tag) {
      if (this._entities.has(entity.id)) {
        this._addEntityToTag(entity, tag);
      }
    }

    /**
     * Unregister a tag for an entity (call when entity removes tag)
     * @param {Entity} entity
     * @param {string} tag
     */
    unregisterTag(entity, tag) {
      this._removeEntityFromTag(entity, tag);
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
    getDebugInfo() {
      return {
        label: 'EntityManager',
        entries: [
          { key: 'Total', value: this._entities.size },
          { key: 'Tags', value: this._entitiesByTag.size },
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
  ECS.EntityManager = EntityManager;

})(window.RoguelikeFramework.ECS);
