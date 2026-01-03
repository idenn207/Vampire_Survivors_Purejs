/**
 * @fileoverview Enhanced random utilities
 * @module Lib/Math/Random
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
  var TWO_PI = Math.PI * 2;

  // ============================================
  // Random Object
  // ============================================
  var Random = {
    // ----------------------------------------
    // Basic Random
    // ----------------------------------------

    /**
     * Random float between min and max (inclusive)
     * @param {number} [min=0] - Minimum value
     * @param {number} [max=1] - Maximum value
     * @returns {number}
     */
    float: function (min, max) {
      if (min === undefined) return Math.random();
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return min + Math.random() * (max - min);
    },

    /**
     * Random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number}
     */
    int: function (min, max) {
      return Math.floor(min + Math.random() * (max - min + 1));
    },

    /**
     * Random boolean with probability
     * @param {number} [probability=0.5] - Probability of true (0-1)
     * @returns {boolean}
     */
    bool: function (probability) {
      probability = probability !== undefined ? probability : 0.5;
      return Math.random() < probability;
    },

    /**
     * Random sign (-1 or 1)
     * @returns {number}
     */
    sign: function () {
      return Math.random() < 0.5 ? -1 : 1;
    },

    // ----------------------------------------
    // Selection
    // ----------------------------------------

    /**
     * Random element from array
     * @param {Array} array - Source array
     * @returns {*} Random element or undefined if empty
     */
    element: function (array) {
      if (!array || array.length === 0) return undefined;
      return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Random index from array
     * @param {Array} array - Source array
     * @returns {number} Random index or -1 if empty
     */
    index: function (array) {
      if (!array || array.length === 0) return -1;
      return Math.floor(Math.random() * array.length);
    },

    /**
     * Weighted random selection
     * @param {Array} options - Array of { value, weight } or just values
     * @param {string} [weightKey='weight'] - Key for weight property
     * @returns {*} Selected value
     *
     * @example
     * Random.weighted([
     *   { item: 'common', weight: 70 },
     *   { item: 'rare', weight: 25 },
     *   { item: 'epic', weight: 5 }
     * ]);
     */
    weighted: function (options, weightKey) {
      if (!options || options.length === 0) return undefined;

      weightKey = weightKey || 'weight';

      // Calculate total weight
      var totalWeight = 0;
      for (var i = 0; i < options.length; i++) {
        var opt = options[i];
        var weight = typeof opt === 'object' ? (opt[weightKey] || 1) : 1;
        totalWeight += weight;
      }

      // Select random point
      var roll = Math.random() * totalWeight;
      var cumulative = 0;

      for (var j = 0; j < options.length; j++) {
        var option = options[j];
        var w = typeof option === 'object' ? (option[weightKey] || 1) : 1;
        cumulative += w;

        if (roll < cumulative) {
          return typeof option === 'object' ? option : option;
        }
      }

      // Fallback to last item
      return options[options.length - 1];
    },

    /**
     * Fisher-Yates shuffle (in-place)
     * @param {Array} array - Array to shuffle
     * @returns {Array} Same array, shuffled
     */
    shuffle: function (array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },

    /**
     * Get N random elements from array (without replacement)
     * @param {Array} array - Source array
     * @param {number} count - Number of elements
     * @returns {Array} Array of random elements
     */
    sample: function (array, count) {
      if (!array || array.length === 0) return [];
      count = Math.min(count, array.length);

      var copy = array.slice();
      Random.shuffle(copy);
      return copy.slice(0, count);
    },

    // ----------------------------------------
    // Geometry
    // ----------------------------------------

    /**
     * Random angle (0 to 2π)
     * @returns {number} Angle in radians
     */
    angle: function () {
      return Math.random() * TWO_PI;
    },

    /**
     * Random point inside a circle
     * @param {number} [radius=1] - Circle radius
     * @returns {{ x: number, y: number }}
     */
    pointInCircle: function (radius) {
      radius = radius !== undefined ? radius : 1;

      // Use rejection sampling for uniform distribution
      var x, y;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
      } while (x * x + y * y > 1);

      return {
        x: x * radius,
        y: y * radius,
      };
    },

    /**
     * Random point on circle edge
     * @param {number} [radius=1] - Circle radius
     * @returns {{ x: number, y: number }}
     */
    pointOnCircle: function (radius) {
      radius = radius !== undefined ? radius : 1;
      var angle = Math.random() * TWO_PI;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    },

    /**
     * Random unit direction vector
     * @returns {{ x: number, y: number }}
     */
    direction: function () {
      var angle = Math.random() * TWO_PI;
      return {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
    },

    /**
     * Random point in rectangle
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @param {number} [x=0] - Rectangle x offset
     * @param {number} [y=0] - Rectangle y offset
     * @returns {{ x: number, y: number }}
     */
    pointInRect: function (width, height, x, y) {
      x = x || 0;
      y = y || 0;
      return {
        x: x + Math.random() * width,
        y: y + Math.random() * height,
      };
    },

    /**
     * Random point on rectangle edge
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @returns {{ x: number, y: number }}
     */
    pointOnRectEdge: function (width, height) {
      var perimeter = 2 * (width + height);
      var point = Math.random() * perimeter;

      if (point < width) {
        return { x: point, y: 0 }; // Top edge
      }
      point -= width;

      if (point < height) {
        return { x: width, y: point }; // Right edge
      }
      point -= height;

      if (point < width) {
        return { x: width - point, y: height }; // Bottom edge
      }
      point -= width;

      return { x: 0, y: height - point }; // Left edge
    },

    // ----------------------------------------
    // Distributions
    // ----------------------------------------

    /**
     * Gaussian (normal) distribution
     * @param {number} [mean=0] - Mean
     * @param {number} [stdDev=1] - Standard deviation
     * @returns {number}
     */
    gaussian: function (mean, stdDev) {
      mean = mean !== undefined ? mean : 0;
      stdDev = stdDev !== undefined ? stdDev : 1;

      // Box-Muller transform
      var u1 = Math.random();
      var u2 = Math.random();
      var z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(TWO_PI * u2);
      return mean + z * stdDev;
    },

    /**
     * Exponential distribution
     * @param {number} [lambda=1] - Rate parameter
     * @returns {number}
     */
    exponential: function (lambda) {
      lambda = lambda !== undefined ? lambda : 1;
      return -Math.log(1 - Math.random()) / lambda;
    },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Lib.Math.Random = Random;

})(window.RoguelikeFramework.Lib = window.RoguelikeFramework.Lib || {});
