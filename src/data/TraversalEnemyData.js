/**
 * @fileoverview Traversal enemy data - configures traversal enemy types and patterns
 * @module Data/TraversalEnemyData
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
  // Pattern Configurations (Group Spawning)
  // ============================================
  var PatternConfig = {
    CIRCULAR: {
      enemyCount: { min: 40, max: 60 }, // More enemies for wider ring
      spawnRadius: 400, // Distance from player at spawn (wider)
      moveSpeed: 0, // STATIONARY - no movement
      health: 40, // Lower health (more enemies)
      damage: 10,
      decayTime: 15.0, // Seconds before disappearing
      color: '#FF6600', // Orange
      size: 24,
      imageId: 'enemy_traversal_circular',
    },
    DASH: {
      enemyCount: { min: 12, max: 15 }, // Spawn count
      dashSpeed: 350, // Dash speed toward player
      health: 30, // Weaker individuals
      damage: 15,
      decayTime: 6.0,
      color: '#FF00FF', // Magenta
      size: 18,
      chargeTime: 0.8, // Pause before dashing
      groupSpread: 80, // Cluster spread radius
      imageId: 'enemy_traversal_dash',
    },
    LASER: {
      enemiesPerLine: { min: 8, max: 12 }, // Per-line count
      enemySpacing: 150, // Pixels between enemies in line (3x spacing)
      spawnOffset: 300, // Extra offset outside viewport for wider spawn
      moveSpeed: 200, // Constant speed across map
      health: 50,
      damage: 15,
      decayTime: 12.0, // Longer lifetime
      color: '#00FFFF', // Cyan
      size: 26,
      imageId: 'enemy_traversal_laser',
    },
  };

  // ============================================
  // LASER Direction Options
  // ============================================
  var LASER_DIRECTIONS = ['top', 'bottom', 'left', 'right'];

  // ============================================
  // Pattern Weights (for random selection)
  // ============================================
  var PatternWeights = {
    CIRCULAR: 0.35, // 35% chance
    DASH: 0.35, // 35% chance
    LASER: 0.3, // 30% chance
  };

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
