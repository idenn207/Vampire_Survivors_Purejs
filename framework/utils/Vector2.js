/**
 * @fileoverview 2D Vector mathematics utility
 * @module Utils/Vector2
 */
(function(Utils) {
  'use strict';

  // ============================================
  // Class Definition
  // ============================================
  class Vector2 {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    x = 0;
    y = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    set(x, y) {
      this.x = x;
      this.y = y;
      return this;
    }

    copy(v) {
      this.x = v.x;
      this.y = v.y;
      return this;
    }

    clone() {
      return new Vector2(this.x, this.y);
    }

    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }

    sub(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    }

    scale(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    }

    normalize() {
      var len = this.length();
      if (len > 0) {
        this.x /= len;
        this.y /= len;
      }
      return this;
    }

    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lengthSquared() {
      return this.x * this.x + this.y * this.y;
    }

    distanceTo(v) {
      var dx = this.x - v.x;
      var dy = this.y - v.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    distanceToSquared(v) {
      var dx = this.x - v.x;
      var dy = this.y - v.y;
      return dx * dx + dy * dy;
    }

    dot(v) {
      return this.x * v.x + this.y * v.y;
    }

    angle() {
      return Math.atan2(this.y, this.x);
    }

    angleTo(v) {
      return Math.atan2(v.y - this.y, v.x - this.x);
    }

    rotate(angle) {
      var cos = Math.cos(angle);
      var sin = Math.sin(angle);
      var x = this.x * cos - this.y * sin;
      var y = this.x * sin + this.y * cos;
      this.x = x;
      this.y = y;
      return this;
    }

    lerp(v, t) {
      this.x += (v.x - this.x) * t;
      this.y += (v.y - this.y) * t;
      return this;
    }

    // ----------------------------------------
    // Static Methods
    // ----------------------------------------
    static add(a, b) {
      return new Vector2(a.x + b.x, a.y + b.y);
    }

    static sub(a, b) {
      return new Vector2(a.x - b.x, a.y - b.y);
    }

    static scale(v, scalar) {
      return new Vector2(v.x * scalar, v.y * scalar);
    }

    static normalize(v) {
      var len = v.length();
      if (len > 0) {
        return new Vector2(v.x / len, v.y / len);
      }
      return new Vector2();
    }

    static distance(a, b) {
      var dx = a.x - b.x;
      var dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    static fromAngle(angle) {
      return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    static lerp(a, b, t) {
      return new Vector2(
        a.x + (b.x - a.x) * t,
        a.y + (b.y - a.y) * t
      );
    }

    static zero() {
      return new Vector2(0, 0);
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Utils.Vector2 = Vector2;

})(window.RoguelikeFramework.Utils);
