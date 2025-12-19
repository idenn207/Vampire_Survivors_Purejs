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

    // ============================================
    // Core Weapon Evolution Recipes (60 recipes)
    // ============================================

    // Fire Core Evolution Chain
    'inferno_bolt+ember_field': { result: 'inferno_surge', resultTier: 2, isKnown: true },
    'inferno_surge+fire_motes': { result: 'phoenix_storm', resultTier: 3, isKnown: true },
    'phoenix_storm+fire_sprite': { result: 'blazing_apocalypse', resultTier: 4, isKnown: true },
    'blazing_apocalypse+ragnarok': { result: 'solar_annihilation', resultTier: 5, isKnown: true },

    // Ice Core Evolution Chain
    'frost_shard+frost_circle': { result: 'glacial_spike', resultTier: 2, isKnown: true },
    'glacial_spike+ice_shard': { result: 'blizzard_lance', resultTier: 3, isKnown: true },
    'blizzard_lance+ice_bomb': { result: 'absolute_zero', resultTier: 4, isKnown: true },
    'absolute_zero+eternal_winter_catalyst': { result: 'eternal_winter', resultTier: 5, isKnown: true },

    // Lightning Core Evolution Chain
    'thunder_strike+spark_chain': { result: 'storm_bolt', resultTier: 2, isKnown: true },
    'storm_bolt+arc_lightning': { result: 'tempest_fury', resultTier: 3, isKnown: true },
    'tempest_fury+cascade_bolt': { result: 'lightning_god', resultTier: 4, isKnown: true },
    'lightning_god+thor_hammer': { result: 'thor_judgment', resultTier: 5, isKnown: true },

    // Shadow Core Evolution Chain
    'shadow_blade+shadow_pool': { result: 'phantom_edge', resultTier: 2, isKnown: true },
    'phantom_edge+shadow_beam': { result: 'nightmare_slash', resultTier: 3, isKnown: true },
    'nightmare_slash+phantom_blade': { result: 'void_assassin', resultTier: 4, isKnown: true },
    'void_assassin+oblivion_crystal': { result: 'oblivion_blade', resultTier: 5, isKnown: true },

    // Blood Core Evolution Chain
    'blood_scythe+crimson_pulse': { result: 'crimson_reaper', resultTier: 2, isKnown: true },
    'crimson_reaper+blood_drain': { result: 'soul_harvester', resultTier: 3, isKnown: true },
    'soul_harvester+soul_reaper': { result: 'blood_lord', resultTier: 4, isKnown: true },
    'blood_lord+eternal_bloodstone': { result: 'eternal_bloodlust', resultTier: 5, isKnown: true },

    // Arcane Core Evolution Chain
    'arcane_barrage+arcane_dart': { result: 'mystic_storm', resultTier: 2, isKnown: true },
    'mystic_storm+spirit_wisps': { result: 'arcane_tempest', resultTier: 3, isKnown: true },
    'arcane_tempest+mystic_orb': { result: 'reality_shatter', resultTier: 4, isKnown: true },
    'reality_shatter+cosmic_catalyst': { result: 'cosmic_weave', resultTier: 5, isKnown: true },

    // Nature Core Evolution Chain
    'venom_spore+poison_puddle': { result: 'toxic_bloom', resultTier: 2, isKnown: true },
    'toxic_bloom+venom_fang': { result: 'plague_forest', resultTier: 3, isKnown: true },
    'plague_forest+toxic_bloom_material': { result: 'nature_wrath', resultTier: 4, isKnown: true },
    'nature_wrath+world_seed': { result: 'world_tree', resultTier: 5, isKnown: true },

    // Steel Core Evolution Chain
    'steel_hammer+cleaver': { result: 'iron_crusher', resultTier: 2, isKnown: true },
    'iron_crusher+battle_axe': { result: 'titan_maul', resultTier: 3, isKnown: true },
    'titan_maul+iron_maul': { result: 'adamantine_breaker', resultTier: 4, isKnown: true },
    'adamantine_breaker+adamantine_core': { result: 'mjolnir', resultTier: 5, isKnown: true },

    // Wind Core Evolution Chain
    'wind_cutter_core+wind_cutter': { result: 'gale_blade', resultTier: 2, isKnown: true },
    'gale_blade+gale_slash': { result: 'hurricane_slash', resultTier: 3, isKnown: true },
    'hurricane_slash+hurricane_disc': { result: 'storm_emperor', resultTier: 4, isKnown: true },
    'storm_emperor+primordial_gust': { result: 'primordial_wind', resultTier: 5, isKnown: true },

    // Earth Core Evolution Chain
    'earth_spike+stone_throw': { result: 'stone_cascade', resultTier: 2, isKnown: true },
    'stone_cascade+orbiting_stones': { result: 'tectonic_surge', resultTier: 3, isKnown: true },
    'tectonic_surge+tectonic_shard': { result: 'earthquake', resultTier: 4, isKnown: true },
    'earthquake+continental_heart': { result: 'continental_drift', resultTier: 5, isKnown: true },

    // Void Core Evolution Chain
    'void_rift+gravity_well': { result: 'null_tear', resultTier: 2, isKnown: true },
    'null_tear+null_tear_material': { result: 'dimension_rend', resultTier: 3, isKnown: true },
    'dimension_rend+dimensional_crack': { result: 'reality_collapse', resultTier: 4, isKnown: true },
    'reality_collapse+void_essence': { result: 'void_god', resultTier: 5, isKnown: true },

    // Holy Core Evolution Chain
    'holy_lance+holy_ground': { result: 'divine_spear', resultTier: 2, isKnown: true },
    'divine_spear+light_ray': { result: 'seraph_judgment', resultTier: 3, isKnown: true },
    'seraph_judgment+divine_beam': { result: 'heaven_decree', resultTier: 4, isKnown: true },
    'heaven_decree+god_blessing': { result: 'god_light', resultTier: 5, isKnown: true },

    // Tech Core Evolution Chain
    'tech_turret+spike_trap': { result: 'auto_sentinel', resultTier: 2, isKnown: true },
    'auto_sentinel+flash_bomb': { result: 'siege_platform', resultTier: 3, isKnown: true },
    'siege_platform+auto_sentinel_material': { result: 'war_machine', resultTier: 4, isKnown: true },
    'war_machine+omega_chip': { result: 'omega_protocol', resultTier: 5, isKnown: true },

    // Beast Core Evolution Chain
    'beast_claw+claw_strike': { result: 'feral_strike', resultTier: 2, isKnown: true },
    'feral_strike+monks_fist': { result: 'alpha_predator', resultTier: 3, isKnown: true },
    'alpha_predator+feral_fang': { result: 'beast_king', resultTier: 4, isKnown: true },
    'beast_king+primal_totem': { result: 'primal_god', resultTier: 5, isKnown: true },

    // Time Core Evolution Chain
    'chrono_beam+time_pulse': { result: 'temporal_ray', resultTier: 2, isKnown: true },
    'temporal_ray+temporal_shift': { result: 'time_distortion', resultTier: 3, isKnown: true },
    'time_distortion+chrono_crystal': { result: 'chrono_master', resultTier: 4, isKnown: true },
    'chrono_master+eternity_shard': { result: 'eternity_weaver', resultTier: 5, isKnown: true },
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
    return getEvolvedWeaponData(recipe.result);
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
      var weaponData = getEvolvedWeaponData(recipe.result);
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

    // Also check evolved weapons from unified registry
    var EvolvedWeaponData = window.VampireSurvivors.Data.EvolvedWeaponData;
    if (EvolvedWeaponData) {
      for (var evolvedId in EvolvedWeaponData) {
        if (!EvolvedWeaponData.hasOwnProperty(evolvedId)) continue;

        var evolvedData = EvolvedWeaponData[evolvedId];

        // Skip if wrong tier
        if (evolvedData.tier !== targetTier) continue;

        // Skip if already owned
        if (ownedWeaponIds.indexOf(evolvedId) !== -1) continue;

        candidates.push(evolvedData);
      }
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

    // Add evolved weapons of this tier from unified registry
    var EvolvedWeaponData = Data.EvolvedWeaponData;
    if (EvolvedWeaponData) {
      for (var evolvedId in EvolvedWeaponData) {
        if (!EvolvedWeaponData.hasOwnProperty(evolvedId)) continue;
        if (EvolvedWeaponData[evolvedId].tier === tier) {
          result.push(EvolvedWeaponData[evolvedId]);
        }
      }
    }

    return result;
  }

  /**
   * Get evolved weapon data by ID from unified registry
   * @param {string} evolvedId
   * @returns {Object|null}
   */
  function getEvolvedWeaponData(evolvedId) {
    var EvolvedWeaponData = window.VampireSurvivors.Data.EvolvedWeaponData;
    if (EvolvedWeaponData && EvolvedWeaponData[evolvedId]) {
      return EvolvedWeaponData[evolvedId];
    }
    return null;
  }

  /**
   * Check if a weapon is a core evolved weapon
   * @param {string} weaponId
   * @returns {boolean}
   */
  function isCoreEvolution(weaponId) {
    var EvolvedWeaponData = window.VampireSurvivors.Data.EvolvedWeaponData;
    if (!EvolvedWeaponData) return false;
    var weapon = EvolvedWeaponData[weaponId];
    return weapon ? weapon.isCore === true : false;
  }

  /**
   * Get all evolution recipes
   * @returns {Object}
   */
  function getAllEvolutionRecipes() {
    return EVOLUTION_RECIPES;
  }

  /**
   * Get all evolved weapons from unified registry
   * @returns {Object}
   */
  function getAllEvolvedWeapons() {
    return window.VampireSurvivors.Data.EvolvedWeaponData || {};
  }

  /**
   * Check if a weapon is an evolved weapon
   * @param {string} weaponId
   * @returns {boolean}
   */
  function isEvolvedWeapon(weaponId) {
    var EvolvedWeaponData = window.VampireSurvivors.Data.EvolvedWeaponData;
    if (EvolvedWeaponData && EvolvedWeaponData.hasOwnProperty(weaponId)) return true;
    return false;
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

  /**
   * Check if a weapon is a core weapon (from CoreWeaponData)
   * Core weapons can only evolve via recipes, not random evolution
   * @param {string} weaponId
   * @returns {boolean}
   */
  function isCoreWeapon(weaponId) {
    var CoreWeaponData = window.VampireSurvivors.Data.CoreWeaponData;
    if (!CoreWeaponData) return false;
    return CoreWeaponData.hasOwnProperty(weaponId);
  }

  /**
   * Check if a weapon can be used as evolution material
   * Core weapons CANNOT be used as material - only as main weapon
   * @param {string} weaponId
   * @returns {boolean}
   */
  function canBeUsedAsMaterial(weaponId) {
    // Core weapons cannot be used as materials
    return !isCoreWeapon(weaponId);
  }

  /**
   * Check if a weapon can undergo random evolution (unknown recipe)
   * Core weapons can ONLY evolve via known recipes
   * @param {string} mainWeaponId
   * @param {string} materialWeaponId
   * @returns {boolean}
   */
  function canDoRandomEvolution(mainWeaponId, materialWeaponId) {
    // If main weapon is a core weapon, it must use a known recipe
    if (isCoreWeapon(mainWeaponId)) {
      return isKnownRecipe(mainWeaponId, materialWeaponId);
    }
    // Non-core weapons can do random evolution
    return true;
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
    isCoreWeapon: isCoreWeapon,
    isCoreEvolution: isCoreEvolution,
    canBeUsedAsMaterial: canBeUsedAsMaterial,
    canDoRandomEvolution: canDoRandomEvolution,
  };
})(window.VampireSurvivors.Data);
