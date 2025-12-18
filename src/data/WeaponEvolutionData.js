/**
 * @fileoverview Weapon evolution data - defines evolution recipes and evolved weapon stats
 * @module Data/WeaponEvolutionData
 */
(function (Data) {
  'use strict';

  // ============================================
  // Evolution Recipes
  // ============================================
  // Recipe structure with tier information
  // Keys are ORDERED: 'mainWeaponId+materialWeaponId' (order matters!)
  // The first weapon is the MAIN weapon, second is the MATERIAL weapon
  var EVOLUTION_RECIPES = {
    // Tier 1 -> Tier 2 recipes (known)
    // Format: 'main+material': { result, resultTier, isKnown }
    'magic_missile+rifle': {
      result: 'arcane_cannon',
      resultTier: 2,
      isKnown: true,
    },
    'laser_gun+auto_laser': {
      result: 'death_ray',
      resultTier: 2,
      isKnown: true,
    },
    'sword_slash+auto_blade': {
      result: 'blade_storm',
      resultTier: 2,
      isKnown: true,
    },
    'fire_zone+poison_cloud': {
      result: 'toxic_inferno',
      resultTier: 2,
      isKnown: true,
    },
    'rotating_blade+chain_lightning': {
      result: 'storm_blades',
      resultTier: 2,
      isKnown: true,
    },
    'shotgun+magic_missile': {
      result: 'spread_seeker',
      resultTier: 2,
      isKnown: true,
    },
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
      maxLevel: 5,
      icon: 'arcane_cannon',
      isEvolved: true,
      // Tier properties
      tier: 2,
      isExclusive: false,
      maxTier: 4,
      upgrades: {
        2: { damage: 65, projectileCount: 4 },
        3: { damage: 80, projectileSpeed: 450, range: 550 },
        4: { damage: 100, projectileCount: 5, cooldown: 0.7 },
        5: { damage: 130, projectileCount: 6, range: 600 },
      },
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
      maxLevel: 5,
      icon: 'death_ray',
      isEvolved: true,
      // Tier properties
      tier: 2,
      isExclusive: false,
      maxTier: 4,
      upgrades: {
        2: { damage: 20, laserWidth: 15 },
        3: { damage: 25, range: 700 },
        4: { damage: 32, laserWidth: 18, cooldown: 0.04 },
        5: { damage: 42, range: 800, laserWidth: 22 },
      },
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
      maxLevel: 5,
      icon: 'blade_storm',
      isEvolved: true,
      // Tier properties
      tier: 2,
      isExclusive: false,
      maxTier: 4,
      upgrades: {
        2: { damage: 52, range: 140 },
        3: { damage: 65, cooldown: 0.35 },
        4: { damage: 82, range: 160, swingDuration: 0.15 },
        5: { damage: 105, range: 180, cooldown: 0.3 },
      },
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
      maxLevel: 5,
      icon: 'toxic_inferno',
      isEvolved: true,
      // Tier properties
      tier: 2,
      isExclusive: false,
      maxTier: 4,
      upgrades: {
        2: { damage: 32, areaRadius: 170 },
        3: { damage: 40, duration: 6.0, tickRate: 0.25 },
        4: { damage: 52, areaRadius: 190, cooldown: 1.8 },
        5: { damage: 68, areaRadius: 220, duration: 7.0 },
      },
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
      maxLevel: 5,
      icon: 'storm_blades',
      isEvolved: true,
      // Tier properties
      tier: 2,
      isExclusive: false,
      maxTier: 4,
      upgrades: {
        2: { damage: 26, particleCount: 7 },
        3: { damage: 33, orbitRadius: 140, orbitSpeed: 4.5 },
        4: { damage: 42, particleCount: 8, cooldown: 0.08 },
        5: { damage: 55, particleCount: 10, orbitRadius: 160 },
      },
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
      maxLevel: 5,
      icon: 'spread_seeker',
      isEvolved: true,
      // Tier properties
      tier: 2,
      isExclusive: false,
      maxTier: 4,
      upgrades: {
        2: { damage: 32, projectileCount: 10 },
        3: { damage: 40, spread: 55, projectileSpeed: 380 },
        4: { damage: 52, projectileCount: 12, cooldown: 0.9 },
        5: { damage: 68, projectileCount: 15, spread: 65, range: 450 },
      },
    },
  };

  // ============================================
  // Helper Functions
  // ============================================
  /**
   * Generate an ordered key from main and material weapon IDs (order matters!)
   * @param {string} mainWeaponId - The main weapon ID
   * @param {string} materialWeaponId - The material weapon ID
   * @returns {string}
   */
  function getOrderedEvolutionKey(mainWeaponId, materialWeaponId) {
    return mainWeaponId + '+' + materialWeaponId;
  }

  /**
   * Generate a consistent key from two weapon IDs (sorted alphabetically)
   * @deprecated Use getOrderedEvolutionKey for recipe lookups
   * @param {string} weaponId1
   * @param {string} weaponId2
   * @returns {string}
   */
  function getEvolutionKey(weaponId1, weaponId2) {
    var sorted = [weaponId1, weaponId2].sort();
    return sorted[0] + '+' + sorted[1];
  }

  /**
   * Find an evolution recipe for two weapons (order matters!)
   * @param {string} mainWeaponId - The main weapon ID
   * @param {string} materialWeaponId - The material weapon ID
   * @returns {Object|null} Evolved weapon data or null if no recipe exists
   */
  function findEvolution(mainWeaponId, materialWeaponId) {
    var key = getOrderedEvolutionKey(mainWeaponId, materialWeaponId);
    var recipe = EVOLUTION_RECIPES[key];
    if (!recipe) return null;
    return EVOLVED_WEAPONS[recipe.result] || null;
  }

  /**
   * Find tier evolution result for two weapons (order matters!)
   * @param {string} mainWeaponId - The main weapon ID
   * @param {string} materialWeaponId - The material weapon ID
   * @param {number} currentTier - Current tier of the weapons
   * @returns {Object} { result: string|null, isKnown: boolean, resultTier: number, weaponData: Object|null }
   */
  function findTierEvolution(mainWeaponId, materialWeaponId, currentTier) {
    var key = getOrderedEvolutionKey(mainWeaponId, materialWeaponId);
    var nextTier = currentTier + 1;

    // Check for known recipe (order matters!)
    var recipe = EVOLUTION_RECIPES[key];
    if (recipe && recipe.isKnown) {
      var weaponData = EVOLVED_WEAPONS[recipe.result];
      return {
        result: recipe.result,
        isKnown: true,
        resultTier: recipe.resultTier || nextTier,
        weaponData: weaponData,
      };
    }

    // Unknown recipe (wrong order or no recipe exists)
    return {
      result: null,
      isKnown: false,
      resultTier: nextTier,
      weaponData: null,
    };
  }

  /**
   * Check if a recipe is known (order matters!)
   * @param {string} mainWeaponId - The main weapon ID
   * @param {string} materialWeaponId - The material weapon ID
   * @returns {boolean}
   */
  function isKnownRecipe(mainWeaponId, materialWeaponId) {
    var key = getOrderedEvolutionKey(mainWeaponId, materialWeaponId);
    var recipe = EVOLUTION_RECIPES[key];
    return recipe ? recipe.isKnown : false;
  }

  /**
   * Get a random weapon of specified tier that player doesn't own
   * @param {Array<string>} ownedWeaponIds - IDs of weapons player has
   * @param {number} targetTier - Tier to find weapon for
   * @returns {Object|null} Weapon data or null if none available
   */
  function getRandomUnownedWeaponOfTier(ownedWeaponIds, targetTier) {
    var Data = window.VampireSurvivors.Data;
    var allWeaponIds = Data.getAllWeaponIds();
    var candidates = [];

    // Check base weapons
    for (var i = 0; i < allWeaponIds.length; i++) {
      var weaponId = allWeaponIds[i];
      var weaponData = Data.getWeaponData(weaponId);

      // Skip if wrong tier
      if (weaponData.tier !== targetTier) continue;

      // Skip if already owned
      if (ownedWeaponIds.indexOf(weaponId) !== -1) continue;

      candidates.push(weaponData);
    }

    // Also check evolved weapons
    for (var evolvedId in EVOLVED_WEAPONS) {
      if (!EVOLVED_WEAPONS.hasOwnProperty(evolvedId)) continue;

      var evolvedData = EVOLVED_WEAPONS[evolvedId];

      // Skip if wrong tier
      if (evolvedData.tier !== targetTier) continue;

      // Skip if already owned
      if (ownedWeaponIds.indexOf(evolvedId) !== -1) continue;

      candidates.push(evolvedData);
    }

    if (candidates.length === 0) {
      // Fallback: return any weapon of that tier (even if owned)
      var fallbackCandidates = Data.getWeaponsByTier(targetTier);
      if (fallbackCandidates.length > 0) {
        return fallbackCandidates[Math.floor(Math.random() * fallbackCandidates.length)];
      }
      return null;
    }

    // Random selection
    var randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }

  /**
   * Get all weapons of a specific tier (including evolved)
   * @param {number} tier
   * @returns {Array<Object>}
   */
  function getAllWeaponsOfTier(tier) {
    var Data = window.VampireSurvivors.Data;
    var result = Data.getWeaponsByTier(tier).slice();

    // Add evolved weapons of this tier
    for (var evolvedId in EVOLVED_WEAPONS) {
      if (!EVOLVED_WEAPONS.hasOwnProperty(evolvedId)) continue;
      if (EVOLVED_WEAPONS[evolvedId].tier === tier) {
        result.push(EVOLVED_WEAPONS[evolvedId]);
      }
    }

    return result;
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
    findTierEvolution: findTierEvolution,
    isKnownRecipe: isKnownRecipe,
    getRandomUnownedWeaponOfTier: getRandomUnownedWeaponOfTier,
    getAllWeaponsOfTier: getAllWeaponsOfTier,
    getEvolvedWeaponData: getEvolvedWeaponData,
    getEvolutionKey: getEvolutionKey,
    getOrderedEvolutionKey: getOrderedEvolutionKey,
    getAllEvolutionRecipes: getAllEvolutionRecipes,
    getAllEvolvedWeapons: getAllEvolvedWeapons,
    isEvolvedWeapon: isEvolvedWeapon,
    getSourceWeapons: getSourceWeapons,
    getEvolutionPartners: getEvolutionPartners,
    canEvolve: canEvolve,
  };
})(window.VampireSurvivors.Data);
