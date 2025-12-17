/**
 * @fileoverview Background system - renders grid pattern
 * @module Systems/BackgroundSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_GRID_SIZE = 64;
  var DEFAULT_GRID_COLOR = 'rgba(255, 255, 255, 0.1)';
  var DEFAULT_BACKGROUND_COLOR = '#1a1a2e';

  // ============================================
  // Class Definition
  // ============================================
  class BackgroundSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 0; // Render first (before entities)
    _camera = null;
    _gridSize = DEFAULT_GRID_SIZE;
    _gridColor = DEFAULT_GRID_COLOR;
    _backgroundColor = DEFAULT_BACKGROUND_COLOR;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    setCamera(camera) {
      this._camera = camera;
    }

    render(ctx) {
      var game = this._game;
      if (!game) return;

      var width = game.width;
      var height = game.height;

      // Draw background color
      ctx.fillStyle = this._backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Get camera offset
      var cameraX = this._camera ? this._camera.x : 0;
      var cameraY = this._camera ? this._camera.y : 0;

      // Calculate grid offset based on camera position
      var offsetX = -(cameraX % this._gridSize);
      var offsetY = -(cameraY % this._gridSize);

      // Draw grid lines
      ctx.strokeStyle = this._gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();

      // Vertical lines
      for (var x = offsetX; x <= width; x += this._gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      // Horizontal lines
      for (var y = offsetY; y <= height; y += this._gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }

      ctx.stroke();
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get gridSize() {
      return this._gridSize;
    }

    set gridSize(value) {
      this._gridSize = Math.max(8, value);
    }

    get gridColor() {
      return this._gridColor;
    }

    set gridColor(value) {
      this._gridColor = value;
    }

    get backgroundColor() {
      return this._backgroundColor;
    }

    set backgroundColor(value) {
      this._backgroundColor = value;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.BackgroundSystem = BackgroundSystem;
})(window.VampireSurvivors.Systems);
