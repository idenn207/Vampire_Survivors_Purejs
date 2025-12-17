/**
 * @fileoverview Base entity class for ECS pattern
 * @module Entities/Entity
 */
(function (Entities) {
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
    addComponent(component) {
      var ComponentClass = component.constructor;
      this._components.set(ComponentClass, component);
      component.entity = this;
      return this;
    }

    getComponent(ComponentClass) {
      return this._components.get(ComponentClass) || null;
    }

    hasComponent(ComponentClass) {
      return this._components.has(ComponentClass);
    }

    removeComponent(ComponentClass) {
      var component = this._components.get(ComponentClass);
      if (component) {
        component.entity = null;
        component.dispose();
        this._components.delete(ComponentClass);
      }
      return this;
    }

    hasTag(tag) {
      return this._tags.has(tag);
    }

    addTag(tag) {
      this._tags.add(tag);
      return this;
    }

    removeTag(tag) {
      this._tags.delete(tag);
      return this;
    }

    getTags() {
      return Array.from(this._tags);
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get id() {
      return this._id;
    }

    get isActive() {
      return this._isActive;
    }

    set isActive(value) {
      this._isActive = value;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      var self = this;
      this._components.forEach(function (component) {
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
  Entity.resetIdCounter = function () {
    _nextId = 0;
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Entities.Entity = Entity;
})(window.VampireSurvivors.Entities);
