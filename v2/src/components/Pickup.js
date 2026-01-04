/**
 * @fileoverview Pickup component - tracks collectible item data
 * @module Components/Pickup
 */
(function (Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = Components.Component;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_MAGNET_RADIUS = 100;
  var DEFAULT_MAGNET_SPEED = 250;

  // ============================================
  // Class Definition
  // ============================================
  class Pickup extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _type = 'exp';
    _value = 1;
    _magnetRadius = DEFAULT_MAGNET_RADIUS;
    _magnetSpeed = DEFAULT_MAGNET_SPEED;
    _isMagnetized = false;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * @param {string} [type] - Pickup type ('exp', 'gold', 'health')
     * @param {number} [value] - Value to grant on collection
     * @param {number} [magnetRadius] - Distance to start attracting to player
     * @param {number} [magnetSpeed] - Speed when magnetized
     */
    constructor(type, value, magnetRadius, magnetSpeed) {
      super();
      this._type = type || 'exp';
      this._value = value || 1;
      this._magnetRadius = magnetRadius || DEFAULT_MAGNET_RADIUS;
      this._magnetSpeed = magnetSpeed || DEFAULT_MAGNET_SPEED;
      this._isMagnetized = false;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Reset pickup for pool reuse
     * @param {string} type
     * @param {number} value
     * @param {number} magnetRadius
     * @param {number} magnetSpeed
     */
    reset(type, value, magnetRadius, magnetSpeed) {
      this._type = type || 'exp';
      this._value = value || 1;
      this._magnetRadius = magnetRadius || DEFAULT_MAGNET_RADIUS;
      this._magnetSpeed = magnetSpeed || DEFAULT_MAGNET_SPEED;
      this._isMagnetized = false;
    }

    /**
     * Start magnetizing toward player
     */
    startMagnetizing() {
      this._isMagnetized = true;
    }

    /**
     * Stop magnetizing
     */
    stopMagnetizing() {
      this._isMagnetized = false;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get type() {
      return this._type;
    }

    set type(value) {
      this._type = value;
    }

    get value() {
      return this._value;
    }

    set value(val) {
      this._value = Math.max(0, val);
    }

    get magnetRadius() {
      return this._magnetRadius;
    }

    set magnetRadius(value) {
      this._magnetRadius = Math.max(0, value);
    }

    get magnetSpeed() {
      return this._magnetSpeed;
    }

    set magnetSpeed(value) {
      this._magnetSpeed = Math.max(0, value);
    }

    get isMagnetized() {
      return this._isMagnetized;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      return [
        { key: 'Type', value: this._type },
        { key: 'Value', value: this._value },
        { key: 'Magnetized', value: this._isMagnetized ? 'Yes' : 'No' },
        { key: 'MagnetRadius', value: this._magnetRadius },
      ];
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.Pickup = Pickup;
})(window.VampireSurvivors.Components);
