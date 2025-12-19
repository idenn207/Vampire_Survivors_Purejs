/**
 * @fileoverview Constants for Evolved Weapons (unified tier system)
 * @module Data/Weapons/Evolved/Constants
 */
(function (Data) {
  'use strict';

  /**
   * Stat multipliers for each evolution tier
   * T1 (Common) = 1.0x, T2 (Uncommon) = 1.3x, T3 (Rare) = 1.6x, T4 (Epic) = 2.0x, T5 (Legendary) = 2.5x
   */
  var EVOLUTION_TIER_MULTIPLIERS = {
    1: 1.0,
    2: 1.3,
    3: 1.6,
    4: 2.0,
    5: 2.5,
  };

  /**
   * Tier names for display purposes
   */
  var EVOLUTION_TIER_NAMES = {
    1: 'Common',
    2: 'Uncommon',
    3: 'Rare',
    4: 'Epic',
    5: 'Legendary',
  };

  /**
   * Tier colors for UI display
   */
  var EVOLUTION_TIER_COLORS = {
    1: '#FFFFFF', // Common - White
    2: '#1EFF00', // Uncommon - Green
    3: '#0070DD', // Rare - Blue
    4: '#A335EE', // Epic - Purple
    5: '#FF8000', // Legendary - Orange
  };

  /**
   * Helper function to get tier multiplier
   * @param {number} tier - The tier level (1-5)
   * @returns {number} The stat multiplier for that tier
   */
  function getTierMultiplier(tier) {
    return EVOLUTION_TIER_MULTIPLIERS[tier] || 1.0;
  }

  /**
   * Helper function to get tier name
   * @param {number} tier - The tier level (1-5)
   * @returns {string} The tier name
   */
  function getTierName(tier) {
    return EVOLUTION_TIER_NAMES[tier] || 'Unknown';
  }

  /**
   * Helper function to get tier color
   * @param {number} tier - The tier level (1-5)
   * @returns {string} The tier color hex code
   */
  function getTierColor(tier) {
    return EVOLUTION_TIER_COLORS[tier] || '#FFFFFF';
  }

  /**
   * Helper function to calculate scaled stat
   * @param {number} baseStat - The base stat value
   * @param {number} tier - The tier level (1-5)
   * @returns {number} The scaled stat value (rounded)
   */
  function calculateScaledStat(baseStat, tier) {
    return Math.round(baseStat * getTierMultiplier(tier));
  }

  // Export constants and helpers
  Data.EvolvedConstants = {
    EVOLUTION_TIER_MULTIPLIERS: EVOLUTION_TIER_MULTIPLIERS,
    EVOLUTION_TIER_NAMES: EVOLUTION_TIER_NAMES,
    EVOLUTION_TIER_COLORS: EVOLUTION_TIER_COLORS,
    getTierMultiplier: getTierMultiplier,
    getTierName: getTierName,
    getTierColor: getTierColor,
    calculateScaledStat: calculateScaledStat,
  };

  // Backwards compatibility alias
  Data.CoreEvolvedConstants = Data.EvolvedConstants;
})(window.VampireSurvivors.Data);
