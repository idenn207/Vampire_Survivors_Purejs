/**
 * @fileoverview Camera system - updates camera following
 * @module Systems/CameraSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;

  // ============================================
  // Class Definition
  // ============================================
  class CameraSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 50; // After MovementSystem (10), before RenderSystem (100)
    _camera = null;

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

    update(deltaTime) {
      if (!this._camera) return;

      this._camera.update(deltaTime);
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get camera() {
      return this._camera;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._camera = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.CameraSystem = CameraSystem;
})(window.VampireSurvivors.Systems);
