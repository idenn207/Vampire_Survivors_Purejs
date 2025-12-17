/**
 * @fileoverview Pickup configuration data - visual and behavior settings for pickups
 * @module Data/PickupConfig
 */
(function (Data) {
  'use strict';

  // ============================================
  // Pickup Configurations
  // ============================================
  var PICKUP_CONFIGS = {
    exp: {
      color: '#FFD700', // Gold/Yellow
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
   * Get configuration for a pickup type
   * @param {string} type - Pickup type ('exp', 'gold', 'health')
   * @returns {Object|null} Configuration object or null if not found
   */
  function getPickupConfig(type) {
    return PICKUP_CONFIGS[type] || null;
  }

  /**
   * Get all pickup types
   * @returns {Array<string>}
   */
  function getPickupTypes() {
    return Object.keys(PICKUP_CONFIGS);
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.PickupConfig = {
    PICKUP_CONFIGS: PICKUP_CONFIGS,
    getPickupConfig: getPickupConfig,
    getPickupTypes: getPickupTypes,
  };
})(window.VampireSurvivors.Data);
