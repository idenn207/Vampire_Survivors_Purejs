/**
 * @fileoverview Enemy Aggregator - Merges all enemies from registry
 * @module Data/Enemies/EnemyAggregator
 */
(function (Data) {
  'use strict';

  // ============================================
  // Aggregate Enemies from Registry
  // ============================================
  var EnemyTypeConfig = {};

  // Copy all enemies from registry
  var registry = Data.EnemyRegistry || {};
  for (var enemyId in registry) {
    if (registry.hasOwnProperty(enemyId)) {
      EnemyTypeConfig[enemyId] = registry[enemyId];
    }
  }

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get available enemy types for a specific wave
   * @param {number} waveNumber - Current wave number
   * @returns {Array<string>} Array of enemy type keys
   */
  function getEnemyTypesForWave(waveNumber) {
    var types = [];
    for (var type in EnemyTypeConfig) {
      if (EnemyTypeConfig[type].startWave <= waveNumber) {
        types.push(type);
      }
    }
    return types;
  }

  /**
   * Select a random enemy type based on wave and spawn weights
   * @param {number} waveNumber - Current wave number
   * @returns {string} Selected enemy type key
   */
  function selectRandomType(waveNumber) {
    var types = getEnemyTypesForWave(waveNumber);
    if (types.length === 0) {
      return 'normal';
    }

    // Calculate total weight
    var totalWeight = 0;
    for (var i = 0; i < types.length; i++) {
      totalWeight += EnemyTypeConfig[types[i]].spawnWeight;
    }

    // Roll and select
    var roll = Math.random() * totalWeight;
    var cumulative = 0;
    for (var j = 0; j < types.length; j++) {
      cumulative += EnemyTypeConfig[types[j]].spawnWeight;
      if (roll < cumulative) {
        return types[j];
      }
    }

    return 'normal';
  }

  /**
   * Get configuration for a specific enemy type
   * @param {string} type - Enemy type key
   * @returns {Object} Enemy configuration object
   */
  function getConfig(type) {
    return EnemyTypeConfig[type] || EnemyTypeConfig.normal;
  }

  /**
   * Get all enemy type keys
   * @returns {Array<string>} Array of all enemy type keys
   */
  function getAllTypes() {
    return Object.keys(EnemyTypeConfig);
  }

  /**
   * Check if an enemy type exists
   * @param {string} type - Enemy type key
   * @returns {boolean} True if type exists
   */
  function hasType(type) {
    return EnemyTypeConfig.hasOwnProperty(type);
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.EnemyData = {
    EnemyType: Data.EnemyType,
    EnemyTypeConfig: EnemyTypeConfig,
    getEnemyTypesForWave: getEnemyTypesForWave,
    selectRandomType: selectRandomType,
    getConfig: getConfig,
    getAllTypes: getAllTypes,
    hasType: hasType,
  };
})(window.VampireSurvivors.Data);
