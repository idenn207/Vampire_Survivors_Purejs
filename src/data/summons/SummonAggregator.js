/**
 * @fileoverview Summon Aggregator - Merges all summons from registry
 * @module Data/Summons/SummonAggregator
 */
(function (Data) {
  'use strict';

  // ============================================
  // Aggregate Summons from Registry
  // ============================================
  var SummonTypeConfig = {};

  // Copy all summons from registry
  var registry = Data.SummonRegistry || {};
  for (var summonId in registry) {
    if (registry.hasOwnProperty(summonId)) {
      SummonTypeConfig[summonId] = registry[summonId];
    }
  }

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get configuration for a specific summon type
   * @param {string} type - Summon type key
   * @returns {Object} Summon configuration object
   */
  function getConfig(type) {
    return SummonTypeConfig[type] || SummonTypeConfig.spirit;
  }

  /**
   * Get all summon type keys
   * @returns {Array<string>}
   */
  function getAllTypes() {
    return Object.keys(SummonTypeConfig);
  }

  /**
   * Check if a summon type exists
   * @param {string} type - Summon type key
   * @returns {boolean}
   */
  function hasType(type) {
    return SummonTypeConfig.hasOwnProperty(type);
  }

  /**
   * Get summons by behavior type
   * @param {string} behaviorType - BehaviorType value
   * @returns {Array<Object>}
   */
  function getSummonsByBehavior(behaviorType) {
    var result = [];
    for (var type in SummonTypeConfig) {
      if (SummonTypeConfig[type].behaviorType === behaviorType) {
        result.push(SummonTypeConfig[type]);
      }
    }
    return result;
  }

  /**
   * Get summons by attack pattern
   * @param {string} attackPattern - AttackPattern value
   * @returns {Array<Object>}
   */
  function getSummonsByAttackPattern(attackPattern) {
    var result = [];
    for (var type in SummonTypeConfig) {
      if (SummonTypeConfig[type].attackPattern === attackPattern) {
        result.push(SummonTypeConfig[type]);
      }
    }
    return result;
  }

  /**
   * Create a summon config with custom overrides
   * @param {string} baseType - Base summon type
   * @param {Object} overrides - Properties to override
   * @returns {Object} Merged configuration
   */
  function createCustomConfig(baseType, overrides) {
    var base = getConfig(baseType);
    var custom = {};

    // Copy base properties
    for (var key in base) {
      if (base.hasOwnProperty(key)) {
        custom[key] = base[key];
      }
    }

    // Apply overrides
    for (var overrideKey in overrides) {
      if (overrides.hasOwnProperty(overrideKey)) {
        custom[overrideKey] = overrides[overrideKey];
      }
    }

    return custom;
  }

  /**
   * Calculate effective stats with level scaling
   * @param {Object} config - Base summon config
   * @param {number} level - Summon level (1-5)
   * @returns {Object} Scaled stats
   */
  function getScaledStats(config, level) {
    var levelMultiplier = 1 + (level - 1) * 0.15;
    var healthMultiplier = 1 + (level - 1) * 0.25;
    var durationBonus = (level - 1) * 2;

    return {
      damage: Math.floor(config.damage * levelMultiplier),
      health: Math.floor(config.health * healthMultiplier),
      duration: config.duration + durationBonus,
      attackCooldown: Math.max(0.2, config.attackCooldown * (1 - (level - 1) * 0.05)),
      attackRange: config.attackRange + (level - 1) * 5,
      chaseSpeed: config.chaseSpeed + (level - 1) * 10,
    };
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.SummonData = {
    SummonType: Data.SummonType,
    BehaviorType: Data.SummonBehaviorType,
    AttackPattern: Data.SummonAttackPattern,
    TargetingMode: Data.SummonTargetingMode,
    SummonTypeConfig: SummonTypeConfig,
    getConfig: getConfig,
    getAllTypes: getAllTypes,
    hasType: hasType,
    getSummonsByBehavior: getSummonsByBehavior,
    getSummonsByAttackPattern: getSummonsByAttackPattern,
    createCustomConfig: createCustomConfig,
    getScaledStats: getScaledStats,
  };
})(window.VampireSurvivors.Data);
