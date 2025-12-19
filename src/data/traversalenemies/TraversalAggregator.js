/**
 * @fileoverview Traversal Enemy Aggregator - Merges all patterns from registry
 * @module Data/TraversalEnemies/TraversalAggregator
 */
(function (Data) {
  'use strict';

  // ============================================
  // Aggregate Patterns from Registry
  // ============================================
  var PatternConfig = {};
  var PatternWeights = {};

  // Copy patterns from registry
  var patternRegistry = Data.TraversalPatternRegistry || {};
  for (var patternId in patternRegistry) {
    if (patternRegistry.hasOwnProperty(patternId)) {
      PatternConfig[patternId] = patternRegistry[patternId];
    }
  }

  // Copy weights from registry
  var weightsRegistry = Data.TraversalPatternWeights || {};
  for (var weightId in weightsRegistry) {
    if (weightsRegistry.hasOwnProperty(weightId)) {
      PatternWeights[weightId] = weightsRegistry[weightId];
    }
  }

  // Get references to constants
  var TraversalConfig = Data.TraversalConfig;
  var LASER_DIRECTIONS = Data.LASER_DIRECTIONS;

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get spawn interval for a specific wave
   * @param {number} wave - Current wave number
   * @returns {number} Spawn interval in seconds
   */
  function getSpawnInterval(wave) {
    var interval = TraversalConfig.BASE_SPAWN_INTERVAL - (wave - 1) * TraversalConfig.SPAWN_INTERVAL_DECAY;
    return Math.max(TraversalConfig.MIN_SPAWN_INTERVAL, interval);
  }

  /**
   * Select a random pattern based on weights
   * @returns {string} Pattern type ('CIRCULAR', 'DASH', or 'LASER')
   */
  function selectRandomPattern() {
    var roll = Math.random();
    var cumulative = 0;

    var patterns = Object.keys(PatternWeights);
    for (var i = 0; i < patterns.length; i++) {
      cumulative += PatternWeights[patterns[i]];
      if (roll < cumulative) {
        return patterns[i];
      }
    }

    // Fallback
    return 'CIRCULAR';
  }

  /**
   * Get configuration for a specific pattern
   * @param {string} patternType - Pattern type
   * @returns {Object} Pattern configuration
   */
  function getPatternConfig(patternType) {
    return PatternConfig[patternType] || PatternConfig.CIRCULAR;
  }

  /**
   * Get health multiplier based on wave (traversal enemies scale too)
   * @param {number} wave - Current wave number
   * @returns {number} Health multiplier
   */
  function getWaveHealthMultiplier(wave) {
    return 1.0 + (wave - 1) * 0.15; // +15% per wave
  }

  /**
   * Get enemy count for a pattern type
   * @param {string} patternType - Pattern type ('CIRCULAR', 'DASH')
   * @returns {number} Random count in configured range
   */
  function getEnemyCount(patternType) {
    var config = PatternConfig[patternType];
    if (!config || !config.enemyCount) {
      return 1;
    }
    var min = config.enemyCount.min;
    var max = config.enemyCount.max;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get enemies per line for LASER pattern
   * @returns {number} Random count in configured range
   */
  function getEnemiesPerLine() {
    var config = PatternConfig.LASER;
    var min = config.enemiesPerLine.min;
    var max = config.enemiesPerLine.max;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Select random LASER directions (1-4 directions)
   * @returns {Array<string>} Array of direction strings ('top', 'bottom', 'left', 'right')
   */
  function selectLaserDirections() {
    // Randomly select 1-4 directions
    var directionCount = Math.floor(Math.random() * 4) + 1;

    // Shuffle directions and take the required count
    var shuffled = LASER_DIRECTIONS.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }

    return shuffled.slice(0, directionCount);
  }

  /**
   * Determine if LASER pattern should target player
   * @returns {boolean} True if targeted, false if untargeted (straight across)
   */
  function isLaserTargeted() {
    return Math.random() < 0.5; // 50% chance
  }

  /**
   * Get color for a pattern type (for arrow indicators)
   * @param {string} patternType - Pattern type
   * @returns {string} Color hex code
   */
  function getPatternColor(patternType) {
    var config = PatternConfig[patternType];
    return config ? config.color : '#FFFFFF';
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.TraversalEnemyData = {
    TraversalConfig: TraversalConfig,
    PatternConfig: PatternConfig,
    PatternWeights: PatternWeights,
    LASER_DIRECTIONS: LASER_DIRECTIONS,
    getSpawnInterval: getSpawnInterval,
    selectRandomPattern: selectRandomPattern,
    getPatternConfig: getPatternConfig,
    getWaveHealthMultiplier: getWaveHealthMultiplier,
    getEnemyCount: getEnemyCount,
    getEnemiesPerLine: getEnemiesPerLine,
    selectLaserDirections: selectLaserDirections,
    isLaserTargeted: isLaserTargeted,
    getPatternColor: getPatternColor,
  };
})(window.VampireSurvivors.Data);
