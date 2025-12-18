/**
 * @fileoverview Weapon tier data - tier configurations and stat scaling
 * @module Data/WeaponTierData
 */
(function (Data) {
  'use strict';

  // ============================================
  // Constants
  // ============================================
  var MAX_STANDARD_TIER = 4;
  var MAX_EXCLUSIVE_TIER = 5;

  // ============================================
  // Tier Configuration
  // ============================================
  var TIER_CONFIG = {
    1: {
      name: 'Common',
      color: '#FFFFFF',
      borderColor: '#AAAAAA',
      icon: 'I',
      statMultiplier: 1.0,
    },
    2: {
      name: 'Uncommon',
      color: '#2ECC71',
      borderColor: '#27AE60',
      icon: 'II',
      statMultiplier: 1.3,
    },
    3: {
      name: 'Rare',
      color: '#3498DB',
      borderColor: '#2980B9',
      icon: 'III',
      statMultiplier: 1.6,
    },
    4: {
      name: 'Epic',
      color: '#9B59B6',
      borderColor: '#8E44AD',
      icon: 'IV',
      statMultiplier: 2.0,
    },
    5: {
      name: 'Legendary',
      color: '#F39C12',
      borderColor: '#E67E22',
      icon: 'V',
      statMultiplier: 2.5,
    },
  };

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get tier configuration
   * @param {number} tier - Tier number (1-5)
   * @returns {Object} Tier configuration
   */
  function getTierConfig(tier) {
    return TIER_CONFIG[tier] || TIER_CONFIG[1];
  }

  /**
   * Get tier display name
   * @param {number} tier - Tier number (1-5)
   * @returns {string} Tier name
   */
  function getTierName(tier) {
    var config = TIER_CONFIG[tier];
    return config ? config.name : 'Unknown';
  }

  /**
   * Get tier color
   * @param {number} tier - Tier number (1-5)
   * @returns {string} Hex color code
   */
  function getTierColor(tier) {
    var config = TIER_CONFIG[tier];
    return config ? config.color : '#FFFFFF';
  }

  /**
   * Get tier border color (slightly darker)
   * @param {number} tier - Tier number (1-5)
   * @returns {string} Hex color code
   */
  function getTierBorderColor(tier) {
    var config = TIER_CONFIG[tier];
    return config ? config.borderColor : '#AAAAAA';
  }

  /**
   * Get tier icon (Roman numeral)
   * @param {number} tier - Tier number (1-5)
   * @returns {string} Roman numeral
   */
  function getTierIcon(tier) {
    var config = TIER_CONFIG[tier];
    return config ? config.icon : 'I';
  }

  /**
   * Get tier stat multiplier
   * @param {number} tier - Tier number (1-5)
   * @returns {number} Multiplier value
   */
  function getTierStatMultiplier(tier) {
    var config = TIER_CONFIG[tier];
    return config ? config.statMultiplier : 1.0;
  }

  /**
   * Get maximum tier for standard weapons
   * @returns {number}
   */
  function getMaxStandardTier() {
    return MAX_STANDARD_TIER;
  }

  /**
   * Get maximum tier for exclusive weapons
   * @returns {number}
   */
  function getMaxExclusiveTier() {
    return MAX_EXCLUSIVE_TIER;
  }

  /**
   * Check if tier is valid
   * @param {number} tier - Tier number
   * @returns {boolean}
   */
  function isValidTier(tier) {
    return tier >= 1 && tier <= MAX_EXCLUSIVE_TIER;
  }

  /**
   * Get all tier numbers
   * @returns {Array<number>}
   */
  function getAllTiers() {
    return [1, 2, 3, 4, 5];
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.WeaponTierData = {
    TIER_CONFIG: TIER_CONFIG,
    MAX_STANDARD_TIER: MAX_STANDARD_TIER,
    MAX_EXCLUSIVE_TIER: MAX_EXCLUSIVE_TIER,
    getTierConfig: getTierConfig,
    getTierName: getTierName,
    getTierColor: getTierColor,
    getTierBorderColor: getTierBorderColor,
    getTierIcon: getTierIcon,
    getTierStatMultiplier: getTierStatMultiplier,
    getMaxStandardTier: getMaxStandardTier,
    getMaxExclusiveTier: getMaxExclusiveTier,
    isValidTier: isValidTier,
    getAllTiers: getAllTiers,
  };
})(window.VampireSurvivors.Data);
