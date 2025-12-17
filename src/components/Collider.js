/**
 * @fileoverview Collider component - circle-based collision with layer system
 * @module Components/Collider
 */
(function (Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = Components.Component;
  var Transform = Components.Transform;

  // ============================================
  // Collision Layer Constants
  // ============================================
  var CollisionLayer = {
    NONE: 0,
    PLAYER: 1 << 0, // 1
    ENEMY: 1 << 1, // 2
    TERRAIN: 1 << 2, // 4
    HITBOX: 1 << 3, // 8
    PICKUP: 1 << 4, // 16
    ALL: 0xff,
  };

  // ============================================
  // Class Definition
  // ============================================
  class Collider extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _radius = 16;
    _isTrigger = false;
    _layer = CollisionLayer.NONE;
    _mask = CollisionLayer.NONE;
    _offsetX = 0;
    _offsetY = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor(radius, layer, mask) {
      super();
      this._radius = radius || 16;
      this._layer = layer !== undefined ? layer : CollisionLayer.NONE;
      this._mask = mask !== undefined ? mask : CollisionLayer.NONE;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Check if this collider can collide with another based on layers
     * @param {Collider} other
     * @returns {boolean}
     */
    canCollideWith(other) {
      // Check if my mask includes their layer AND their mask includes my layer
      return (this._mask & other._layer) !== 0 && (other._mask & this._layer) !== 0;
    }

    /**
     * Check if this collider is colliding with another (circle collision)
     * @param {Collider} other
     * @returns {boolean}
     */
    isCollidingWith(other) {
      if (!this._entity || !other._entity) return false;
      if (!this.canCollideWith(other)) return false;

      var distance = this.getDistance(other);
      return distance < this._radius + other._radius;
    }

    /**
     * Get distance between this collider's center and another's
     * @param {Collider} other
     * @returns {number}
     */
    getDistance(other) {
      if (!this._entity || !other._entity) return Infinity;

      var transform = this._entity.getComponent(Transform);
      var otherTransform = other._entity.getComponent(Transform);

      if (!transform || !otherTransform) return Infinity;

      var cx = transform.centerX + this._offsetX;
      var cy = transform.centerY + this._offsetY;
      var ocx = otherTransform.centerX + other._offsetX;
      var ocy = otherTransform.centerY + other._offsetY;

      var dx = cx - ocx;
      var dy = cy - ocy;
      return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Get the world position of the collider center
     * @returns {{x: number, y: number}}
     */
    getCenter() {
      if (!this._entity) return { x: 0, y: 0 };

      var transform = this._entity.getComponent(Transform);
      if (!transform) return { x: 0, y: 0 };

      return {
        x: transform.centerX + this._offsetX,
        y: transform.centerY + this._offsetY,
      };
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get radius() {
      return this._radius;
    }
    set radius(value) {
      this._radius = Math.max(0, value);
    }

    get isTrigger() {
      return this._isTrigger;
    }
    set isTrigger(value) {
      this._isTrigger = value;
    }

    get layer() {
      return this._layer;
    }
    set layer(value) {
      this._layer = value;
    }

    get mask() {
      return this._mask;
    }
    set mask(value) {
      this._mask = value;
    }

    get offsetX() {
      return this._offsetX;
    }
    set offsetX(value) {
      this._offsetX = value;
    }

    get offsetY() {
      return this._offsetY;
    }
    set offsetY(value) {
      this._offsetY = value;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      return [{ key: 'Radius', value: this._radius }];
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.Collider = Collider;
  Components.CollisionLayer = CollisionLayer;
})(window.VampireSurvivors.Components);
