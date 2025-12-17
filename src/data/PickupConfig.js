/**
 * @fileoverview Pickup configuration data - visual and behavior settings for pickups
 * @module Data/PickupConfig
 */
(function (Data) {
  'use strict';

  // ============================================
  // XP Tier Thresholds
  // ============================================
  var XP_TIERS = {
    TIER_1: { min: 1, max: 9 },      // Small green
    TIER_2: { min: 10, max: 49 },    // Medium blue
    TIER_3: { min: 50, max: 199 },   // Large purple
    TIER_4: { min: 200, max: 9999 }, // Extra large gold (boss/elite only)
  };

  // ============================================
  // Pickup Configurations
  // ============================================
  var PICKUP_CONFIGS = {
    // XP Tier 1: Small green gems (1-9 XP, from normal enemies)
    exp_tier1: {
      color: '#2ECC71', // Green
      size: 6,
      magnetRadius: 80,
      magnetSpeed: 200,
    },
    // XP Tier 2: Medium blue gems (10-49 XP)
    exp_tier2: {
      color: '#3498DB', // Blue
      size: 10,
      magnetRadius: 100,
      magnetSpeed: 250,
    },
    // XP Tier 3: Large purple gems (50-199 XP)
    exp_tier3: {
      color: '#9B59B6', // Purple
      size: 14,
      magnetRadius: 120,
      magnetSpeed: 300,
    },
    // XP Tier 4: Extra large gold gems (200+ XP, from bosses/elites)
    exp_tier4: {
      color: '#F1C40F', // Gold
      size: 20,
      magnetRadius: 150,
      magnetSpeed: 350,
    },
    // Legacy exp config (fallback)
    exp: {
      color: '#2ECC71', // Green
      size: 8,
      magnetRadius: 100,
      magnetSpeed: 250,
    },
    gold: {
      color: '#FFA500', // Orange
      size: 10,
      magnetRadius: 80,
      magnetSpeed: 200,
    },
    health: {
      color: '#FF0066', // Pink-Red
      size: 12,
      magnetRadius: 60,
      magnetSpeed: 180,
    },
  };

  // ============================================
  // Public API
  // ============================================
  /**
   * Get XP tier based on value
   * @param {number} xpValue - The XP value
   * @returns {number} Tier number (1-4)
   */
  function getXPTier(xpValue) {
    if (xpValue >= XP_TIERS.TIER_4.min) return 4;
    if (xpValue >= XP_TIERS.TIER_3.min) return 3;
    if (xpValue >= XP_TIERS.TIER_2.min) return 2;
    return 1;
  }

  /**
   * Get configuration for a pickup type
   * @param {string} type - Pickup type ('exp', 'gold', 'health')
   * @param {number} value - Value (used for XP tier calculation)
   * @returns {Object|null} Configuration object or null if not found
   */
  function getPickupConfig(type, value) {
    // Handle XP tiers
    if (type === 'exp' && value !== undefined) {
      var tier = getXPTier(value);
      var tierConfig = PICKUP_CONFIGS['exp_tier' + tier];
      if (tierConfig) return tierConfig;
    }

    return PICKUP_CONFIGS[type] || null;
  }

  /**
   * Get all pickup types
   * @returns {Array<string>}
   */
  function getPickupTypes() {
    return ['exp', 'gold', 'health'];
  }

  /**
   * Get XP tier thresholds
   * @returns {Object}
   */
  function getXPTiers() {
    return XP_TIERS;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.PickupConfig = {
    PICKUP_CONFIGS: PICKUP_CONFIGS,
    XP_TIERS: XP_TIERS,
    getPickupConfig: getPickupConfig,
    getPickupTypes: getPickupTypes,
    getXPTier: getXPTier,
    getXPTiers: getXPTiers,
  };
})(window.VampireSurvivors.Data);
