/**
 * @fileoverview Aggregates all Evolved Weapons (basic + core) into Data.EvolvedWeaponData
 * @module Data/Weapons/Evolved/Aggregator
 */
(function (Data) {
  'use strict';

  // Initialize EvolvedWeaponData from EvolvedWeaponRegistry
  Data.EvolvedWeaponData = {};

  // Merge all weapons from EvolvedWeaponRegistry
  if (Data.EvolvedWeaponRegistry) {
    var keys = Object.keys(Data.EvolvedWeaponRegistry);
    for (var i = 0; i < keys.length; i++) {
      var weaponId = keys[i];
      Data.EvolvedWeaponData[weaponId] = Data.EvolvedWeaponRegistry[weaponId];
    }
  }

  /**
   * Get an evolved weapon by ID
   * @param {string} weaponId - The weapon ID
   * @returns {Object|null} The weapon data or null
   */
  Data.getEvolvedWeapon = function (weaponId) {
    return Data.EvolvedWeaponData[weaponId] || null;
  };

  /**
   * Check if a weapon is an evolved weapon
   * @param {string} weaponId - The weapon ID
   * @returns {boolean} True if it's an evolved weapon
   */
  Data.isEvolvedWeapon = function (weaponId) {
    return Data.EvolvedWeaponData.hasOwnProperty(weaponId);
  };

  /**
   * Get all evolved weapons for a specific core
   * @param {string} coreId - The core ID (e.g., 'fire_core')
   * @returns {Array} Array of weapon data objects
   */
  Data.getEvolvedWeaponsByCore = function (coreId) {
    var result = [];
    var keys = Object.keys(Data.EvolvedWeaponData);
    for (var i = 0; i < keys.length; i++) {
      var weapon = Data.EvolvedWeaponData[keys[i]];
      if (weapon.coreId === coreId) {
        result.push(weapon);
      }
    }
    return result;
  };

  /**
   * Get all evolved weapons at a specific tier
   * @param {number} tier - The tier level (2-5)
   * @returns {Array} Array of weapon data objects
   */
  Data.getEvolvedWeaponsByTier = function (tier) {
    var result = [];
    var keys = Object.keys(Data.EvolvedWeaponData);
    for (var i = 0; i < keys.length; i++) {
      var weapon = Data.EvolvedWeaponData[keys[i]];
      if (weapon.tier === tier) {
        result.push(weapon);
      }
    }
    return result;
  };

  /**
   * Get all basic evolved weapons (non-core)
   * @returns {Array} Array of weapon data objects
   */
  Data.getBasicEvolvedWeapons = function () {
    var result = [];
    var keys = Object.keys(Data.EvolvedWeaponData);
    for (var i = 0; i < keys.length; i++) {
      var weapon = Data.EvolvedWeaponData[keys[i]];
      if (!weapon.isCore) {
        result.push(weapon);
      }
    }
    return result;
  };

  /**
   * Get all core evolved weapons
   * @returns {Array} Array of weapon data objects
   */
  Data.getCoreEvolvedWeapons = function () {
    var result = [];
    var keys = Object.keys(Data.EvolvedWeaponData);
    for (var i = 0; i < keys.length; i++) {
      var weapon = Data.EvolvedWeaponData[keys[i]];
      if (weapon.isCore) {
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
  Data.getNextEvolution = function (weaponId) {
    var WeaponEvolutionData = Data.WeaponEvolutionData;
    if (!WeaponEvolutionData) return null;

    var recipes = WeaponEvolutionData.getAllEvolutionRecipes();
    for (var key in recipes) {
      var parts = key.split('+');
      if (parts[0] === weaponId) {
        var result = recipes[key].result;
        return Data.EvolvedWeaponData[result] || null;
      }
    }
    return null;
  };

  /**
   * Get the full evolution chain for a weapon
   * @param {string} weaponId - Any weapon ID in the chain (base or evolved)
   * @returns {Array} Array of weapon IDs in evolution order
   */
  Data.getFullEvolutionChain = function (weaponId) {
    var chain = [weaponId];
    var currentId = weaponId;
    var visited = {};

    // Walk up the chain to find the base weapon
    var WeaponEvolutionData = Data.WeaponEvolutionData;
    if (WeaponEvolutionData) {
      var recipes = WeaponEvolutionData.getAllEvolutionRecipes();

      // Find base weapon by checking if this weapon is a result
      var foundBase = true;
      while (foundBase) {
        foundBase = false;
        for (var key in recipes) {
          if (recipes[key].result === currentId) {
            var parts = key.split('+');
            if (!visited[parts[0]]) {
              visited[parts[0]] = true;
              chain.unshift(parts[0]);
              currentId = parts[0];
              foundBase = true;
              break;
            }
          }
        }
      }
    }

    // Walk down the chain to find all evolutions
    currentId = weaponId;
    visited = {};
    visited[weaponId] = true;

    if (WeaponEvolutionData) {
      var foundNext = true;
      while (foundNext) {
        foundNext = false;
        var recipes = WeaponEvolutionData.getAllEvolutionRecipes();
        for (var key in recipes) {
          var parts = key.split('+');
          if (parts[0] === currentId && !visited[recipes[key].result]) {
            visited[recipes[key].result] = true;
            chain.push(recipes[key].result);
            currentId = recipes[key].result;
            foundNext = true;
            break;
          }
        }
      }
    }

    return chain;
  };

  // Backwards compatibility aliases
  Data.CoreEvolvedData = Data.EvolvedWeaponData;
  Data.getCoreEvolvedWeapon = Data.getEvolvedWeapon;
  Data.isCoreEvolvedWeapon = function (weaponId) {
    var weapon = Data.EvolvedWeaponData[weaponId];
    return weapon ? weapon.isCore === true : false;
  };
  Data.getCoreEvolvedWeaponsByCore = Data.getEvolvedWeaponsByCore;
  Data.getCoreEvolvedWeaponsByTier = Data.getEvolvedWeaponsByTier;
  Data.getNextCoreEvolution = Data.getNextEvolution;

  console.log('[EvolvedAggregator] Loaded ' + Object.keys(Data.EvolvedWeaponData).length + ' evolved weapons');
})(window.VampireSurvivors.Data);
