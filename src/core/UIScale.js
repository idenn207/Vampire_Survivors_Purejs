/**
 * @fileoverview UI Scale utility for resolution-independent UI scaling
 * @module Core/UIScale
 */
(function (Core) {
  'use strict';

  // ============================================
  // Constants
  // ============================================
  var BASE_WIDTH = 800;
  var BASE_HEIGHT = 600;

  // ============================================
  // State
  // ============================================
  var _currentWidth = BASE_WIDTH;
  var _currentHeight = BASE_HEIGHT;
  var _scaleFactor = 1.0;

  // ============================================
  // UIScale Object
  // ============================================
  var UIScale = {
    // Base resolution constants
    BASE_WIDTH: BASE_WIDTH,
    BASE_HEIGHT: BASE_HEIGHT,

    /**
     * Update the scale factor based on current resolution
     * @param {number} width - Current canvas width
     * @param {number} height - Current canvas height
     */
    update: function (width, height) {
      _currentWidth = width || BASE_WIDTH;
      _currentHeight = height || BASE_HEIGHT;
      // Scale by height only (user requirement)
      _scaleFactor = _currentHeight / BASE_HEIGHT;
    },

    /**
     * Scale a pixel value from base resolution to current resolution
     * @param {number} baseValue - Value at 800x600 resolution
     * @returns {number} Scaled value for current resolution
     */
    scale: function (baseValue) {
      return Math.round(baseValue * _scaleFactor);
    },

    /**
     * Get a scaled font string
     * @param {number} baseSize - Font size at base resolution
     * @param {string} [weight] - Font weight (e.g., 'bold')
     * @param {string} [family] - Font family (default: 'Arial')
     * @returns {string} CSS font string
     */
    font: function (baseSize, weight, family) {
      var scaledSize = Math.round(baseSize * _scaleFactor);
      family = family || 'Arial';
      if (weight) {
        return weight + ' ' + scaledSize + 'px ' + family;
      }
      return scaledSize + 'px ' + family;
    },

    /**
     * Get current scale factor
     * @returns {number}
     */
    getScaleFactor: function () {
      return _scaleFactor;
    },

    /**
     * Get current width
     * @returns {number}
     */
    getWidth: function () {
      return _currentWidth;
    },

    /**
     * Get current height
     * @returns {number}
     */
    getHeight: function () {
      return _currentHeight;
    },

    /**
     * Check if current resolution is base resolution
     * @returns {boolean}
     */
    isBaseResolution: function () {
      return _scaleFactor === 1.0;
    },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Core.UIScale = UIScale;
})(window.VampireSurvivors.Core);
