/**
 * @fileoverview Base component class for ECS pattern
 * @module ECS/Component
 */
(function(ECS) {
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

    /** Parent entity reference */
    get entity() {
      return this._entity;
    }

    set entity(value) {
      this._entity = value;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------

    /**
     * Get debug entries for this component
     * @returns {Array<{key: string, value: *}>}
     */
    getDebugEntries() {
      return [];
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------

    /**
     * Clean up component resources
     */
    dispose() {
      this._entity = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  ECS.Component = Component;

})(window.RoguelikeFramework.ECS);
