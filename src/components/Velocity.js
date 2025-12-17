/**
 * @fileoverview Velocity component for movement processing
 * @module Components/Velocity
 */
(function (Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = Components.Component;
  var Vector2 = window.VampireSurvivors.Utils.Vector2;

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
    set(vx, vy) {
      this._velocity.set(vx, vy);
      return this;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get vx() {
      return this._velocity.x;
    }

    set vx(value) {
      this._velocity.x = value;
    }

    get vy() {
      return this._velocity.y;
    }

    set vy(value) {
      this._velocity.y = value;
    }

    get velocity() {
      return this._velocity;
    }

    set velocity(value) {
      this._velocity.copy(value);
    }

    get maxSpeed() {
      return this._maxSpeed;
    }

    set maxSpeed(value) {
      this._maxSpeed = Math.max(0, value);
    }

    get speed() {
      return this._velocity.length();
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
})(window.VampireSurvivors.Components);
