/**
 * @fileoverview Sprite component for visual rendering
 * @module Components/Sprite
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
  var ShapeType = Object.freeze({
    RECT: 'rect',
    CIRCLE: 'circle',
  });

  // ============================================
  // Class Definition
  // ============================================
  class Sprite extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _color = '#00FF00';
    _shape = ShapeType.RECT;
    _zIndex = 0;
    _isVisible = true;
    _alpha = 1;

    // For future sprite sheet support
    _image = null;
    _sourceX = 0;
    _sourceY = 0;
    _sourceWidth = 0;
    _sourceHeight = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor(color, shape) {
      super();
      this._color = color || '#00FF00';
      this._shape = shape || ShapeType.RECT;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get color() {
      return this._color;
    }

    set color(value) {
      this._color = value;
    }

    get shape() {
      return this._shape;
    }

    set shape(value) {
      this._shape = value;
    }

    get zIndex() {
      return this._zIndex;
    }

    set zIndex(value) {
      this._zIndex = value;
    }

    get isVisible() {
      return this._isVisible;
    }

    set isVisible(value) {
      this._isVisible = value;
    }

    get alpha() {
      return this._alpha;
    }

    set alpha(value) {
      this._alpha = Math.max(0, Math.min(1, value));
    }

    get image() {
      return this._image;
    }

    set image(value) {
      this._image = value;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      super.dispose();
      this._image = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.Sprite = Sprite;
  Components.ShapeType = ShapeType;
})(window.VampireSurvivors.Components);
