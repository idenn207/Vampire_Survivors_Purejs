/**
 * @fileoverview Camera system for following entities and viewport management
 * @module Core/Camera
 */
(function (Core) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Transform = window.VampireSurvivors.Components.Transform;
  var Vector2 = window.VampireSurvivors.Utils.Vector2;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_SMOOTHING = 5;

  // ============================================
  // Class Definition
  // ============================================
  class Camera {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _position = null;
    _target = null;
    _viewportWidth = 800;
    _viewportHeight = 600;
    _smoothing = DEFAULT_SMOOTHING;
    _isFollowing = true;

    // World bounds (optional)
    _worldBounds = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor(viewportWidth, viewportHeight) {
      this._position = new Vector2();
      this._viewportWidth = viewportWidth || 800;
      this._viewportHeight = viewportHeight || 600;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    follow(entity) {
      this._target = entity;
      this._isFollowing = true;
    }

    stopFollowing() {
      this._target = null;
      this._isFollowing = false;
    }

    update(deltaTime) {
      if (!this._target || !this._isFollowing) return;

      var transform = this._target.getComponent(Transform);
      if (!transform) return;

      // Calculate target camera position (center on entity)
      var targetX = transform.centerX - this._viewportWidth / 2;
      var targetY = transform.centerY - this._viewportHeight / 2;

      // Smooth follow using lerp
      var t = 1 - Math.pow(0.5, deltaTime * this._smoothing);
      this._position.x += (targetX - this._position.x) * t;
      this._position.y += (targetY - this._position.y) * t;

      // Clamp to world bounds if set
      if (this._worldBounds) {
        this._position.x = Math.max(this._worldBounds.minX, Math.min(this._worldBounds.maxX - this._viewportWidth, this._position.x));
        this._position.y = Math.max(this._worldBounds.minY, Math.min(this._worldBounds.maxY - this._viewportHeight, this._position.y));
      }
    }

    setWorldBounds(minX, minY, maxX, maxY) {
      this._worldBounds = {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY,
      };
    }

    clearWorldBounds() {
      this._worldBounds = null;
    }

    worldToScreen(worldX, worldY) {
      return new Vector2(worldX - this._position.x, worldY - this._position.y);
    }

    screenToWorld(screenX, screenY) {
      return new Vector2(screenX + this._position.x, screenY + this._position.y);
    }

    isInView(x, y, width, height) {
      width = width || 0;
      height = height || 0;

      return (
        x + width > this._position.x &&
        x < this._position.x + this._viewportWidth &&
        y + height > this._position.y &&
        y < this._position.y + this._viewportHeight
      );
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

    get target() {
      return this._target;
    }

    get viewportWidth() {
      return this._viewportWidth;
    }

    set viewportWidth(value) {
      this._viewportWidth = value;
    }

    get viewportHeight() {
      return this._viewportHeight;
    }

    set viewportHeight(value) {
      this._viewportHeight = value;
    }

    get smoothing() {
      return this._smoothing;
    }

    set smoothing(value) {
      this._smoothing = Math.max(0, value);
    }

    get isFollowing() {
      return this._isFollowing;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getSummaryInfo() {
      return [{ key: 'Camera', value: Math.round(this._position.x) + ', ' + Math.round(this._position.y) }];
    }

    getDebugInfo() {
      var targetName = 'None';
      if (this._target) {
        if (this._target.hasTag('player')) {
          targetName = 'Player';
        } else {
          targetName = 'Entity #' + this._target.id;
        }
      }

      return {
        label: 'Camera',
        entries: [
          { key: 'Position', value: Math.round(this._position.x) + ', ' + Math.round(this._position.y) },
          { key: 'Target', value: targetName },
          { key: 'Viewport', value: this._viewportWidth + 'x' + this._viewportHeight },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._target = null;
      this._position = null;
      this._worldBounds = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Core.Camera = Camera;
})(window.VampireSurvivors.Core);
