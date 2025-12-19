/**
 * @fileoverview Stat upgrade data - configurations for gold-based stat upgrades
 * @module Data/StatUpgradeData
 */
(function (Data) {
  'use strict';

  // ============================================
  // Stat Configurations
  // ============================================
  var STAT_CONFIGS = {
    maxHealth: {
      id: 'maxHealth',
      name: 'Max Health',
      icon: '#E74C3C',
      imageId: 'stat_maxHealth',
      baseCost: 50,
      costMultiplier: 1.5,
      bonusPerLevel: 0.10,
      maxLevel: 10,
      description: '+10% Max HP',
      isPercent: true,
    },
    damage: {
      id: 'damage',
      name: 'Damage',
      icon: '#E67E22',
      imageId: 'stat_damage',
      baseCost: 75,
      costMultiplier: 1.5,
      bonusPerLevel: 0.10,
      maxLevel: 10,
      description: '+10% All Damage',
      isPercent: true,
    },
    moveSpeed: {
      id: 'moveSpeed',
      name: 'Move Speed',
      icon: '#3498DB',
      imageId: 'stat_moveSpeed',
      baseCost: 40,
      costMultiplier: 1.5,
      bonusPerLevel: 0.08,
      maxLevel: 10,
      description: '+8% Move Speed',
      isPercent: true,
    },
    critChance: {
      id: 'critChance',
      name: 'Crit Chance',
      icon: '#F1C40F',
      imageId: 'stat_critChance',
      baseCost: 100,
      costMultiplier: 1.5,
      bonusPerLevel: 0.05,
      maxLevel: 10,
      description: '+5% Crit Chance',
      isPercent: true,
      isFlat: true,
    },
    critDamage: {
      id: 'critDamage',
      name: 'Crit Damage',
      icon: '#9B59B6',
      imageId: 'stat_critDamage',
      baseCost: 80,
      costMultiplier: 1.5,
      bonusPerLevel: 0.15,
      maxLevel: 10,
      description: '+15% Crit Damage',
      isPercent: true,
    },
    pickupRange: {
      id: 'pickupRange',
      name: 'Pickup Range',
      icon: '#2ECC71',
      imageId: 'stat_pickupRange',
      baseCost: 30,
      costMultiplier: 1.5,
      bonusPerLevel: 0.15,
      maxLevel: 10,
      description: '+15% Pickup Range',
      isPercent: true,
    },
    xpGain: {
      id: 'xpGain',
      name: 'XP Gain',
      icon: '#1ABC9C',
      imageId: 'stat_xpGain',
      baseCost: 60,
      costMultiplier: 1.5,
      bonusPerLevel: 0.10,
      maxLevel: 10,
      description: '+10% XP Gain',
      isPercent: true,
    },
    range: {
      id: 'range',
      name: 'Range',
      icon: '#9B59B6',
      imageId: 'stat_range',
      baseCost: 60,
      costMultiplier: 1.5,
      bonusPerLevel: 0.08,
      maxLevel: 10,
      description: '+8% Weapon Range',
      isPercent: true,
    },
    cooldownReduction: {
      id: 'cooldownReduction',
      name: 'Cooldown',
      icon: '#1ABC9C',
      imageId: 'stat_cooldownReduction',
      baseCost: 80,
      costMultiplier: 1.5,
      bonusPerLevel: 0.05,
      maxLevel: 10,
      description: '-5% Cooldown',
      isPercent: true,
    },
    duration: {
      id: 'duration',
      name: 'Duration',
      icon: '#E67E22',
      imageId: 'stat_duration',
      baseCost: 50,
      costMultiplier: 1.5,
      bonusPerLevel: 0.10,
      maxLevel: 10,
      description: '+10% Effect Duration',
      isPercent: true,
    },
    luck: {
      id: 'luck',
      name: 'Luck',
      icon: '#27AE60',
      imageId: 'stat_luck',
      baseCost: 100,
      costMultiplier: 1.5,
      bonusPerLevel: 0.05,
      maxLevel: 10,
      description: '+5% Luck (Crits & Drops)',
      isPercent: true,
    },
  };

  // Order for display in UI
  var STAT_ORDER = [
    'maxHealth',
    'damage',
    'moveSpeed',
    'critChance',
    'critDamage',
    'pickupRange',
    'xpGain',
    'range',
    'cooldownReduction',
    'duration',
    'luck',
  ];

  // ============================================
  // Public API
  // ============================================
  /**
   * Get stat configuration by ID
   * @param {string} statId
   * @returns {Object|null}
   */
  function getStatConfig(statId) {
    return STAT_CONFIGS[statId] || null;
  }

  /**
   * Get all stat configurations
   * @returns {Object}
   */
  function getAllStatConfigs() {
    return STAT_CONFIGS;
  }

  /**
   * Get stat IDs in display order
   * @returns {Array<string>}
   */
  function getStatOrder() {
    return STAT_ORDER.slice();
  }

  /**
   * Calculate upgrade cost for a stat at a given level
   * @param {string} statId
   * @param {number} currentLevel
   * @returns {number}
   */
  function calculateUpgradeCost(statId, currentLevel) {
    var config = STAT_CONFIGS[statId];
    if (!config) return 0;

    return Math.floor(config.baseCost * Math.pow(config.costMultiplier, currentLevel));
  }

  /**
   * Calculate total bonus for a stat at a given level
   * @param {string} statId
   * @param {number} level
   * @returns {number}
   */
  function calculateBonus(statId, level) {
    var config = STAT_CONFIGS[statId];
    if (!config) return 0;

    return config.bonusPerLevel * level;
  }

  /**
   * Check if a stat is at max level
   * @param {string} statId
   * @param {number} level
   * @returns {boolean}
   */
  function isMaxLevel(statId, level) {
    var config = STAT_CONFIGS[statId];
    if (!config) return true;

    return level >= config.maxLevel;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.StatUpgradeData = {
    STAT_CONFIGS: STAT_CONFIGS,
    STAT_ORDER: STAT_ORDER,
    getStatConfig: getStatConfig,
    getAllStatConfigs: getAllStatConfigs,
    getStatOrder: getStatOrder,
    calculateUpgradeCost: calculateUpgradeCost,
    calculateBonus: calculateBonus,
    isMaxLevel: isMaxLevel,
  };
})(window.VampireSurvivors.Data);
