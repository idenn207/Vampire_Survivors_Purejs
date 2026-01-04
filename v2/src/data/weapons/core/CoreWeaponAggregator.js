/**
 * @fileoverview Core Weapon Aggregator - Merges all core weapons from registry
 * @module Data/Weapons/Core/CoreWeaponAggregator
 */
(function (Data) {
  'use strict';

  // ============================================
  // Aggregate Core Weapons from Registry
  // ============================================
  var CoreWeaponData = {};

  // Copy all core weapons from registry
  var registry = Data.CoreWeaponRegistry || {};
  for (var weaponId in registry) {
    if (registry.hasOwnProperty(weaponId)) {
      CoreWeaponData[weaponId] = registry[weaponId];
    }
  }

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get weapon data by ID
   * @param {string} weaponId
   * @returns {Object|null}
   */
  function getWeaponData(weaponId) {
    return CoreWeaponData[weaponId] || null;
  }

  /**
   * Get weapon data by core ID
   * @param {string} coreId
   * @returns {Object|null}
   */
  function getWeaponByCoreId(coreId) {
    for (var id in CoreWeaponData) {
      if (CoreWeaponData.hasOwnProperty(id) && CoreWeaponData[id].coreId === coreId) {
        return CoreWeaponData[id];
      }
    }
    return null;
  }

  /**
   * Get all core weapon IDs
   * @returns {Array<string>}
   */
  function getAllWeaponIds() {
    return Object.keys(CoreWeaponData);
  }

  /**
   * Check if a weapon is a core weapon
   * @param {string} weaponId
   * @returns {boolean}
   */
  function isCoreWeapon(weaponId) {
    return CoreWeaponData.hasOwnProperty(weaponId);
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.CoreWeaponData = CoreWeaponData;
  Data.getCoreWeaponData = getWeaponData;
  Data.getWeaponByCoreId = getWeaponByCoreId;
  Data.getAllCoreWeaponIds = getAllWeaponIds;
  Data.isCoreWeapon = isCoreWeapon;
})(window.VampireSurvivors.Data);
