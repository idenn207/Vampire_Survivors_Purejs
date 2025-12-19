/**
 * @fileoverview Weapon Aggregator - Merges individual weapon files into WeaponData
 * @module Data/Weapons/WeaponAggregator
 *
 * This file should be loaded AFTER all individual weapon files.
 * It merges weapons from WeaponRegistry into the main WeaponData object.
 */
(function (Data) {
  'use strict';

  // ============================================
  // Merge WeaponRegistry into WeaponData
  // ============================================

  // Ensure WeaponData exists
  var WeaponData = Data.WeaponData || {};
  var WeaponRegistry = Data.WeaponRegistry || {};

  // Count weapons by rarity for logging
  var rarityCount = {
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legacy: 0,
  };

  // Copy all registered weapons into WeaponData
  var registeredWeaponIds = Object.keys(WeaponRegistry);
  for (var i = 0; i < registeredWeaponIds.length; i++) {
    var weaponId = registeredWeaponIds[i];
    var weapon = WeaponRegistry[weaponId];

    // Don't overwrite existing weapons (legacy weapons take priority)
    if (!WeaponData[weaponId]) {
      WeaponData[weaponId] = weapon;

      // Track rarity counts
      if (weapon.rarity && rarityCount[weapon.rarity] !== undefined) {
        rarityCount[weapon.rarity]++;
      }
    }
  }

  // Count legacy weapons (weapons without rarity or already in WeaponData)
  var allWeaponIds = Object.keys(WeaponData);
  for (var j = 0; j < allWeaponIds.length; j++) {
    var id = allWeaponIds[j];
    var w = WeaponData[id];
    if (!w.rarity) {
      rarityCount.legacy++;
    }
  }

  // ============================================
  // Core Helper Functions (required by other systems)
  // ============================================

  /**
   * Get weapon data by ID
   * @param {string} weaponId
   * @returns {Object|null}
   */
  function getWeaponData(weaponId) {
    return WeaponData[weaponId] || null;
  }

  /**
   * Get all weapon IDs
   * @returns {Array<string>}
   */
  function getAllWeaponIds() {
    return Object.keys(WeaponData);
  }

  /**
   * Get all weapons of a specific attack type
   * @param {string} attackType
   * @returns {Array<Object>}
   */
  function getWeaponsByType(attackType) {
    var result = [];
    for (var id in WeaponData) {
      if (WeaponData.hasOwnProperty(id) && WeaponData[id].attackType === attackType) {
        result.push(WeaponData[id]);
      }
    }
    return result;
  }

  /**
   * Get all weapons of a specific tier
   * @param {number} tier - Tier number (1-5)
   * @returns {Array<Object>}
   */
  function getWeaponsByTier(tier) {
    var result = [];
    for (var id in WeaponData) {
      if (WeaponData.hasOwnProperty(id) && WeaponData[id].tier === tier) {
        result.push(WeaponData[id]);
      }
    }
    return result;
  }

  /**
   * Get all auto weapons
   * @returns {Array<Object>}
   */
  function getAutoWeapons() {
    var result = [];
    for (var id in WeaponData) {
      if (WeaponData.hasOwnProperty(id) && WeaponData[id].isAuto) {
        result.push(WeaponData[id]);
      }
    }
    return result;
  }

  /**
   * Get all manual weapons
   * @returns {Array<Object>}
   */
  function getManualWeapons() {
    var result = [];
    for (var id in WeaponData) {
      if (WeaponData.hasOwnProperty(id) && !WeaponData[id].isAuto) {
        result.push(WeaponData[id]);
      }
    }
    return result;
  }

  /**
   * Get all exclusive weapons (can reach Tier 5)
   * @returns {Array<Object>}
   */
  function getExclusiveWeapons() {
    var result = [];
    for (var id in WeaponData) {
      if (WeaponData.hasOwnProperty(id) && WeaponData[id].isExclusive) {
        result.push(WeaponData[id]);
      }
    }
    return result;
  }

  /**
   * Check if weapon can evolve to a specific tier
   * @param {string} weaponId
   * @param {number} targetTier
   * @returns {boolean}
   */
  function canWeaponEvolveToTier(weaponId, targetTier) {
    var weapon = WeaponData[weaponId];
    if (!weapon) return false;
    return targetTier <= weapon.maxTier;
  }

  /**
   * Get weapon IDs by tier
   * @param {number} tier - Tier number (1-5)
   * @returns {Array<string>}
   */
  function getWeaponIdsByTier(tier) {
    var result = [];
    for (var id in WeaponData) {
      if (WeaponData.hasOwnProperty(id) && WeaponData[id].tier === tier) {
        result.push(id);
      }
    }
    return result;
  }

  // ============================================
  // Export
  // ============================================
  Data.WeaponData = WeaponData;
  Data.getWeaponData = getWeaponData;
  Data.getAllWeaponIds = getAllWeaponIds;
  Data.getWeaponsByType = getWeaponsByType;
  Data.getWeaponsByTier = getWeaponsByTier;
  Data.getAutoWeapons = getAutoWeapons;
  Data.getManualWeapons = getManualWeapons;
  Data.getExclusiveWeapons = getExclusiveWeapons;
  Data.canWeaponEvolveToTier = canWeaponEvolveToTier;
  Data.getWeaponIdsByTier = getWeaponIdsByTier;

  // Log weapon aggregation summary
  console.log(
    '[WeaponAggregator] Loaded weapons: ' +
      rarityCount.common +
      ' Common, ' +
      rarityCount.uncommon +
      ' Uncommon, ' +
      rarityCount.rare +
      ' Rare, ' +
      rarityCount.epic +
      ' Epic, ' +
      rarityCount.legacy +
      ' Legacy. Total: ' +
      allWeaponIds.length
  );
})(window.VampireSurvivors.Data);
