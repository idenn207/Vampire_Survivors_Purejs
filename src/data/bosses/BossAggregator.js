/**
 * @fileoverview Boss Aggregator - Merges all bosses from registry
 * @module Data/Bosses/BossAggregator
 */
(function (Data) {
  'use strict';

  // ============================================
  // Aggregate Bosses from Registry
  // ============================================
  var BossConfig = {};

  // Copy all bosses from registry
  var registry = Data.BossRegistry || {};
  for (var bossId in registry) {
    if (registry.hasOwnProperty(bossId)) {
      BossConfig[bossId] = registry[bossId];
    }
  }

  // Get references to constants
  var ScalingConfig = Data.BossScalingConfig;
  var PhaseColors = Data.BossPhaseColors;
  var FirstWaves = Data.BossFirstWaves;

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get boss configuration
   * @param {string} bossType - 'elite', 'miniboss', or 'boss'
   * @returns {Object|null}
   */
  function getBossConfig(bossType) {
    return BossConfig[bossType] || null;
  }

  /**
   * Get health multiplier based on wave
   * @param {number} wave - Current wave number
   * @param {string} bossType - Boss type
   * @returns {number}
   */
  function getWaveHealthMultiplier(wave, bossType) {
    var baseWave = FirstWaves[bossType] || 5;
    var wavesPastFirst = Math.max(0, wave - baseWave);
    return 1.0 + wavesPastFirst * ScalingConfig.HEALTH_PER_WAVE;
  }

  /**
   * Get damage multiplier based on wave
   * @param {number} wave - Current wave number
   * @param {string} bossType - Boss type
   * @returns {number}
   */
  function getWaveDamageMultiplier(wave, bossType) {
    var baseWave = FirstWaves[bossType] || 5;
    var wavesPastFirst = Math.max(0, wave - baseWave);
    return 1.0 + wavesPastFirst * ScalingConfig.DAMAGE_PER_WAVE;
  }

  /**
   * Get current phase based on health percentage
   * @param {string} bossType - Boss type
   * @param {number} healthPercent - Current health as decimal (0-1)
   * @returns {Object} Phase configuration
   */
  function getCurrentPhase(bossType, healthPercent) {
    var config = BossConfig[bossType];
    if (!config) return null;

    for (var i = 0; i < config.phases.length; i++) {
      if (healthPercent > config.phases[i].threshold) {
        return {
          index: i,
          config: config.phases[i],
        };
      }
    }

    // Return last phase if below all thresholds
    return {
      index: config.phases.length - 1,
      config: config.phases[config.phases.length - 1],
    };
  }

  /**
   * Get phase index for a health percentage
   * @param {string} bossType - Boss type
   * @param {number} healthPercent - Current health as decimal (0-1)
   * @returns {number} Phase index (0-based)
   */
  function getPhaseIndex(bossType, healthPercent) {
    var phase = getCurrentPhase(bossType, healthPercent);
    return phase ? phase.index : 0;
  }

  /**
   * Get color for a phase index
   * @param {number} phaseIndex - Phase index (0-based)
   * @returns {string} Color hex code
   */
  function getPhaseColor(phaseIndex) {
    return PhaseColors[Math.min(phaseIndex, PhaseColors.length - 1)];
  }

  /**
   * Get attack configuration
   * @param {string} bossType - Boss type
   * @param {string} attackName - Attack name
   * @returns {Object|null}
   */
  function getAttackConfig(bossType, attackName) {
    var config = BossConfig[bossType];
    if (!config || !config.attacks) return null;
    return config.attacks[attackName] || null;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.BossData = {
    BossConfig: BossConfig,
    ScalingConfig: ScalingConfig,
    PhaseColors: PhaseColors,
    getBossConfig: getBossConfig,
    getWaveHealthMultiplier: getWaveHealthMultiplier,
    getWaveDamageMultiplier: getWaveDamageMultiplier,
    getCurrentPhase: getCurrentPhase,
    getPhaseIndex: getPhaseIndex,
    getPhaseColor: getPhaseColor,
    getAttackConfig: getAttackConfig,
  };
})(window.VampireSurvivors.Data);
