/**
 * @fileoverview Traversal Enemy Constants - Spawn config and registry
 * @module Data/TraversalEnemies/TraversalConstants
 */
(function (Data) {
  'use strict';

  // ============================================
  // Spawn Configuration
  // ============================================
  var TraversalConfig = {
    BASE_SPAWN_INTERVAL: 12.0, // seconds between spawns (longer for group spawns)
    MIN_SPAWN_INTERVAL: 6.0, // minimum interval
    SPAWN_INTERVAL_DECAY: 0.5, // reduce per wave
    START_WAVE: 2, // Start spawning from wave 2
    WARNING_TIME: 3.0, // seconds before spawn to show arrow indicator
  };

  // ============================================
  // LASER Direction Options
  // ============================================
  var LASER_DIRECTIONS = ['top', 'bottom', 'left', 'right'];

  // ============================================
  // Initialize Registries
  // ============================================
  Data.TraversalPatternRegistry = Data.TraversalPatternRegistry || {};
  Data.TraversalPatternWeights = Data.TraversalPatternWeights || {};

  // ============================================
  // Export to Namespace
  // ============================================
  Data.TraversalConfig = TraversalConfig;
  Data.LASER_DIRECTIONS = LASER_DIRECTIONS;
})(window.VampireSurvivors.Data);
