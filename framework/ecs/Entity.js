/**
 * @fileoverview Base entity class for ECS pattern
 * @module ECS/Entity
 */
(function(ECS) {
  'use strict';

  // ============================================
  // Static Variables
  // ============================================
  var _nextId = 0;

  // ============================================
  // Class Definition
  // ============================================
  class Entity {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _id = null;
    _components = new Map();
    _isActive = true;
    _tags = new Set();

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._id = _nextId++;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------

    /**
     * Add a component to this entity
     * @param {Component} component
     * @returns {Entity} this (for chaining)
     */
    addComponent(component) {
      var ComponentClass = component.constructor;
      this._components.set(ComponentClass, component);
      component.entity = this;
      return this;
    }

    /**
     * Get a component by class
     * @param {Function} ComponentClass
     * @returns {Component|null}
     */
    getComponent(ComponentClass) {
      return this._components.get(ComponentClass) || null;
    }

    /**
     * Check if entity has a component
     * @param {Function} ComponentClass
     * @returns {boolean}
     */
    hasComponent(ComponentClass) {
      return this._components.has(ComponentClass);
    }

    /**
     * Remove a component by class
     * @param {Function} ComponentClass
     * @returns {Entity} this (for chaining)
     */
    removeComponent(ComponentClass) {
      var component = this._components.get(ComponentClass);
      if (component) {
        component.entity = null;
        component.dispose();
        this._components.delete(ComponentClass);
      }
      return this;
    }

    /**
     * Check if entity has a tag
     * @param {string} tag
     * @returns {boolean}
     */
    hasTag(tag) {
      return this._tags.has(tag);
    }

    /**
     * Add a tag to this entity
     * @param {string} tag
     * @returns {Entity} this (for chaining)
     */
    addTag(tag) {
      this._tags.add(tag);
      return this;
    }

    /**
     * Remove a tag from this entity
     * @param {string} tag
     * @returns {Entity} this (for chaining)
     */
    removeTag(tag) {
      this._tags.delete(tag);
      return this;
    }

    /**
     * Get all tags as an array
     * @returns {string[]}
     */
    getTags() {
      return Array.from(this._tags);
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var entries = [
        { key: 'ID', value: this._id },
        { key: 'Active', value: this._isActive },
        { key: 'Tags', value: this.getTags().join(', ') || 'none' },
      ];

      // Collect debug entries from all components
      this._components.forEach(function(component) {
        if (typeof component.getDebugEntries === 'function') {
          var componentEntries = component.getDebugEntries();
          entries = entries.concat(componentEntries);
        }
      });

      return {
        label: 'Entity #' + this._id,
        entries: entries,
      };
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------

    /** Unique entity ID */
    get id() {
      return this._id;
    }

    /** Whether entity is active */
    get isActive() {
      return this._isActive;
    }

    set isActive(value) {
      this._isActive = value;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------

    /**
     * Clean up entity and all components
     */
    dispose() {
      this._components.forEach(function(component) {
        component.entity = null;
        component.dispose();
      });
      this._components.clear();
      this._tags.clear();
      this._isActive = false;
    }
  }

  // ============================================
  // Static Methods
  // ============================================

  /**
   * Reset the entity ID counter (useful for level resets)
   */
  Entity.resetIdCounter = function() {
    _nextId = 0;
  };

  /**
   * Get the current ID counter value
   * @returns {number}
   */
  Entity.getCurrentIdCounter = function() {
    return _nextId;
  };

  // ============================================
  // Export to Namespace
  // ============================================
  ECS.Entity = Entity;

})(window.RoguelikeFramework.ECS);
