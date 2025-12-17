/**
 * @fileoverview Weapon evolution data - defines evolution recipes and evolved weapon stats
 * @module Data/WeaponEvolutionData
 */
(function (Data) {
  'use strict';

  // ============================================
  // Evolution Recipes
  // ============================================
  // Keys are sorted weapon IDs joined by '+', values are evolved weapon IDs
  var EVOLUTION_RECIPES = {
    'magic_missile+rifle': 'arcane_cannon',
    'auto_laser+laser_gun': 'death_ray',
    'auto_blade+sword_slash': 'blade_storm',
    'fire_zone+poison_cloud': 'toxic_inferno',
    'chain_lightning+rotating_blade': 'storm_blades',
    'magic_missile+shotgun': 'spread_seeker',
  };

  // ============================================
  // Evolved Weapon Definitions
  // ============================================
  var EVOLVED_WEAPONS = {
    arcane_cannon: {
      id: 'arcane_cannon',
      name: 'Arcane Cannon',
      attackType: 'projectile',
      targetingMode: 'nearest',
      damage: 50,
      cooldown: 0.8,
      projectileCount: 3,
      projectileSpeed: 400,
      projectileSize: 12,
      range: 500,
      maxLevel: 1,
      icon: 'arcane_cannon',
      isEvolved: true,
      upgrades: {},
    },
    death_ray: {
      id: 'death_ray',
      name: 'Death Ray',
      attackType: 'laser',
      targetingMode: 'nearest',
      damage: 15,
      cooldown: 0.05,
      range: 600,
      laserWidth: 12,
      maxLevel: 1,
      icon: 'death_ray',
      isEvolved: true,
      upgrades: {},
    },
    blade_storm: {
      id: 'blade_storm',
      name: 'Blade Storm',
      attackType: 'melee_swing',
      targetingMode: 'random',
      damage: 40,
      cooldown: 0.4,
      range: 120,
      arcAngle: 360,
      swingDuration: 0.2,
      maxLevel: 1,
      icon: 'blade_storm',
      isEvolved: true,
      upgrades: {},
    },
    toxic_inferno: {
      id: 'toxic_inferno',
      name: 'Toxic Inferno',
      attackType: 'area_damage',
      targetingMode: 'random',
      damage: 25,
      cooldown: 2.0,
      range: 300,
      areaRadius: 150,
      duration: 5.0,
      tickRate: 0.3,
      maxLevel: 1,
      icon: 'toxic_inferno',
      isEvolved: true,
      upgrades: {},
    },
    storm_blades: {
      id: 'storm_blades',
      name: 'Storm Blades',
      attackType: 'particle',
      targetingMode: 'orbit',
      damage: 20,
      cooldown: 0.1,
      particleCount: 6,
      orbitRadius: 120,
      orbitSpeed: 4.0,
      maxLevel: 1,
      icon: 'storm_blades',
      isEvolved: true,
      upgrades: {},
    },
    spread_seeker: {
      id: 'spread_seeker',
      name: 'Spread Seeker',
      attackType: 'projectile',
      targetingMode: 'nearest',
      damage: 25,
      cooldown: 1.0,
      projectileCount: 8,
      projectileSpeed: 350,
      projectileSize: 8,
      spread: 45,
      range: 400,
      maxLevel: 1,
      icon: 'spread_seeker',
      isEvolved: true,
      upgrades: {},
    },
  };

  // ============================================
  // Helper Functions
  // ============================================
  /**
   * Generate a consistent key from two weapon IDs (sorted alphabetically)
   * @param {string} weaponId1
   * @param {string} weaponId2
   * @returns {string}
   */
  function getEvolutionKey(weaponId1, weaponId2) {
    var sorted = [weaponId1, weaponId2].sort();
    return sorted[0] + '+' + sorted[1];
  }

  /**
   * Find an evolution recipe for two weapons
   * @param {string} weaponId1
   * @param {string} weaponId2
   * @returns {Object|null} Evolved weapon data or null if no recipe exists
   */
  function findEvolution(weaponId1, weaponId2) {
    var key = getEvolutionKey(weaponId1, weaponId2);
    var evolvedId = EVOLUTION_RECIPES[key];
    return evolvedId ? EVOLVED_WEAPONS[evolvedId] : null;
  }

  /**
   * Get evolved weapon data by ID
   * @param {string} evolvedId
   * @returns {Object|null}
   */
  function getEvolvedWeaponData(evolvedId) {
    return EVOLVED_WEAPONS[evolvedId] || null;
  }

  /**
   * Get all evolution recipes
   * @returns {Object}
   */
  function getAllEvolutionRecipes() {
    return EVOLUTION_RECIPES;
  }

  /**
   * Get all evolved weapons
   * @returns {Object}
   */
  function getAllEvolvedWeapons() {
    return EVOLVED_WEAPONS;
  }

  /**
   * Check if a weapon is an evolved weapon
   * @param {string} weaponId
   * @returns {boolean}
   */
  function isEvolvedWeapon(weaponId) {
    return EVOLVED_WEAPONS.hasOwnProperty(weaponId);
  }

  /**
   * Get the source weapons for an evolved weapon
   * @param {string} evolvedId
   * @returns {Array<string>|null} Array of two weapon IDs or null
   */
  function getSourceWeapons(evolvedId) {
    for (var key in EVOLUTION_RECIPES) {
      if (EVOLUTION_RECIPES[key] === evolvedId) {
        return key.split('+');
      }
    }
    return null;
  }

  /**
   * Get all weapons that can be combined with the given weapon for evolution
   * @param {string} weaponId - The weapon to find partners for
   * @returns {Array<string>} Array of weapon IDs that can combine with this weapon
   */
  function getEvolutionPartners(weaponId) {
    var partners = [];

    for (var key in EVOLUTION_RECIPES) {
      var parts = key.split('+');
      if (parts[0] === weaponId) {
        partners.push(parts[1]);
      } else if (parts[1] === weaponId) {
        partners.push(parts[0]);
      }
    }

    return partners;
  }

  /**
   * Check if a weapon can be used in any evolution recipe
   * @param {string} weaponId
   * @returns {boolean}
   */
  function canEvolve(weaponId) {
    return getEvolutionPartners(weaponId).length > 0;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.WeaponEvolutionData = {
    findEvolution: findEvolution,
    getEvolvedWeaponData: getEvolvedWeaponData,
    getEvolutionKey: getEvolutionKey,
    getAllEvolutionRecipes: getAllEvolutionRecipes,
    getAllEvolvedWeapons: getAllEvolvedWeapons,
    isEvolvedWeapon: isEvolvedWeapon,
    getSourceWeapons: getSourceWeapons,
    getEvolutionPartners: getEvolutionPartners,
    canEvolve: canEvolve,
  };
})(window.VampireSurvivors.Data);
