/**
 * @fileoverview Transform component for position, size, and rotation
 * @module Components/Transform
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
    get x() {
      return this._position.x;
    }

    set x(value) {
      this._position.x = value;
    }

    get y() {
      return this._position.y;
    }

    set y(value) {
      this._position.y = value;
    }

    get position() {
      return this._position;
    }

    set position(value) {
      this._position.copy(value);
    }

    get width() {
      return this._width;
    }

    set width(value) {
      this._width = value;
    }

    get height() {
      return this._height;
    }

    set height(value) {
      this._height = value;
    }

    get rotation() {
      return this._rotation;
    }

    set rotation(value) {
      this._rotation = value;
    }

    get scale() {
      return this._scale;
    }

    set scale(value) {
      this._scale = value;
    }

    get centerX() {
      return this._position.x + this._width / 2;
    }

    get centerY() {
      return this._position.y + this._height / 2;
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
})(window.VampireSurvivors.Components);
