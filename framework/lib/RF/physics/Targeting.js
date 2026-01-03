/**
 * @fileoverview Entity targeting algorithms
 * @module Lib/Physics/Targeting
 */
(function (Lib) {
  'use strict';

  // ============================================
  // Ensure namespace exists
  // ============================================
  Lib.Physics = Lib.Physics || {};

  // ============================================
  // Targeting Modes
  // ============================================
  var TargetingMode = Object.freeze({
    NEAREST: 'nearest',
    FARTHEST: 'farthest',
    WEAKEST: 'weakest',
    STRONGEST: 'strongest',
    RANDOM: 'random',
    FIRST: 'first',
    LAST: 'last',
  });

  // ============================================
  // Class Definition
  // ============================================
  class Targeting {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _entityManager = null;
    _transformClass = null;
    _healthClass = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * Create targeting helper
     * @param {EntityManager} entityManager - Entity manager reference
     * @param {Function} TransformClass - Transform component class
     * @param {Function} [HealthClass] - Health component class (for weakest/strongest)
     */
    constructor(entityManager, TransformClass, HealthClass) {
      this._entityManager = entityManager;
      this._transformClass = TransformClass;
      this._healthClass = HealthClass || null;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------

    /**
     * Find nearest entity with tag within range
     * @param {number} x - Origin x
     * @param {number} y - Origin y
     * @param {string} tag - Entity tag to search
     * @param {number} [range] - Maximum range (optional)
     * @returns {Entity|null}
     */
    findNearest(x, y, tag, range) {
      var entities = this._entityManager.getByTag(tag);
      var rangeSq = range ? range * range : Infinity;

      var nearest = null;
      var nearestDistSq = Infinity;

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var transform = entity.getComponent(this._transformClass);
        if (!transform) continue;

        var dx = transform.centerX - x;
        var dy = transform.centerY - y;
        var distSq = dx * dx + dy * dy;

        if (distSq <= rangeSq && distSq < nearestDistSq) {
          nearestDistSq = distSq;
          nearest = entity;
        }
      }

      return nearest;
    }

    /**
     * Find farthest entity with tag within range
     * @param {number} x - Origin x
     * @param {number} y - Origin y
     * @param {string} tag - Entity tag to search
     * @param {number} [range] - Maximum range (optional)
     * @returns {Entity|null}
     */
    findFarthest(x, y, tag, range) {
      var entities = this._entityManager.getByTag(tag);
      var rangeSq = range ? range * range : Infinity;

      var farthest = null;
      var farthestDistSq = -1;

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var transform = entity.getComponent(this._transformClass);
        if (!transform) continue;

        var dx = transform.centerX - x;
        var dy = transform.centerY - y;
        var distSq = dx * dx + dy * dy;

        if (distSq <= rangeSq && distSq > farthestDistSq) {
          farthestDistSq = distSq;
          farthest = entity;
        }
      }

      return farthest;
    }

    /**
     * Find weakest entity (lowest health) with tag within range
     * @param {number} x - Origin x
     * @param {number} y - Origin y
     * @param {string} tag - Entity tag to search
     * @param {number} [range] - Maximum range (optional)
     * @returns {Entity|null}
     */
    findWeakest(x, y, tag, range) {
      if (!this._healthClass) {
        console.warn('[Targeting] Health class not set, falling back to nearest');
        return this.findNearest(x, y, tag, range);
      }

      var entities = this._entityManager.getByTag(tag);
      var rangeSq = range ? range * range : Infinity;

      var weakest = null;
      var lowestHealth = Infinity;

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var transform = entity.getComponent(this._transformClass);
        var health = entity.getComponent(this._healthClass);
        if (!transform || !health) continue;

        var dx = transform.centerX - x;
        var dy = transform.centerY - y;
        var distSq = dx * dx + dy * dy;

        if (distSq <= rangeSq && health.current < lowestHealth) {
          lowestHealth = health.current;
          weakest = entity;
        }
      }

      return weakest;
    }

    /**
     * Find strongest entity (highest health) with tag within range
     * @param {number} x - Origin x
     * @param {number} y - Origin y
     * @param {string} tag - Entity tag to search
     * @param {number} [range] - Maximum range (optional)
     * @returns {Entity|null}
     */
    findStrongest(x, y, tag, range) {
      if (!this._healthClass) {
        console.warn('[Targeting] Health class not set, falling back to nearest');
        return this.findNearest(x, y, tag, range);
      }

      var entities = this._entityManager.getByTag(tag);
      var rangeSq = range ? range * range : Infinity;

      var strongest = null;
      var highestHealth = -1;

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var transform = entity.getComponent(this._transformClass);
        var health = entity.getComponent(this._healthClass);
        if (!transform || !health) continue;

        var dx = transform.centerX - x;
        var dy = transform.centerY - y;
        var distSq = dx * dx + dy * dy;

        if (distSq <= rangeSq && health.current > highestHealth) {
          highestHealth = health.current;
          strongest = entity;
        }
      }

      return strongest;
    }

    /**
     * Find random entity with tag within range
     * @param {number} x - Origin x
     * @param {number} y - Origin y
     * @param {string} tag - Entity tag to search
     * @param {number} [range] - Maximum range (optional)
     * @returns {Entity|null}
     */
    findRandom(x, y, tag, range) {
      var inRange = this.findAll(x, y, tag, range);
      if (inRange.length === 0) return null;
      return inRange[Math.floor(Math.random() * inRange.length)];
    }

    /**
     * Find all entities with tag within range
     * @param {number} x - Origin x
     * @param {number} y - Origin y
     * @param {string} tag - Entity tag to search
     * @param {number} [range] - Maximum range (optional)
     * @returns {Array<Entity>}
     */
    findAll(x, y, tag, range) {
      var entities = this._entityManager.getByTag(tag);
      var rangeSq = range ? range * range : Infinity;

      var result = [];

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var transform = entity.getComponent(this._transformClass);
        if (!transform) continue;

        var dx = transform.centerX - x;
        var dy = transform.centerY - y;
        var distSq = dx * dx + dy * dy;

        if (distSq <= rangeSq) {
          result.push(entity);
        }
      }

      return result;
    }

    /**
     * Find entities in a cone (sector)
     * @param {number} x - Origin x
     * @param {number} y - Origin y
     * @param {number} direction - Cone direction in radians
     * @param {number} halfAngle - Cone half-angle in radians
     * @param {number} range - Cone range
     * @param {string} tag - Entity tag to search
     * @returns {Array<Entity>}
     */
    findInCone(x, y, direction, halfAngle, range, tag) {
      var entities = this._entityManager.getByTag(tag);
      var rangeSq = range * range;

      var result = [];

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var transform = entity.getComponent(this._transformClass);
        if (!transform) continue;

        var dx = transform.centerX - x;
        var dy = transform.centerY - y;
        var distSq = dx * dx + dy * dy;

        if (distSq > rangeSq) continue;

        // Check angle
        var angleToEntity = Math.atan2(dy, dx);
        var delta = Math.abs(angleToEntity - direction);

        // Normalize delta
        while (delta > Math.PI) delta -= Math.PI * 2;
        delta = Math.abs(delta);

        if (delta <= halfAngle) {
          result.push(entity);
        }
      }

      return result;
    }

    /**
     * Find N nearest entities
     * @param {number} x - Origin x
     * @param {number} y - Origin y
     * @param {string} tag - Entity tag to search
     * @param {number} count - Maximum number of results
     * @param {number} [range] - Maximum range (optional)
     * @returns {Array<Entity>}
     */
    findNearestN(x, y, tag, count, range) {
      var all = this.findAll(x, y, tag, range);
      var self = this;

      // Sort by distance
      all.sort(function (a, b) {
        var ta = a.getComponent(self._transformClass);
        var tb = b.getComponent(self._transformClass);

        var dxa = ta.centerX - x;
        var dya = ta.centerY - y;
        var dxb = tb.centerX - x;
        var dyb = tb.centerY - y;

        return (dxa * dxa + dya * dya) - (dxb * dxb + dyb * dyb);
      });

      return all.slice(0, count);
    }

    /**
     * Find entity by mode
     * @param {number} x - Origin x
     * @param {number} y - Origin y
     * @param {string} tag - Entity tag to search
     * @param {string} mode - Targeting mode
     * @param {number} [range] - Maximum range (optional)
     * @returns {Entity|null}
     */
    findByMode(x, y, tag, mode, range) {
      switch (mode) {
        case TargetingMode.NEAREST:
          return this.findNearest(x, y, tag, range);
        case TargetingMode.FARTHEST:
          return this.findFarthest(x, y, tag, range);
        case TargetingMode.WEAKEST:
          return this.findWeakest(x, y, tag, range);
        case TargetingMode.STRONGEST:
          return this.findStrongest(x, y, tag, range);
        case TargetingMode.RANDOM:
          return this.findRandom(x, y, tag, range);
        case TargetingMode.FIRST:
          var first = this._entityManager.getByTag(tag);
          return first.length > 0 ? first[0] : null;
        case TargetingMode.LAST:
          var last = this._entityManager.getByTag(tag);
          return last.length > 0 ? last[last.length - 1] : null;
        default:
          return this.findNearest(x, y, tag, range);
      }
    }

    // ----------------------------------------
    // Direction Helpers
    // ----------------------------------------

    /**
     * Get direction to target
     * @param {number} x - Origin x
     * @param {number} y - Origin y
     * @param {Entity} target - Target entity
     * @returns {{ x: number, y: number, angle: number, distance: number }}
     */
    getDirectionTo(x, y, target) {
      var transform = target.getComponent(this._transformClass);
      if (!transform) {
        return { x: 0, y: 0, angle: 0, distance: 0 };
      }

      var dx = transform.centerX - x;
      var dy = transform.centerY - y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) {
        return { x: 0, y: 0, angle: 0, distance: 0 };
      }

      return {
        x: dx / distance,
        y: dy / distance,
        angle: Math.atan2(dy, dx),
        distance: distance,
      };
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------

    set healthClass(value) {
      this._healthClass = value;
    }

    get healthClass() {
      return this._healthClass;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'Targeting',
        entries: [
          { key: 'Transform', value: this._transformClass ? 'Set' : 'Not set' },
          { key: 'Health', value: this._healthClass ? 'Set' : 'Not set' },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._entityManager = null;
      this._transformClass = null;
      this._healthClass = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Lib.Physics.Targeting = Targeting;
  Lib.Physics.TargetingMode = TargetingMode;

})(window.RoguelikeFramework.Lib = window.RoguelikeFramework.Lib || {});
