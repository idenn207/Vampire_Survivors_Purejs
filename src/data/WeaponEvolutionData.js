/**
 * @fileoverview Weapon evolution data - defines evolution recipes and evolved weapon stats
 * @module Data/WeaponEvolutionData
 */
(function (Data) {
  'use strict';

  // ============================================
  // Evolution Chain Metadata (Centralized)
  // ============================================
  // Maps evolved weapon IDs to their chain metadata
  // This replaces the per-weapon evolution metadata
  var EVOLUTION_CHAIN_METADATA = {
    // Fire Core Evolution Chain
    inferno_surge: { coreId: 'fire_core', baseWeaponId: 'inferno_bolt', evolutionChain: 'fire', isCore: true },
    phoenix_storm: { coreId: 'fire_core', baseWeaponId: 'inferno_bolt', evolutionChain: 'fire', isCore: true },
    blazing_apocalypse: { coreId: 'fire_core', baseWeaponId: 'inferno_bolt', evolutionChain: 'fire', isCore: true },
    solar_annihilation: { coreId: 'fire_core', baseWeaponId: 'inferno_bolt', evolutionChain: 'fire', isCore: true },

    // Ice Core Evolution Chain
    glacial_spike: { coreId: 'ice_core', baseWeaponId: 'frost_shard', evolutionChain: 'ice', isCore: true },
    blizzard_lance: { coreId: 'ice_core', baseWeaponId: 'frost_shard', evolutionChain: 'ice', isCore: true },
    absolute_zero: { coreId: 'ice_core', baseWeaponId: 'frost_shard', evolutionChain: 'ice', isCore: true },
    eternal_winter: { coreId: 'ice_core', baseWeaponId: 'frost_shard', evolutionChain: 'ice', isCore: true },

    // Lightning Core Evolution Chain
    storm_bolt: { coreId: 'lightning_core', baseWeaponId: 'thunder_strike', evolutionChain: 'lightning', isCore: true },
    tempest_fury: { coreId: 'lightning_core', baseWeaponId: 'thunder_strike', evolutionChain: 'lightning', isCore: true },
    lightning_god: { coreId: 'lightning_core', baseWeaponId: 'thunder_strike', evolutionChain: 'lightning', isCore: true },
    thor_judgment: { coreId: 'lightning_core', baseWeaponId: 'thunder_strike', evolutionChain: 'lightning', isCore: true },

    // Shadow Core Evolution Chain
    phantom_edge: { coreId: 'shadow_core', baseWeaponId: 'shadow_blade', evolutionChain: 'shadow', isCore: true },
    nightmare_slash: { coreId: 'shadow_core', baseWeaponId: 'shadow_blade', evolutionChain: 'shadow', isCore: true },
    void_assassin: { coreId: 'shadow_core', baseWeaponId: 'shadow_blade', evolutionChain: 'shadow', isCore: true },
    oblivion_blade: { coreId: 'shadow_core', baseWeaponId: 'shadow_blade', evolutionChain: 'shadow', isCore: true },

    // Blood Core Evolution Chain
    crimson_reaper: { coreId: 'blood_core', baseWeaponId: 'blood_scythe', evolutionChain: 'blood', isCore: true },
    soul_harvester: { coreId: 'blood_core', baseWeaponId: 'blood_scythe', evolutionChain: 'blood', isCore: true },
    blood_lord: { coreId: 'blood_core', baseWeaponId: 'blood_scythe', evolutionChain: 'blood', isCore: true },
    eternal_bloodlust: { coreId: 'blood_core', baseWeaponId: 'blood_scythe', evolutionChain: 'blood', isCore: true },

    // Arcane Core Evolution Chain
    mystic_storm: { coreId: 'arcane_core', baseWeaponId: 'arcane_barrage', evolutionChain: 'arcane', isCore: true },
    arcane_tempest: { coreId: 'arcane_core', baseWeaponId: 'arcane_barrage', evolutionChain: 'arcane', isCore: true },
    reality_shatter: { coreId: 'arcane_core', baseWeaponId: 'arcane_barrage', evolutionChain: 'arcane', isCore: true },
    cosmic_weave: { coreId: 'arcane_core', baseWeaponId: 'arcane_barrage', evolutionChain: 'arcane', isCore: true },

    // Nature Core Evolution Chain
    toxic_bloom: { coreId: 'nature_core', baseWeaponId: 'venom_spore', evolutionChain: 'nature', isCore: true },
    plague_forest: { coreId: 'nature_core', baseWeaponId: 'venom_spore', evolutionChain: 'nature', isCore: true },
    nature_wrath: { coreId: 'nature_core', baseWeaponId: 'venom_spore', evolutionChain: 'nature', isCore: true },
    world_tree: { coreId: 'nature_core', baseWeaponId: 'venom_spore', evolutionChain: 'nature', isCore: true },

    // Steel Core Evolution Chain
    iron_crusher: { coreId: 'steel_core', baseWeaponId: 'steel_hammer', evolutionChain: 'steel', isCore: true },
    titan_maul: { coreId: 'steel_core', baseWeaponId: 'steel_hammer', evolutionChain: 'steel', isCore: true },
    adamantine_breaker: { coreId: 'steel_core', baseWeaponId: 'steel_hammer', evolutionChain: 'steel', isCore: true },
    mjolnir: { coreId: 'steel_core', baseWeaponId: 'steel_hammer', evolutionChain: 'steel', isCore: true },

    // Wind Core Evolution Chain
    gale_blade: { coreId: 'wind_core', baseWeaponId: 'wind_cutter_core', evolutionChain: 'wind', isCore: true },
    hurricane_slash: { coreId: 'wind_core', baseWeaponId: 'wind_cutter_core', evolutionChain: 'wind', isCore: true },
    storm_emperor: { coreId: 'wind_core', baseWeaponId: 'wind_cutter_core', evolutionChain: 'wind', isCore: true },
    primordial_wind: { coreId: 'wind_core', baseWeaponId: 'wind_cutter_core', evolutionChain: 'wind', isCore: true },

    // Earth Core Evolution Chain
    stone_cascade: { coreId: 'earth_core', baseWeaponId: 'earth_spike', evolutionChain: 'earth', isCore: true },
    tectonic_surge: { coreId: 'earth_core', baseWeaponId: 'earth_spike', evolutionChain: 'earth', isCore: true },
    earthquake: { coreId: 'earth_core', baseWeaponId: 'earth_spike', evolutionChain: 'earth', isCore: true },
    continental_drift: { coreId: 'earth_core', baseWeaponId: 'earth_spike', evolutionChain: 'earth', isCore: true },

    // Void Core Evolution Chain
    null_tear: { coreId: 'void_core', baseWeaponId: 'void_rift', evolutionChain: 'void', isCore: true },
    dimension_rend: { coreId: 'void_core', baseWeaponId: 'void_rift', evolutionChain: 'void', isCore: true },
    reality_collapse: { coreId: 'void_core', baseWeaponId: 'void_rift', evolutionChain: 'void', isCore: true },
    void_god: { coreId: 'void_core', baseWeaponId: 'void_rift', evolutionChain: 'void', isCore: true },

    // Holy Core Evolution Chain
    divine_spear: { coreId: 'holy_core', baseWeaponId: 'holy_lance', evolutionChain: 'holy', isCore: true },
    seraph_judgment: { coreId: 'holy_core', baseWeaponId: 'holy_lance', evolutionChain: 'holy', isCore: true },
    heaven_decree: { coreId: 'holy_core', baseWeaponId: 'holy_lance', evolutionChain: 'holy', isCore: true },
    god_light: { coreId: 'holy_core', baseWeaponId: 'holy_lance', evolutionChain: 'holy', isCore: true },

    // Tech Core Evolution Chain
    auto_sentinel: { coreId: 'tech_core', baseWeaponId: 'tech_turret', evolutionChain: 'tech', isCore: true },
    siege_platform: { coreId: 'tech_core', baseWeaponId: 'tech_turret', evolutionChain: 'tech', isCore: true },
    war_machine: { coreId: 'tech_core', baseWeaponId: 'tech_turret', evolutionChain: 'tech', isCore: true },
    omega_protocol: { coreId: 'tech_core', baseWeaponId: 'tech_turret', evolutionChain: 'tech', isCore: true },

    // Beast Core Evolution Chain
    feral_strike: { coreId: 'beast_core', baseWeaponId: 'beast_claw', evolutionChain: 'beast', isCore: true },
    alpha_predator: { coreId: 'beast_core', baseWeaponId: 'beast_claw', evolutionChain: 'beast', isCore: true },
    beast_king: { coreId: 'beast_core', baseWeaponId: 'beast_claw', evolutionChain: 'beast', isCore: true },
    primal_god: { coreId: 'beast_core', baseWeaponId: 'beast_claw', evolutionChain: 'beast', isCore: true },

    // Time Core Evolution Chain
    temporal_ray: { coreId: 'time_core', baseWeaponId: 'chrono_beam', evolutionChain: 'time', isCore: true },
    time_distortion: { coreId: 'time_core', baseWeaponId: 'chrono_beam', evolutionChain: 'time', isCore: true },
    chrono_master: { coreId: 'time_core', baseWeaponId: 'chrono_beam', evolutionChain: 'time', isCore: true },
    eternity_weaver: { coreId: 'time_core', baseWeaponId: 'chrono_beam', evolutionChain: 'time', isCore: true },

    // Uncommon Evolved Weapons (Tier 2, non-core)
    arcane_cannon: { coreId: null, baseWeaponId: 'arcane_dart', evolutionChain: null, isCore: false },
    death_ray: { coreId: null, baseWeaponId: 'light_ray', evolutionChain: null, isCore: false },
    blade_storm: { coreId: null, baseWeaponId: 'rusty_blade', evolutionChain: null, isCore: false },
    toxic_inferno: { coreId: null, baseWeaponId: 'poison_puddle', evolutionChain: null, isCore: false },
    storm_blades: { coreId: null, baseWeaponId: 'chakram', evolutionChain: null, isCore: false },
    spread_seeker: { coreId: null, baseWeaponId: 'scatter_shot', evolutionChain: null, isCore: false },
    blood_cleaver: { coreId: null, baseWeaponId: 'rusty_blade', evolutionChain: null, isCore: false },
    blazing_bolt: { coreId: null, baseWeaponId: 'ember_bolt', evolutionChain: null, isCore: false },
    frozen_burst: { coreId: null, baseWeaponId: 'ice_shard', evolutionChain: null, isCore: false },
    phantom_volley: { coreId: null, baseWeaponId: 'spectral_arrow', evolutionChain: null, isCore: false },
    storm_scatter: { coreId: null, baseWeaponId: 'scatter_shot', evolutionChain: null, isCore: false },
    venomous_surge: { coreId: null, baseWeaponId: 'venom_fang', evolutionChain: null, isCore: false },
    primal_strike: { coreId: null, baseWeaponId: 'monks_fist', evolutionChain: null, isCore: false },
    berserker_blade: { coreId: null, baseWeaponId: 'battle_axe', evolutionChain: null, isCore: false },
    lightning_lash: { coreId: null, baseWeaponId: 'whip_lash', evolutionChain: null, isCore: false },
    mystic_arrow: { coreId: null, baseWeaponId: 'arcane_dart', evolutionChain: null, isCore: false },
    umbral_wave: { coreId: null, baseWeaponId: 'shadow_beam', evolutionChain: null, isCore: false },
    radiant_ground: { coreId: null, baseWeaponId: 'holy_ground', evolutionChain: null, isCore: false },
    explosive_trap: { coreId: null, baseWeaponId: 'spike_trap', evolutionChain: null, isCore: false },
    rock_storm: { coreId: null, baseWeaponId: 'orbiting_stones', evolutionChain: null, isCore: false },
    undead_legion: { coreId: null, baseWeaponId: 'skeleton_minion', evolutionChain: null, isCore: false },
    elemental_clash: { coreId: null, baseWeaponId: 'frost_circle', evolutionChain: null, isCore: false },
    inferno_swarm: { coreId: null, baseWeaponId: 'ember_field', evolutionChain: null, isCore: false },
    arcane_scatter: { coreId: null, baseWeaponId: 'scatter_shot', evolutionChain: null, isCore: false },

    // Rare Evolved Weapons (Tier 3, non-core)
    constellation_arrow: { coreId: null, baseWeaponId: 'mystic_arrow', evolutionChain: null, isCore: false },
    singularity_orb: { coreId: null, baseWeaponId: 'arcane_cannon', evolutionChain: null, isCore: false },
    phoenix_feather: { coreId: null, baseWeaponId: 'blazing_bolt', evolutionChain: null, isCore: false },
    temporal_bolt: { coreId: null, baseWeaponId: 'death_ray', evolutionChain: null, isCore: false },
    dragonbreath_volley: { coreId: null, baseWeaponId: 'inferno_swarm', evolutionChain: null, isCore: false },
    void_reaver: { coreId: null, baseWeaponId: 'umbral_wave', evolutionChain: null, isCore: false },
    storm_caller: { coreId: null, baseWeaponId: 'lightning_lash', evolutionChain: null, isCore: false },
    mirrorblade: { coreId: null, baseWeaponId: 'blade_storm', evolutionChain: null, isCore: false },
    soulrender: { coreId: null, baseWeaponId: 'blood_cleaver', evolutionChain: null, isCore: false },
    aurora_field: { coreId: null, baseWeaponId: 'elemental_clash', evolutionChain: null, isCore: false },
    dimensional_rift: { coreId: null, baseWeaponId: 'arcane_scatter', evolutionChain: null, isCore: false },
    supernova_core: { coreId: null, baseWeaponId: 'blazing_bolt', evolutionChain: null, isCore: false },
    celestial_orbit: { coreId: null, baseWeaponId: 'rock_storm', evolutionChain: null, isCore: false },
    cascade_lightning: { coreId: null, baseWeaponId: 'storm_scatter', evolutionChain: null, isCore: false },
    orbital_bombardment: { coreId: null, baseWeaponId: 'explosive_trap', evolutionChain: null, isCore: false },
    quantum_mine: { coreId: null, baseWeaponId: 'explosive_trap', evolutionChain: null, isCore: false },
    void_anchor: { coreId: null, baseWeaponId: 'umbral_wave', evolutionChain: null, isCore: false },
    sunbeam: { coreId: null, baseWeaponId: 'radiant_ground', evolutionChain: null, isCore: false },
    moonlight_slash: { coreId: null, baseWeaponId: 'phantom_volley', evolutionChain: null, isCore: false },
    phoenix_guardian: { coreId: null, baseWeaponId: 'inferno_swarm', evolutionChain: null, isCore: false },

    // Epic Evolved Weapons (Tier 4, non-core)
    ragnarok: { coreId: null, baseWeaponId: 'soulrender', evolutionChain: null, isCore: false },
    cosmic_annihilator: { coreId: null, baseWeaponId: 'supernova_core', evolutionChain: null, isCore: false },
    world_serpent: { coreId: null, baseWeaponId: 'void_reaver', evolutionChain: null, isCore: false },
    infinity_gauntlet: { coreId: null, baseWeaponId: 'dimensional_rift', evolutionChain: null, isCore: false },
    chrono_shatter: { coreId: null, baseWeaponId: 'temporal_bolt', evolutionChain: null, isCore: false },
    void_emperor: { coreId: null, baseWeaponId: 'void_anchor', evolutionChain: null, isCore: false },
    heavens_wrath: { coreId: null, baseWeaponId: 'sunbeam', evolutionChain: null, isCore: false },
    soul_nexus: { coreId: null, baseWeaponId: 'soulrender', evolutionChain: null, isCore: false },
    apocalypse_engine: { coreId: null, baseWeaponId: 'orbital_bombardment', evolutionChain: null, isCore: false },
    genesis_blade: { coreId: null, baseWeaponId: 'mirrorblade', evolutionChain: null, isCore: false },
  };

  // ============================================
  // Evolution Recipes
  // ============================================
  // Recipe structure with tier information
  // Keys are ORDERED: 'mainWeaponId+materialWeaponId' (order matters!)
  // The first weapon is the MAIN weapon, second is the MATERIAL weapon
  var EVOLUTION_RECIPES = {
    // Tier 1 -> Tier 2 recipes (known)
    // Format: 'main+material': { result, resultTier, isKnown }
    'arcane_dart+homing_missile': {
      result: 'arcane_cannon',
      resultTier: 2,
      isKnown: true,
    },
    'light_ray+prismatic_ray': {
      result: 'death_ray',
      resultTier: 2,
      isKnown: true,
    },
    'rusty_blade+blade_vortex': {
      result: 'blade_storm',
      resultTier: 2,
      isKnown: true,
    },
    'poison_puddle+toxic_spores': {
      result: 'toxic_inferno',
      resultTier: 2,
      isKnown: true,
    },
    'chakram+arc_lightning': {
      result: 'storm_blades',
      resultTier: 2,
      isKnown: true,
    },
    'scatter_shot+homing_missile': {
      result: 'spread_seeker',
      resultTier: 2,
      isKnown: true,
    },

    // ============================================
    // Regular Weapon Evolution Recipes (18 recipes)
    // ============================================
    'rusty_blade+cleaver': { result: 'blood_cleaver', resultTier: 2, isKnown: true },
    'ember_bolt+ember_field': { result: 'blazing_bolt', resultTier: 2, isKnown: true },
    'ice_shard+ice_bomb': { result: 'frozen_burst', resultTier: 2, isKnown: true },
    'spectral_arrow+spirit_wisps': { result: 'phantom_volley', resultTier: 2, isKnown: true },
    'scatter_shot+wind_cutter': { result: 'storm_scatter', resultTier: 2, isKnown: true },
    'venom_fang+poison_puddle': { result: 'venomous_surge', resultTier: 2, isKnown: true },
    'monks_fist+claw_strike': { result: 'primal_strike', resultTier: 2, isKnown: true },
    'battle_axe+rusty_blade': { result: 'berserker_blade', resultTier: 2, isKnown: true },
    'whip_lash+spark_chain': { result: 'lightning_lash', resultTier: 2, isKnown: true },
    'arcane_dart+spectral_arrow': { result: 'mystic_arrow', resultTier: 2, isKnown: true },
    'shadow_beam+shadow_pool': { result: 'umbral_wave', resultTier: 2, isKnown: true },
    'holy_ground+light_ray': { result: 'radiant_ground', resultTier: 2, isKnown: true },
    'spike_trap+flash_bomb': { result: 'explosive_trap', resultTier: 2, isKnown: true },
    'orbiting_stones+stone_throw': { result: 'rock_storm', resultTier: 2, isKnown: true },
    'skeleton_minion+spirit_wisps': { result: 'undead_legion', resultTier: 2, isKnown: true },
    'frost_circle+fire_motes': { result: 'elemental_clash', resultTier: 2, isKnown: true },
    'ember_field+fire_sprite': { result: 'inferno_swarm', resultTier: 2, isKnown: true },
    'scatter_shot+arcane_dart': { result: 'arcane_scatter', resultTier: 2, isKnown: true },

    // ============================================
    // Core Weapon Evolution Recipes (60 recipes)
    // ============================================

    // Fire Core Evolution Chain (T2: 1+1, T3: 2+2, T4: 3+2, T5: 4+T2evolved)
    'inferno_bolt+ember_field': { result: 'inferno_surge', resultTier: 2, isKnown: true },
    'inferno_surge+flame_scythe': { result: 'phoenix_storm', resultTier: 3, isKnown: true },
    'phoenix_storm+flame_dancers': { result: 'blazing_apocalypse', resultTier: 4, isKnown: true },
    'blazing_apocalypse+arcane_cannon': { result: 'solar_annihilation', resultTier: 5, isKnown: true },

    // Ice Core Evolution Chain (T2: 1+1, T3: 2+2, T4: 3+2, T5: 4+T2evolved)
    'frost_shard+frost_circle': { result: 'glacial_spike', resultTier: 2, isKnown: true },
    'glacial_spike+frost_elemental': { result: 'blizzard_lance', resultTier: 3, isKnown: true },
    'blizzard_lance+blizzard_zone': { result: 'absolute_zero', resultTier: 4, isKnown: true },
    'absolute_zero+death_ray': { result: 'eternal_winter', resultTier: 5, isKnown: true },

    // Lightning Core Evolution Chain (T2: 1+1, T3: 2+2, T4: 3+2, T5: 4+T2evolved)
    'thunder_strike+spark_chain': { result: 'storm_bolt', resultTier: 2, isKnown: true },
    'storm_bolt+arc_lightning': { result: 'tempest_fury', resultTier: 3, isKnown: true },
    'tempest_fury+thunder_hammer': { result: 'lightning_god', resultTier: 4, isKnown: true },
    'lightning_god+storm_blades': { result: 'thor_judgment', resultTier: 5, isKnown: true },

    // Shadow Core Evolution Chain (T2: 1+1, T3: 2+2, T4: 3+2, T5: 4+T2evolved)
    'shadow_blade+shadow_pool': { result: 'phantom_edge', resultTier: 2, isKnown: true },
    'phantom_edge+shadow_clone': { result: 'nightmare_slash', resultTier: 3, isKnown: true },
    'nightmare_slash+phantom_blade': { result: 'void_assassin', resultTier: 4, isKnown: true },
    'void_assassin+blade_storm': { result: 'oblivion_blade', resultTier: 5, isKnown: true },

    // Blood Core Evolution Chain (T2: 1+1, T3: 2+2, T4: 3+2, T5: 4+T2evolved)
    'blood_scythe+blood_razor': { result: 'crimson_reaper', resultTier: 2, isKnown: true },
    'crimson_reaper+soul_orbit': { result: 'soul_harvester', resultTier: 3, isKnown: true },
    'soul_harvester+blood_razor': { result: 'blood_lord', resultTier: 4, isKnown: true },
    'blood_lord+toxic_inferno': { result: 'eternal_bloodlust', resultTier: 5, isKnown: true },

    // Arcane Core Evolution Chain (T2: 1+1, T3: 2+2, T4: 3+2, T5: 4+T4epic)
    'arcane_barrage+arcane_dart': { result: 'mystic_storm', resultTier: 2, isKnown: true },
    'mystic_storm+plasma_orb': { result: 'arcane_tempest', resultTier: 3, isKnown: true },
    'arcane_tempest+soul_orbit': { result: 'reality_shatter', resultTier: 4, isKnown: true },
    'reality_shatter+ragnarok': { result: 'cosmic_weave', resultTier: 5, isKnown: true },

    // Nature Core Evolution Chain (T2: 1+1, T3: 2+2, T4: 3+2, T5: 4+T4epic)
    'venom_spore+poison_puddle': { result: 'toxic_bloom', resultTier: 2, isKnown: true },
    'toxic_bloom+toxic_spores': { result: 'plague_forest', resultTier: 3, isKnown: true },
    'plague_forest+toxic_chain': { result: 'nature_wrath', resultTier: 4, isKnown: true },
    'nature_wrath+world_serpent': { result: 'world_tree', resultTier: 5, isKnown: true },

    // Steel Core Evolution Chain (T2: 1+1, T3: 2+2, T4: 3+2, T5: 4+T4epic)
    'steel_hammer+cleaver': { result: 'iron_crusher', resultTier: 2, isKnown: true },
    'iron_crusher+flame_scythe': { result: 'titan_maul', resultTier: 3, isKnown: true },
    'titan_maul+thunder_hammer': { result: 'adamantine_breaker', resultTier: 4, isKnown: true },
    'adamantine_breaker+genesis_blade': { result: 'mjolnir', resultTier: 5, isKnown: true },

    // Wind Core Evolution Chain (T2: 1+1, T3: 2+2, T4: 3+2, T5: 4+T4epic)
    'wind_cutter_core+wind_cutter': { result: 'gale_blade', resultTier: 2, isKnown: true },
    'gale_blade+blade_vortex': { result: 'hurricane_slash', resultTier: 3, isKnown: true },
    'hurricane_slash+chakram': { result: 'storm_emperor', resultTier: 4, isKnown: true },
    'storm_emperor+infinity_gauntlet': { result: 'primordial_wind', resultTier: 5, isKnown: true },

    // Earth Core Evolution Chain (T2: 1+1, T3: 2+2, T4: 3+2, T5: 4+T4epic)
    'earth_spike+stone_throw': { result: 'stone_cascade', resultTier: 2, isKnown: true },
    'stone_cascade+meteor_crater': { result: 'tectonic_surge', resultTier: 3, isKnown: true },
    'tectonic_surge+gravity_well': { result: 'earthquake', resultTier: 4, isKnown: true },
    'earthquake+cosmic_annihilator': { result: 'continental_drift', resultTier: 5, isKnown: true },

    // Void Core Evolution Chain (T2: 1+1, T3: 2+2, T4: 3+2, T5: 4+T4epic)
    'void_rift+gravity_well': { result: 'null_tear', resultTier: 2, isKnown: true },
    'null_tear+void_bullet': { result: 'dimension_rend', resultTier: 3, isKnown: true },
    'dimension_rend+plasma_orb': { result: 'reality_collapse', resultTier: 4, isKnown: true },
    'reality_collapse+void_emperor': { result: 'void_god', resultTier: 5, isKnown: true },

    // Holy Core Evolution Chain (T2: 1+1, T3: 2+2, T4: 3+2, T5: 4+T4epic)
    'holy_lance+holy_ground': { result: 'divine_spear', resultTier: 2, isKnown: true },
    'divine_spear+hallowed_ring': { result: 'seraph_judgment', resultTier: 3, isKnown: true },
    'seraph_judgment+prismatic_ray': { result: 'heaven_decree', resultTier: 4, isKnown: true },
    'heaven_decree+heavens_wrath': { result: 'god_light', resultTier: 5, isKnown: true },

    // Tech Core Evolution Chain (T2: 1+1, T3: 2+2, T4: 3+2, T5: 4+T4epic)
    'tech_turret+spike_trap': { result: 'auto_sentinel', resultTier: 2, isKnown: true },
    'auto_sentinel+cluster_mine': { result: 'siege_platform', resultTier: 3, isKnown: true },
    'siege_platform+magnetic_mine': { result: 'war_machine', resultTier: 4, isKnown: true },
    'war_machine+apocalypse_engine': { result: 'omega_protocol', resultTier: 5, isKnown: true },

    // Beast Core Evolution Chain (T2: 1+1, T3: 2+2, T4: 3+2, T5: 4+T4epic)
    'beast_claw+claw_strike': { result: 'feral_strike', resultTier: 2, isKnown: true },
    'feral_strike+crescent_moon': { result: 'alpha_predator', resultTier: 3, isKnown: true },
    'alpha_predator+chakram': { result: 'beast_king', resultTier: 4, isKnown: true },
    'beast_king+soul_nexus': { result: 'primal_god', resultTier: 5, isKnown: true },

    // Time Core Evolution Chain (T2: 1+1, T3: 2+2, T4: 3+2, T5: 4+T4epic)
    'chrono_beam+light_ray': { result: 'temporal_ray', resultTier: 2, isKnown: true },
    'temporal_ray+prismatic_ray': { result: 'time_distortion', resultTier: 3, isKnown: true },
    'time_distortion+crystal_lance': { result: 'chrono_master', resultTier: 4, isKnown: true },
    'chrono_master+chrono_shatter': { result: 'eternity_weaver', resultTier: 5, isKnown: true },

    // ============================================
    // Rare Weapon Evolution Recipes (T2 evolved + T2 uncommon → T3 rare)
    // 20 recipes for rare weapons
    // ============================================
    'mystic_arrow+prismatic_ray': { result: 'constellation_arrow', resultTier: 3, isKnown: true },
    'arcane_cannon+gravity_well': { result: 'singularity_orb', resultTier: 3, isKnown: true },
    'blazing_bolt+flame_dancers': { result: 'phoenix_feather', resultTier: 3, isKnown: true },
    'death_ray+crystal_lance': { result: 'temporal_bolt', resultTier: 3, isKnown: true },
    'inferno_swarm+plasma_orb': { result: 'dragonbreath_volley', resultTier: 3, isKnown: true },
    'umbral_wave+void_bullet': { result: 'void_reaver', resultTier: 3, isKnown: true },
    'lightning_lash+thunder_hammer': { result: 'storm_caller', resultTier: 3, isKnown: true },
    'blade_storm+phantom_blade': { result: 'mirrorblade', resultTier: 3, isKnown: true },
    'blood_cleaver+soul_orbit': { result: 'soulrender', resultTier: 3, isKnown: true },
    'elemental_clash+blizzard_zone': { result: 'aurora_field', resultTier: 3, isKnown: true },
    'arcane_scatter+void_bullet': { result: 'dimensional_rift', resultTier: 3, isKnown: true },
    'blazing_bolt+meteor_crater': { result: 'supernova_core', resultTier: 3, isKnown: true },
    'rock_storm+hallowed_ring': { result: 'celestial_orbit', resultTier: 3, isKnown: true },
    'storm_scatter+arc_lightning': { result: 'cascade_lightning', resultTier: 3, isKnown: true },
    'explosive_trap+cluster_mine': { result: 'orbital_bombardment', resultTier: 3, isKnown: true },
    'explosive_trap+magnetic_mine': { result: 'quantum_mine', resultTier: 3, isKnown: true },
    'umbral_wave+gravity_well': { result: 'void_anchor', resultTier: 3, isKnown: true },
    'radiant_ground+prismatic_ray': { result: 'sunbeam', resultTier: 3, isKnown: true },
    'phantom_volley+crescent_moon': { result: 'moonlight_slash', resultTier: 3, isKnown: true },
    'inferno_swarm+frost_elemental': { result: 'phoenix_guardian', resultTier: 3, isKnown: true },

    // ============================================
    // Epic Weapon Evolution Recipes (T3 rare + T2 uncommon → T4 epic)
    // 10 recipes for epic weapons
    // ============================================
    'soulrender+blood_razor': { result: 'ragnarok', resultTier: 4, isKnown: true },
    'supernova_core+gravity_well': { result: 'cosmic_annihilator', resultTier: 4, isKnown: true },
    'void_reaver+toxic_chain': { result: 'world_serpent', resultTier: 4, isKnown: true },
    'dimensional_rift+crystal_lance': { result: 'infinity_gauntlet', resultTier: 4, isKnown: true },
    'temporal_bolt+void_bullet': { result: 'chrono_shatter', resultTier: 4, isKnown: true },
    'void_anchor+phantom_blade': { result: 'void_emperor', resultTier: 4, isKnown: true },
    'sunbeam+hallowed_ring': { result: 'heavens_wrath', resultTier: 4, isKnown: true },
    'soulrender+soul_orbit': { result: 'soul_nexus', resultTier: 4, isKnown: true },
    'orbital_bombardment+magnetic_mine': { result: 'apocalypse_engine', resultTier: 4, isKnown: true },
    'mirrorblade+flame_scythe': { result: 'genesis_blade', resultTier: 4, isKnown: true },
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
  // Centralized Evolution Metadata Helpers
  // ============================================

  /**
   * Get evolution chain metadata for a weapon
   * @param {string} weaponId
   * @returns {Object|null} Metadata object with coreId, baseWeaponId, evolutionChain, isCore
   */
  function getEvolutionChainMetadata(weaponId) {
    return EVOLUTION_CHAIN_METADATA[weaponId] || null;
  }

  /**
   * Check if a weapon is a core evolved weapon using centralized metadata
   * @param {string} weaponId
   * @returns {boolean}
   */
  function isCoreEvolvedWeapon(weaponId) {
    var metadata = EVOLUTION_CHAIN_METADATA[weaponId];
    return metadata ? metadata.isCore === true : false;
  }

  /**
   * Get the core ID for an evolved weapon
   * @param {string} weaponId
   * @returns {string|null}
   */
  function getWeaponCoreId(weaponId) {
    var metadata = EVOLUTION_CHAIN_METADATA[weaponId];
    return metadata ? metadata.coreId : null;
  }

  /**
   * Get the base weapon ID for an evolved weapon
   * @param {string} weaponId
   * @returns {string|null}
   */
  function getBaseWeaponId(weaponId) {
    var metadata = EVOLUTION_CHAIN_METADATA[weaponId];
    return metadata ? metadata.baseWeaponId : null;
  }

  /**
   * Get the evolution chain name for an evolved weapon
   * @param {string} weaponId
   * @returns {string|null}
   */
  function getEvolutionChainName(weaponId) {
    var metadata = EVOLUTION_CHAIN_METADATA[weaponId];
    return metadata ? metadata.evolutionChain : null;
  }

  /**
   * Get all evolved weapons in a specific chain
   * @param {string} chainName - e.g., 'fire', 'ice', 'lightning'
   * @returns {Array<string>} Array of weapon IDs in this chain
   */
  function getWeaponsInChain(chainName) {
    var result = [];
    for (var weaponId in EVOLUTION_CHAIN_METADATA) {
      if (EVOLUTION_CHAIN_METADATA[weaponId].evolutionChain === chainName) {
        result.push(weaponId);
      }
    }
    return result;
  }

  /**
   * Get all evolution chain metadata
   * @returns {Object}
   */
  function getAllEvolutionChainMetadata() {
    return EVOLUTION_CHAIN_METADATA;
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
    // Centralized metadata helpers
    getEvolutionChainMetadata: getEvolutionChainMetadata,
    isCoreEvolvedWeapon: isCoreEvolvedWeapon,
    getWeaponCoreId: getWeaponCoreId,
    getBaseWeaponId: getBaseWeaponId,
    getEvolutionChainName: getEvolutionChainName,
    getWeaponsInChain: getWeaponsInChain,
    getAllEvolutionChainMetadata: getAllEvolutionChainMetadata,
  };
})(window.VampireSurvivors.Data);
