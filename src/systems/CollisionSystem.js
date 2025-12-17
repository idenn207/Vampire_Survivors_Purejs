/**
 * @fileoverview Collision system - detects collisions between entities
 * @module Systems/CollisionSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Collider = window.VampireSurvivors.Components.Collider;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Class Definition
  // ============================================
  class CollisionSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 20; // After MovementSystem (10), before CameraSystem (50)
    _collisions = [];

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

      // Get all entities with colliders
      var entities = this._entityManager.getWithComponents(Transform, Collider);

      // Clear previous frame collisions
      this._collisions = [];

      // O(n^2) collision check - sufficient for ~50 enemies
      for (var i = 0; i < entities.length; i++) {
        var entityA = entities[i];
        if (!entityA.isActive) continue;

        var colliderA = entityA.getComponent(Collider);

        for (var j = i + 1; j < entities.length; j++) {
          var entityB = entities[j];
          if (!entityB.isActive) continue;

          var colliderB = entityB.getComponent(Collider);

          // Check collision
          if (colliderA.isCollidingWith(colliderB)) {
            var collision = {
              entityA: entityA,
              entityB: entityB,
              colliderA: colliderA,
              colliderB: colliderB,
            };

            this._collisions.push(collision);

            // Emit collision event
            events.emit('collision:detected', collision);
          }
        }
      }
    }

    /**
     * Get all collisions involving a specific entity
     * @param {Entity} entity
     * @returns {Array}
     */
    getCollisionsForEntity(entity) {
      var result = [];
      for (var i = 0; i < this._collisions.length; i++) {
        var collision = this._collisions[i];
        if (collision.entityA === entity || collision.entityB === entity) {
          result.push(collision);
        }
      }
      return result;
    }

    /**
     * Get collisions between entities with specific tags
     * @param {string} tagA
     * @param {string} tagB
     * @returns {Array}
     */
    getCollisionsByTags(tagA, tagB) {
      var result = [];
      for (var i = 0; i < this._collisions.length; i++) {
        var collision = this._collisions[i];
        var hasA = collision.entityA.hasTag(tagA) || collision.entityA.hasTag(tagB);
        var hasB = collision.entityB.hasTag(tagA) || collision.entityB.hasTag(tagB);

        if (hasA && hasB) {
          // Ensure consistent ordering: tagA first
          if (collision.entityA.hasTag(tagA)) {
            result.push(collision);
          } else {
            result.push({
              entityA: collision.entityB,
              entityB: collision.entityA,
              colliderA: collision.colliderB,
              colliderB: collision.colliderA,
            });
          }
        }
      }
      return result;
    }

    /**
     * Get all collisions from the current frame
     * @returns {Array}
     */
    getAllCollisions() {
      return this._collisions.slice();
    }

    /**
     * Get collision count
     * @returns {number}
     */
    getCollisionCount() {
      return this._collisions.length;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var entityCount = 0;
      if (this._entityManager) {
        entityCount = this._entityManager.getWithComponents(Transform, Collider).length;
      }

      return {
        label: 'Collision',
        entries: [
          { key: 'Colliders', value: entityCount },
          { key: 'Collisions', value: this._collisions.length },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._collisions = [];
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.CollisionSystem = CollisionSystem;
})(window.VampireSurvivors.Systems);
