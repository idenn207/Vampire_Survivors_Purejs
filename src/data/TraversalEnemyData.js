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
    BASE_SPAWN_INTERVAL: 8.0, // seconds between spawns
    MIN_SPAWN_INTERVAL: 3.0, // minimum interval
    SPAWN_INTERVAL_DECAY: 0.5, // reduce per wave
    START_WAVE: 2, // Start spawning from wave 2
  };

  // ============================================
  // Pattern Configurations
  // ============================================
  var PatternConfig = {
    CIRCULAR: {
      spawnRadius: 200, // Distance from player at spawn
      moveSpeed: 180, // Pixels per second
      health: 80,
      damage: 15,
      decayTime: 12.0, // Seconds before disappearing
      color: '#FF6600', // Orange
      size: 28,
    },
    DASH: {
      dashSpeed: 400, // Fast dash speed
      health: 60,
      damage: 25,
      decayTime: 5.0, // Short lifetime
      color: '#FF00FF', // Magenta
      size: 20,
      chargeTime: 0.5, // Pause before dashing
    },
    LASER: {
      moveSpeed: 250, // Constant speed across map
      health: 100,
      damage: 20,
      decayTime: 15.0, // Longer lifetime
      color: '#00FFFF', // Cyan
      size: 32,
    },
  };

  // ============================================
  // Pattern Weights (for random selection)
  // ============================================
  var PatternWeights = {
    CIRCULAR: 0.4, // 40% chance
    DASH: 0.35, // 35% chance
    LASER: 0.25, // 25% chance
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

  // ============================================
  // Export to Namespace
  // ============================================
  Data.TraversalEnemyData = {
    TraversalConfig: TraversalConfig,
    PatternConfig: PatternConfig,
    PatternWeights: PatternWeights,
    getSpawnInterval: getSpawnInterval,
    selectRandomPattern: selectRandomPattern,
    getPatternConfig: getPatternConfig,
    getWaveHealthMultiplier: getWaveHealthMultiplier,
  };
})(window.VampireSurvivors.Data);
