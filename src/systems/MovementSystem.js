/**
 * @fileoverview Movement system - applies velocity to position
 * @module Systems/MovementSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Velocity = window.VampireSurvivors.Components.Velocity;

  // ============================================
  // Class Definition
  // ============================================
  class MovementSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 10; // Process before rendering

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    update(deltaTime) {
      if (!this._entityManager) return;

      var entities = this._entityManager.getWithComponents(Transform, Velocity);

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (!entity.isActive) continue;

        var transform = entity.getComponent(Transform);
        var velocity = entity.getComponent(Velocity);

        // Apply max speed clamping if set
        if (velocity.maxSpeed > 0) {
          var speed = velocity.speed;
          if (speed > velocity.maxSpeed) {
            var scale = velocity.maxSpeed / speed;
            velocity.vx *= scale;
            velocity.vy *= scale;
          }
        }

        // Apply velocity to position
        transform.x += velocity.vx * deltaTime;
        transform.y += velocity.vy * deltaTime;
      }
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var count = 0;
      if (this._entityManager) {
        count = this._entityManager.getWithComponents(Transform, Velocity).length;
      }

      return {
        label: 'Movement',
        entries: [
          { key: 'Entities', value: count },
          { key: 'Enabled', value: this._isEnabled ? 'Yes' : 'No' },
        ],
      };
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.MovementSystem = MovementSystem;
})(window.VampireSurvivors.Systems);
