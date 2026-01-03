/**
 * @fileoverview Transform component for position, size, and rotation
 * @module Components/Transform
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
  class Transform extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _position = null;
    _width = 32;
    _height = 32;
    _rotation = 0;
    _scale = 1;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor(x, y, width, height) {
      super();
      this._position = new Vector2(x || 0, y || 0);
      this._width = width || 32;
      this._height = height || 32;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------

    /** X position */
    get x() {
      return this._position.x;
    }

    set x(value) {
      this._position.x = value;
    }

    /** Y position */
    get y() {
      return this._position.y;
    }

    set y(value) {
      this._position.y = value;
    }

    /** Position as Vector2 */
    get position() {
      return this._position;
    }

    set position(value) {
      this._position.copy(value);
    }

    /** Width */
    get width() {
      return this._width;
    }

    set width(value) {
      this._width = value;
    }

    /** Height */
    get height() {
      return this._height;
    }

    set height(value) {
      this._height = value;
    }

    /** Rotation in radians */
    get rotation() {
      return this._rotation;
    }

    set rotation(value) {
      this._rotation = value;
    }

    /** Scale multiplier */
    get scale() {
      return this._scale;
    }

    set scale(value) {
      this._scale = value;
    }

    /** Center X coordinate */
    get centerX() {
      return this._position.x + this._width / 2;
    }

    /** Center Y coordinate */
    get centerY() {
      return this._position.y + this._height / 2;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      return [
        { key: 'Position', value: Math.round(this.x) + ', ' + Math.round(this.y) },
        { key: 'Size', value: this._width + 'x' + this._height },
      ];
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      super.dispose();
      this._position = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.Transform = Transform;

})(window.RoguelikeFramework.Components);
