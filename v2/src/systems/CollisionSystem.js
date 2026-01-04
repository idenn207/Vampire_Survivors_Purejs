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

    // Unity-style: Callback registry for push-based collision handling
    // Map key format: "tagA:tagB" (alphabetically sorted)
    _collisionCallbacks = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._collisionCallbacks = new Map();
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

            // Emit collision event (legacy)
            events.emit('collision:detected', collision);

            // Unity-style: Invoke registered callbacks
            this._invokeCallbacks(collision);
          }
        }
      }
    }

    // ----------------------------------------
    // Unity-style Callback Registration
    // ----------------------------------------
    /**
     * Register a callback for collisions between entities with specific tags
     * @param {string} tagA - First entity tag
     * @param {string} tagB - Second entity tag
     * @param {Function} callback - Function(entityA, entityB, collision)
     */
    registerCollisionCallback(tagA, tagB, callback) {
      var key = this._makeCallbackKey(tagA, tagB);
      if (!this._collisionCallbacks.has(key)) {
        this._collisionCallbacks.set(key, []);
      }
      this._collisionCallbacks.get(key).push({
        tagA: tagA,
        tagB: tagB,
        callback: callback,
      });
    }

    /**
     * Unregister a collision callback
     * @param {string} tagA
     * @param {string} tagB
     * @param {Function} callback
     */
    unregisterCollisionCallback(tagA, tagB, callback) {
      var key = this._makeCallbackKey(tagA, tagB);
      var callbacks = this._collisionCallbacks.get(key);
      if (callbacks) {
        for (var i = callbacks.length - 1; i >= 0; i--) {
          if (callbacks[i].callback === callback) {
            callbacks.splice(i, 1);
          }
        }
        if (callbacks.length === 0) {
          this._collisionCallbacks.delete(key);
        }
      }
    }

    /**
     * Create a consistent key for tag pairs (alphabetically sorted)
     * @param {string} tagA
     * @param {string} tagB
     * @returns {string}
     */
    _makeCallbackKey(tagA, tagB) {
      return tagA < tagB ? tagA + ':' + tagB : tagB + ':' + tagA;
    }

    /**
     * Invoke callbacks for a collision
     * @param {Object} collision
     */
    _invokeCallbacks(collision) {
      var entityA = collision.entityA;
      var entityB = collision.entityB;

      // Check all registered tag pairs
      this._collisionCallbacks.forEach(function (callbacks, key) {
        for (var i = 0; i < callbacks.length; i++) {
          var entry = callbacks[i];
          var tagA = entry.tagA;
          var tagB = entry.tagB;

          // Check if entities match the tag pair (in either order)
          if (entityA.hasTag(tagA) && entityB.hasTag(tagB)) {
            entry.callback(entityA, entityB, collision);
          } else if (entityA.hasTag(tagB) && entityB.hasTag(tagA)) {
            // Swap order to match expected tagA, tagB
            entry.callback(entityB, entityA, {
              entityA: entityB,
              entityB: entityA,
              colliderA: collision.colliderB,
              colliderB: collision.colliderA,
            });
          }
        }
      });
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
      if (this._collisionCallbacks) {
        this._collisionCallbacks.clear();
        this._collisionCallbacks = null;
      }
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.CollisionSystem = CollisionSystem;
})(window.VampireSurvivors.Systems);
