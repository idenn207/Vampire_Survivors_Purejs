/**
 * @fileoverview Aggregates all Core Evolved Weapons into Data.CoreEvolvedData
 * @module Data/Weapons/CoreEvolved/Aggregator
 */
(function (Data) {
  'use strict';

  // Initialize CoreEvolvedData from CoreEvolvedRegistry
  Data.CoreEvolvedData = {};

  // Merge all weapons from CoreEvolvedRegistry
  if (Data.CoreEvolvedRegistry) {
    var keys = Object.keys(Data.CoreEvolvedRegistry);
    for (var i = 0; i < keys.length; i++) {
      var weaponId = keys[i];
      Data.CoreEvolvedData[weaponId] = Data.CoreEvolvedRegistry[weaponId];
    }
  }

  /**
   * Get a core evolved weapon by ID
   * @param {string} weaponId - The weapon ID
   * @returns {Object|null} The weapon data or null
   */
  Data.getCoreEvolvedWeapon = function (weaponId) {
    return Data.CoreEvolvedData[weaponId] || null;
  };

  /**
   * Check if a weapon is a core evolved weapon
   * @param {string} weaponId - The weapon ID
   * @returns {boolean} True if it's a core evolved weapon
   */
  Data.isCoreEvolvedWeapon = function (weaponId) {
    return Data.CoreEvolvedData.hasOwnProperty(weaponId);
  };

  /**
   * Get all core evolved weapons for a specific core
   * @param {string} coreId - The core ID (e.g., 'fire_core')
   * @returns {Array} Array of weapon data objects
   */
  Data.getCoreEvolvedWeaponsByCore = function (coreId) {
    var result = [];
    var keys = Object.keys(Data.CoreEvolvedData);
    for (var i = 0; i < keys.length; i++) {
      var weapon = Data.CoreEvolvedData[keys[i]];
      if (weapon.coreId === coreId) {
        result.push(weapon);
      }
    }
    return result;
  };

  /**
   * Get all core evolved weapons at a specific tier
   * @param {number} tier - The tier level (2-5)
   * @returns {Array} Array of weapon data objects
   */
  Data.getCoreEvolvedWeaponsByTier = function (tier) {
    var result = [];
    var keys = Object.keys(Data.CoreEvolvedData);
    for (var i = 0; i < keys.length; i++) {
      var weapon = Data.CoreEvolvedData[keys[i]];
      if (weapon.tier === tier) {
        result.push(weapon);
      }
    }
    return result;
  };

  /**
   * Get the next evolution in a weapon's chain
   * @param {string} weaponId - The current weapon ID
   * @returns {Object|null} The next evolved weapon data or null if at max tier
   */
  Data.getNextCoreEvolution = function (weaponId) {
    var Constants = Data.CoreEvolvedConstants;
    if (!Constants) return null;

    // First check if it's a T1 core weapon
    var CoreWeaponData = Data.CoreWeaponData;
    if (CoreWeaponData && CoreWeaponData[weaponId]) {
      var coreWeapon = CoreWeaponData[weaponId];
      var chain = Constants.getEvolutionChain(coreWeapon.coreId);
      if (chain && chain.weapons.length > 1) {
        return Data.CoreEvolvedData[chain.weapons[1]] || null;
      }
    }

    // Then check if it's an evolved core weapon
    var currentWeapon = Data.CoreEvolvedData[weaponId];
    if (!currentWeapon) return null;

    var evolutionChain = Constants.getEvolutionChain(currentWeapon.coreId);
    if (!evolutionChain) return null;

    var currentIndex = evolutionChain.weapons.indexOf(weaponId);
    if (currentIndex === -1 || currentIndex >= evolutionChain.weapons.length - 1) {
      return null; // At max tier or not found
    }

    var nextWeaponId = evolutionChain.weapons[currentIndex + 1];
    return Data.CoreEvolvedData[nextWeaponId] || null;
  };

  /**
   * Get the full evolution chain for a weapon
   * @param {string} weaponId - Any weapon ID in the chain (base or evolved)
   * @returns {Array} Array of weapon IDs in evolution order
   */
  Data.getFullEvolutionChain = function (weaponId) {
    var Constants = Data.CoreEvolvedConstants;
    if (!Constants) return [weaponId];

    // Check if it's a base core weapon
    var CoreWeaponData = Data.CoreWeaponData;
    if (CoreWeaponData && CoreWeaponData[weaponId]) {
      var chain = Constants.getEvolutionChain(CoreWeaponData[weaponId].coreId);
      return chain ? chain.weapons : [weaponId];
    }

    // Check if it's an evolved core weapon
    var evolvedWeapon = Data.CoreEvolvedData[weaponId];
    if (evolvedWeapon) {
      var evolutionChain = Constants.getEvolutionChain(evolvedWeapon.coreId);
      return evolutionChain ? evolutionChain.weapons : [weaponId];
    }

    return [weaponId];
  };

  console.log('[CoreEvolvedAggregator] Loaded ' + Object.keys(Data.CoreEvolvedData).length + ' core evolved weapons');
})(window.VampireSurvivors.Data);
