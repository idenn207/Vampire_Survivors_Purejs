/**
 * @fileoverview Collision detection utilities
 * @module Lib/Math/Collision
 */
(function (Lib) {
  'use strict';

  // ============================================
  // Ensure namespace exists
  // ============================================
  Lib.Math = Lib.Math || {};

  // ============================================
  // Collision Object
  // ============================================
  var Collision = {
    // ----------------------------------------
    // Distance Functions
    // ----------------------------------------

    /**
     * Squared distance between two points (faster, no sqrt)
     * @param {number} x1 - First point x
     * @param {number} y1 - First point y
     * @param {number} x2 - Second point x
     * @param {number} y2 - Second point y
     * @returns {number}
     */
    distanceSquared: function (x1, y1, x2, y2) {
      var dx = x2 - x1;
      var dy = y2 - y1;
      return dx * dx + dy * dy;
    },

    /**
     * Distance between two points
     * @param {number} x1 - First point x
     * @param {number} y1 - First point y
     * @param {number} x2 - Second point x
     * @param {number} y2 - Second point y
     * @returns {number}
     */
    distance: function (x1, y1, x2, y2) {
      return Math.sqrt(Collision.distanceSquared(x1, y1, x2, y2));
    },

    /**
     * Manhattan distance between two points
     * @param {number} x1 - First point x
     * @param {number} y1 - First point y
     * @param {number} x2 - Second point x
     * @param {number} y2 - Second point y
     * @returns {number}
     */
    manhattanDistance: function (x1, y1, x2, y2) {
      return Math.abs(x2 - x1) + Math.abs(y2 - y1);
    },

    // ----------------------------------------
    // Circle Collision
    // ----------------------------------------

    /**
     * Circle vs Circle collision
     * @param {number} x1 - First circle center x
     * @param {number} y1 - First circle center y
     * @param {number} r1 - First circle radius
     * @param {number} x2 - Second circle center x
     * @param {number} y2 - Second circle center y
     * @param {number} r2 - Second circle radius
     * @returns {boolean}
     */
    circleVsCircle: function (x1, y1, r1, x2, y2, r2) {
      var combinedRadius = r1 + r2;
      return Collision.distanceSquared(x1, y1, x2, y2) <= combinedRadius * combinedRadius;
    },

    /**
     * Point inside circle
     * @param {number} px - Point x
     * @param {number} py - Point y
     * @param {number} cx - Circle center x
     * @param {number} cy - Circle center y
     * @param {number} r - Circle radius
     * @returns {boolean}
     */
    pointInCircle: function (px, py, cx, cy, r) {
      return Collision.distanceSquared(px, py, cx, cy) <= r * r;
    },

    // ----------------------------------------
    // AABB Collision
    // ----------------------------------------

    /**
     * AABB vs AABB collision
     * @param {Object} a - First rect { x, y, width, height }
     * @param {Object} b - Second rect { x, y, width, height }
     * @returns {boolean}
     */
    aabbVsAabb: function (a, b) {
      return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      );
    },

    /**
     * Point inside AABB
     * @param {number} px - Point x
     * @param {number} py - Point y
     * @param {Object} rect - Rectangle { x, y, width, height }
     * @returns {boolean}
     */
    pointInAabb: function (px, py, rect) {
      return (
        px >= rect.x &&
        px <= rect.x + rect.width &&
        py >= rect.y &&
        py <= rect.y + rect.height
      );
    },

    /**
     * AABB contains another AABB entirely
     * @param {Object} outer - Outer rect { x, y, width, height }
     * @param {Object} inner - Inner rect { x, y, width, height }
     * @returns {boolean}
     */
    aabbContains: function (outer, inner) {
      return (
        inner.x >= outer.x &&
        inner.y >= outer.y &&
        inner.x + inner.width <= outer.x + outer.width &&
        inner.y + inner.height <= outer.y + outer.height
      );
    },

    // ----------------------------------------
    // Circle vs AABB
    // ----------------------------------------

    /**
     * Circle vs AABB collision
     * @param {number} cx - Circle center x
     * @param {number} cy - Circle center y
     * @param {number} r - Circle radius
     * @param {Object} rect - Rectangle { x, y, width, height }
     * @returns {boolean}
     */
    circleVsAabb: function (cx, cy, r, rect) {
      // Find closest point on rect to circle center
      var closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
      var closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));

      return Collision.distanceSquared(cx, cy, closestX, closestY) <= r * r;
    },

    // ----------------------------------------
    // Line/Ray
    // ----------------------------------------

    /**
     * Line segment intersection
     * @param {number} x1 - First line start x
     * @param {number} y1 - First line start y
     * @param {number} x2 - First line end x
     * @param {number} y2 - First line end y
     * @param {number} x3 - Second line start x
     * @param {number} y3 - Second line start y
     * @param {number} x4 - Second line end x
     * @param {number} y4 - Second line end y
     * @returns {Object|null} { x, y } intersection point or null
     */
    lineVsLine: function (x1, y1, x2, y2, x3, y3, x4, y4) {
      var denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
      if (denom === 0) return null; // Parallel

      var t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
      var u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

      if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
          x: x1 + t * (x2 - x1),
          y: y1 + t * (y2 - y1),
        };
      }

      return null;
    },

    /**
     * Line segment vs Circle intersection
     * @param {number} x1 - Line start x
     * @param {number} y1 - Line start y
     * @param {number} x2 - Line end x
     * @param {number} y2 - Line end y
     * @param {number} cx - Circle center x
     * @param {number} cy - Circle center y
     * @param {number} r - Circle radius
     * @returns {boolean}
     */
    lineVsCircle: function (x1, y1, x2, y2, cx, cy, r) {
      // Vector from line start to circle center
      var dx = x2 - x1;
      var dy = y2 - y1;
      var fx = x1 - cx;
      var fy = y1 - cy;

      var a = dx * dx + dy * dy;
      var b = 2 * (fx * dx + fy * dy);
      var c = fx * fx + fy * fy - r * r;

      var discriminant = b * b - 4 * a * c;
      if (discriminant < 0) return false;

      var sqrtD = Math.sqrt(discriminant);
      var t1 = (-b - sqrtD) / (2 * a);
      var t2 = (-b + sqrtD) / (2 * a);

      return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
    },

    // ----------------------------------------
    // Overlap Amount
    // ----------------------------------------

    /**
     * Get overlap amount between two AABBs
     * @param {Object} a - First rect { x, y, width, height }
     * @param {Object} b - Second rect { x, y, width, height }
     * @returns {{ x: number, y: number }} Overlap on each axis
     */
    getAabbOverlap: function (a, b) {
      var overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
      var overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);

      return {
        x: overlapX > 0 ? overlapX : 0,
        y: overlapY > 0 ? overlapY : 0,
      };
    },

    /**
     * Get penetration depth between two circles
     * @param {number} x1 - First circle center x
     * @param {number} y1 - First circle center y
     * @param {number} r1 - First circle radius
     * @param {number} x2 - Second circle center x
     * @param {number} y2 - Second circle center y
     * @param {number} r2 - Second circle radius
     * @returns {number} Penetration depth (0 if not overlapping)
     */
    getCirclePenetration: function (x1, y1, r1, x2, y2, r2) {
      var dist = Collision.distance(x1, y1, x2, y2);
      var combinedRadius = r1 + r2;
      return Math.max(0, combinedRadius - dist);
    },

    // ----------------------------------------
    // Cone/Sector
    // ----------------------------------------

    /**
     * Check if point is inside a cone (2D sector)
     * @param {number} px - Point x
     * @param {number} py - Point y
     * @param {number} cx - Cone origin x
     * @param {number} cy - Cone origin y
     * @param {number} direction - Cone direction in radians
     * @param {number} angle - Cone half-angle in radians
     * @param {number} range - Cone range
     * @returns {boolean}
     */
    pointInCone: function (px, py, cx, cy, direction, angle, range) {
      // Check distance first
      var distSq = Collision.distanceSquared(px, py, cx, cy);
      if (distSq > range * range) return false;

      // Check angle
      var angleToPoint = Math.atan2(py - cy, px - cx);
      var delta = Math.abs(angleToPoint - direction);

      // Normalize to 0-PI range
      while (delta > Math.PI) delta -= Math.PI * 2;
      delta = Math.abs(delta);

      return delta <= angle;
    },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Lib.Math.Collision = Collision;

})(window.RoguelikeFramework.Lib = window.RoguelikeFramework.Lib || {});
