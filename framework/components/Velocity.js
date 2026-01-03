/**
 * @fileoverview Velocity component for movement processing
 * @module Components/Velocity
 */
(function(Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = window.RoguelikeFramework.ECS.Component;
  var Vector2 = window.RoguelikeFramework.Utils.Vector2;

  // ============================================
  // Class Definition
  // ============================================
  class Velocity extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _velocity = null;
    _maxSpeed = 0; // 0 = unlimited

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor(vx, vy, maxSpeed) {
      super();
      this._velocity = new Vector2(vx || 0, vy || 0);
      this._maxSpeed = maxSpeed || 0;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------

    /**
     * Set velocity
     * @param {number} vx
     * @param {number} vy
     * @returns {Velocity} this (for chaining)
     */
    set(vx, vy) {
      this._velocity.set(vx, vy);
      return this;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------

    /** X velocity */
    get vx() {
      return this._velocity.x;
    }

    set vx(value) {
      this._velocity.x = value;
    }

    /** Y velocity */
    get vy() {
      return this._velocity.y;
    }

    set vy(value) {
      this._velocity.y = value;
    }

    /** Velocity as Vector2 */
    get velocity() {
      return this._velocity;
    }

    set velocity(value) {
      this._velocity.copy(value);
    }

    /** Maximum speed (0 = unlimited) */
    get maxSpeed() {
      return this._maxSpeed;
    }

    set maxSpeed(value) {
      this._maxSpeed = Math.max(0, value);
    }

    /** Current speed (magnitude) */
    get speed() {
      return this._velocity.length();
    }

    /** Direction in radians */
    get direction() {
      return this._velocity.angle();
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      return [
        { key: 'Velocity', value: Math.round(this._velocity.x) + ', ' + Math.round(this._velocity.y) },
      ];
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      super.dispose();
      this._velocity = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.Velocity = Velocity;

})(window.RoguelikeFramework.Components);
