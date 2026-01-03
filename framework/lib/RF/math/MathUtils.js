/**
 * @fileoverview Common math utility functions
 * @module Lib/Math/MathUtils
 */
(function (Lib) {
  'use strict';

  // ============================================
  // Ensure namespace exists
  // ============================================
  Lib.Math = Lib.Math || {};

  // ============================================
  // Constants
  // ============================================
  var PI = Math.PI;
  var TWO_PI = PI * 2;
  var HALF_PI = PI / 2;
  var DEG_TO_RAD = PI / 180;
  var RAD_TO_DEG = 180 / PI;

  // ============================================
  // MathUtils Object
  // ============================================
  var MathUtils = {
    // ----------------------------------------
    // Constants
    // ----------------------------------------
    PI: PI,
    TWO_PI: TWO_PI,
    HALF_PI: HALF_PI,
    DEG_TO_RAD: DEG_TO_RAD,
    RAD_TO_DEG: RAD_TO_DEG,

    // ----------------------------------------
    // Clamping & Interpolation
    // ----------------------------------------

    /**
     * Clamp value between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number}
     */
    clamp: function (value, min, max) {
      return value < min ? min : value > max ? max : value;
    },

    /**
     * Linear interpolation between a and b
     * @param {number} a - Start value
     * @param {number} b - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number}
     */
    lerp: function (a, b, t) {
      return a + (b - a) * t;
    },

    /**
     * Inverse linear interpolation (find t given value)
     * @param {number} a - Start value
     * @param {number} b - End value
     * @param {number} value - Value between a and b
     * @returns {number} t value (0-1)
     */
    inverseLerp: function (a, b, value) {
      if (a === b) return 0;
      return (value - a) / (b - a);
    },

    /**
     * Remap value from one range to another
     * @param {number} value - Input value
     * @param {number} inMin - Input range minimum
     * @param {number} inMax - Input range maximum
     * @param {number} outMin - Output range minimum
     * @param {number} outMax - Output range maximum
     * @returns {number}
     */
    remap: function (value, inMin, inMax, outMin, outMax) {
      var t = MathUtils.inverseLerp(inMin, inMax, value);
      return MathUtils.lerp(outMin, outMax, t);
    },

    /**
     * Smoothstep interpolation (smooth Hermite curve)
     * @param {number} t - Input (0-1)
     * @returns {number} Smoothed output (0-1)
     */
    smoothstep: function (t) {
      t = MathUtils.clamp(t, 0, 1);
      return t * t * (3 - 2 * t);
    },

    /**
     * Smoother step (Ken Perlin's improved curve)
     * @param {number} t - Input (0-1)
     * @returns {number} Smoothed output (0-1)
     */
    smootherstep: function (t) {
      t = MathUtils.clamp(t, 0, 1);
      return t * t * t * (t * (t * 6 - 15) + 10);
    },

    /**
     * Exponential decay (frame-rate independent smoothing)
     * @param {number} current - Current value
     * @param {number} target - Target value
     * @param {number} decay - Decay rate (higher = faster)
     * @param {number} deltaTime - Time since last update
     * @returns {number} New value
     */
    exponentialDecay: function (current, target, decay, deltaTime) {
      return target + (current - target) * Math.pow(0.5, deltaTime * decay);
    },

    /**
     * Move towards target by a maximum amount
     * @param {number} current - Current value
     * @param {number} target - Target value
     * @param {number} maxDelta - Maximum change
     * @returns {number}
     */
    moveTowards: function (current, target, maxDelta) {
      var diff = target - current;
      if (Math.abs(diff) <= maxDelta) {
        return target;
      }
      return current + Math.sign(diff) * maxDelta;
    },

    // ----------------------------------------
    // Angle Operations
    // ----------------------------------------

    /**
     * Convert degrees to radians
     * @param {number} degrees
     * @returns {number} radians
     */
    degToRad: function (degrees) {
      return degrees * DEG_TO_RAD;
    },

    /**
     * Convert radians to degrees
     * @param {number} radians
     * @returns {number} degrees
     */
    radToDeg: function (radians) {
      return radians * RAD_TO_DEG;
    },

    /**
     * Normalize angle to 0 to 2PI range
     * @param {number} angle - Angle in radians
     * @returns {number}
     */
    normalizeAngle: function (angle) {
      angle = angle % TWO_PI;
      if (angle < 0) angle += TWO_PI;
      return angle;
    },

    /**
     * Normalize angle to -PI to PI range
     * @param {number} angle - Angle in radians
     * @returns {number}
     */
    normalizeAngleSigned: function (angle) {
      angle = angle % TWO_PI;
      if (angle > PI) angle -= TWO_PI;
      if (angle < -PI) angle += TWO_PI;
      return angle;
    },

    /**
     * Get shortest delta between two angles
     * @param {number} from - Start angle in radians
     * @param {number} to - End angle in radians
     * @returns {number} Shortest delta (can be negative)
     */
    shortestAngleDelta: function (from, to) {
      var diff = MathUtils.normalizeAngle(to - from);
      if (diff > PI) diff -= TWO_PI;
      return diff;
    },

    /**
     * Lerp between two angles (shortest path)
     * @param {number} from - Start angle in radians
     * @param {number} to - End angle in radians
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number}
     */
    lerpAngle: function (from, to, t) {
      var delta = MathUtils.shortestAngleDelta(from, to);
      return from + delta * t;
    },

    // ----------------------------------------
    // Other Utilities
    // ----------------------------------------

    /**
     * Get the sign of a number (-1, 0, or 1)
     * @param {number} x
     * @returns {number}
     */
    sign: function (x) {
      return x > 0 ? 1 : x < 0 ? -1 : 0;
    },

    /**
     * Wrap value around a range (like modulo but handles negatives)
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    wrap: function (value, min, max) {
      var range = max - min;
      return min + ((((value - min) % range) + range) % range);
    },

    /**
     * Check if two floats are approximately equal
     * @param {number} a
     * @param {number} b
     * @param {number} [epsilon=0.0001]
     * @returns {boolean}
     */
    approximately: function (a, b, epsilon) {
      epsilon = epsilon !== undefined ? epsilon : 0.0001;
      return Math.abs(a - b) < epsilon;
    },

    /**
     * Round to a specified number of decimal places
     * @param {number} value
     * @param {number} decimals
     * @returns {number}
     */
    roundTo: function (value, decimals) {
      var factor = Math.pow(10, decimals);
      return Math.round(value * factor) / factor;
    },

    /**
     * Check if value is a power of 2
     * @param {number} value
     * @returns {boolean}
     */
    isPowerOfTwo: function (value) {
      return value > 0 && (value & (value - 1)) === 0;
    },

    /**
     * Get next power of 2 >= value
     * @param {number} value
     * @returns {number}
     */
    nextPowerOfTwo: function (value) {
      value--;
      value |= value >> 1;
      value |= value >> 2;
      value |= value >> 4;
      value |= value >> 8;
      value |= value >> 16;
      return value + 1;
    },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Lib.Math.MathUtils = MathUtils;

})(window.RoguelikeFramework.Lib = window.RoguelikeFramework.Lib || {});
