/**
 * @fileoverview Constants for Core Evolved Weapons
 * @module Data/Weapons/CoreEvolved/Constants
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
   * Evolution chains mapping core IDs to their weapon progression
   */
  var CORE_EVOLUTION_CHAINS = {
    fire_core: {
      element: 'fire',
      weapons: ['inferno_bolt', 'inferno_surge', 'phoenix_storm', 'blazing_apocalypse', 'solar_annihilation'],
      materials: ['ember_field', 'fire_motes', 'fire_sprite', 'ragnarok'],
    },
    ice_core: {
      element: 'ice',
      weapons: ['frost_shard', 'glacial_spike', 'blizzard_lance', 'absolute_zero', 'eternal_winter'],
      materials: ['frost_circle', 'ice_shard', 'ice_bomb', 'eternal_winter_catalyst'],
    },
    lightning_core: {
      element: 'lightning',
      weapons: ['thunder_strike', 'storm_bolt', 'tempest_fury', 'lightning_god', 'thor_judgment'],
      materials: ['spark_chain', 'arc_lightning', 'cascade_bolt', 'thor_hammer'],
    },
    shadow_core: {
      element: 'shadow',
      weapons: ['shadow_blade', 'phantom_edge', 'nightmare_slash', 'void_assassin', 'oblivion_blade'],
      materials: ['shadow_pool', 'shadow_beam', 'phantom_blade', 'oblivion_crystal'],
    },
    blood_core: {
      element: 'blood',
      weapons: ['blood_scythe', 'crimson_reaper', 'soul_harvester', 'blood_lord', 'eternal_bloodlust'],
      materials: ['crimson_pulse', 'blood_drain', 'soul_reaper', 'eternal_bloodstone'],
    },
    arcane_core: {
      element: 'arcane',
      weapons: ['arcane_barrage', 'mystic_storm', 'arcane_tempest', 'reality_shatter', 'cosmic_weave'],
      materials: ['arcane_dart', 'spirit_wisps', 'mystic_orb', 'cosmic_catalyst'],
    },
    nature_core: {
      element: 'nature',
      weapons: ['venom_spore', 'toxic_bloom', 'plague_forest', 'nature_wrath', 'world_tree'],
      materials: ['poison_puddle', 'venom_fang', 'toxic_bloom_material', 'world_seed'],
    },
    steel_core: {
      element: 'steel',
      weapons: ['steel_hammer', 'iron_crusher', 'titan_maul', 'adamantine_breaker', 'mjolnir'],
      materials: ['cleaver', 'battle_axe', 'iron_maul', 'adamantine_core'],
    },
    wind_core: {
      element: 'wind',
      weapons: ['wind_cutter_core', 'gale_blade', 'hurricane_slash', 'storm_emperor', 'primordial_wind'],
      materials: ['wind_cutter', 'gale_slash', 'hurricane_disc', 'primordial_gust'],
    },
    earth_core: {
      element: 'earth',
      weapons: ['earth_spike', 'stone_cascade', 'tectonic_surge', 'earthquake', 'continental_drift'],
      materials: ['stone_throw', 'orbiting_stones', 'tectonic_shard', 'continental_heart'],
    },
    void_core: {
      element: 'void',
      weapons: ['void_rift', 'null_tear', 'dimension_rend', 'reality_collapse', 'void_god'],
      materials: ['gravity_well', 'null_tear_material', 'dimensional_crack', 'void_essence'],
    },
    holy_core: {
      element: 'holy',
      weapons: ['holy_lance', 'divine_spear', 'seraph_judgment', 'heaven_decree', 'god_light'],
      materials: ['holy_ground', 'light_ray', 'divine_beam', 'god_blessing'],
    },
    tech_core: {
      element: 'tech',
      weapons: ['tech_turret', 'auto_sentinel', 'siege_platform', 'war_machine', 'omega_protocol'],
      materials: ['spike_trap', 'flash_bomb', 'auto_sentinel_material', 'omega_chip'],
    },
    beast_core: {
      element: 'beast',
      weapons: ['beast_claw', 'feral_strike', 'alpha_predator', 'beast_king', 'primal_god'],
      materials: ['claw_strike', 'monks_fist', 'feral_fang', 'primal_totem'],
    },
    time_core: {
      element: 'time',
      weapons: ['chrono_beam', 'temporal_ray', 'time_distortion', 'chrono_master', 'eternity_weaver'],
      materials: ['time_pulse', 'temporal_shift', 'chrono_crystal', 'eternity_shard'],
    },
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
   * Helper function to get evolution chain for a core
   * @param {string} coreId - The core ID
   * @returns {Object|null} The evolution chain data or null
   */
  function getEvolutionChain(coreId) {
    return CORE_EVOLUTION_CHAINS[coreId] || null;
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
  Data.CoreEvolvedConstants = {
    EVOLUTION_TIER_MULTIPLIERS: EVOLUTION_TIER_MULTIPLIERS,
    EVOLUTION_TIER_NAMES: EVOLUTION_TIER_NAMES,
    EVOLUTION_TIER_COLORS: EVOLUTION_TIER_COLORS,
    CORE_EVOLUTION_CHAINS: CORE_EVOLUTION_CHAINS,
    getTierMultiplier: getTierMultiplier,
    getTierName: getTierName,
    getTierColor: getTierColor,
    getEvolutionChain: getEvolutionChain,
    calculateScaledStat: calculateScaledStat,
  };
})(window.VampireSurvivors.Data);
