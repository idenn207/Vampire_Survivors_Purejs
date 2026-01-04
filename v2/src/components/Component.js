/**
 * @fileoverview Base component class for ECS pattern
 * @module Components/Component
 */
(function (Components) {
  'use strict';

  // ============================================
  // Class Definition
  // ============================================
  class Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _entity = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get entity() {
      return this._entity;
    }

    set entity(value) {
      this._entity = value;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      return [];
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._entity = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.Component = Component;
})(window.VampireSurvivors.Components);
