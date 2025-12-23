/**
 * @fileoverview Image configuration - paths and sprite sheet definitions
 * @module Data/ImageConfig
 */
(function (Data) {
  'use strict';

  // ============================================
  // Constants
  // ============================================
  var BASE_PATH = 'styles/imgs/';

  // ============================================
  // Individual Image Paths
  // ============================================
  var IMAGES = {
    // ------------- PLAYERS -------------
    player_default: { path: 'players/player_default.png' },

    // ------------- ENEMIES -------------
    enemy_normal: { path: 'enemies/enemy_normal.png' },
    enemy_fast: { path: 'enemies/enemy_fast.png' },
    enemy_flying: { path: 'enemies/enemy_flying.png' },
    enemy_self_destruct: { path: 'enemies/enemy_self_destruct.png' },
    enemy_invisible: { path: 'enemies/enemy_invisible.png' },
    enemy_dash_attack: { path: 'enemies/enemy_dash_attack.png' },
    enemy_projectile: { path: 'enemies/enemy_projectile.png' },
    enemy_jump_drop: { path: 'enemies/enemy_jump_drop.png' },
    enemy_tank: { path: 'enemies/enemy_tank.png' },
    enemy_traversal_circular: { path: 'enemies/traversal_circular.png' },
    enemy_traversal_dash: { path: 'enemies/traversal_dash.png' },
    enemy_traversal_laser: { path: 'enemies/traversal_laser.png' },

    // ------------- BOSSES -------------
    boss_elite: { path: 'bosses/boss_elite.png' },
    boss_miniboss: { path: 'bosses/boss_miniboss.png' },
    boss_main: { path: 'bosses/boss_main.png' },

    // ------------- PICKUPS -------------
    pickup_exp_tier1: { path: 'pickups/exp_tier1.png' },
    pickup_exp_tier2: { path: 'pickups/exp_tier2.png' },
    pickup_exp_tier3: { path: 'pickups/exp_tier3.png' },
    pickup_exp_tier4: { path: 'pickups/exp_tier4.png' },
    pickup_gold: { path: 'pickups/gold.png' },
    pickup_health: { path: 'pickups/health.png' },
    pickup_magnet: { path: 'pickups/magnet.png' },

    // ------------- BASIC WEAPONS (Common - Tier 1) -------------
    weapon_arcane_dart: { path: 'weapons/basic/common/arcane_dart.png' },
    weapon_stone_throw: { path: 'weapons/basic/common/stone_throw.png' },
    weapon_ice_shard: { path: 'weapons/basic/common/ice_shard.png' },
    weapon_ember_bolt: { path: 'weapons/basic/common/ember_bolt.png' },
    weapon_spectral_arrow: { path: 'weapons/basic/common/spectral_arrow.png' },
    weapon_scatter_shot: { path: 'weapons/basic/common/scatter_shot.png' },
    weapon_venom_fang: { path: 'weapons/basic/common/venom_fang.png' },
    weapon_wind_cutter: { path: 'weapons/basic/common/wind_cutter.png' },
    weapon_rusty_blade: { path: 'weapons/basic/common/rusty_blade.png' },
    weapon_monks_fist: { path: 'weapons/basic/common/monks_fist.png' },
    weapon_cleaver: { path: 'weapons/basic/common/cleaver.png' },
    weapon_whip_lash: { path: 'weapons/basic/common/whip_lash.png' },
    weapon_battle_axe: { path: 'weapons/basic/common/battle_axe.png' },
    weapon_claw_strike: { path: 'weapons/basic/common/claw_strike.png' },
    weapon_poison_puddle: { path: 'weapons/basic/common/poison_puddle.png' },
    weapon_frost_circle: { path: 'weapons/basic/common/frost_circle.png' },
    weapon_ember_field: { path: 'weapons/basic/common/ember_field.png' },
    weapon_shadow_pool: { path: 'weapons/basic/common/shadow_pool.png' },
    weapon_holy_ground: { path: 'weapons/basic/common/holy_ground.png' },
    weapon_orbiting_stones: { path: 'weapons/basic/common/orbiting_stones.png' },
    weapon_spark_chain: { path: 'weapons/basic/common/spark_chain.png' },
    weapon_spirit_wisps: { path: 'weapons/basic/common/spirit_wisps.png' },
    weapon_fire_motes: { path: 'weapons/basic/common/fire_motes.png' },
    weapon_spike_trap: { path: 'weapons/basic/common/spike_trap.png' },
    weapon_flash_bomb: { path: 'weapons/basic/common/flash_bomb.png' },
    weapon_ice_bomb: { path: 'weapons/basic/common/ice_bomb.png' },
    weapon_light_ray: { path: 'weapons/basic/common/light_ray.png' },
    weapon_shadow_beam: { path: 'weapons/basic/common/shadow_beam.png' },
    weapon_skeleton_minion: { path: 'weapons/basic/common/skeleton_minion.png' },
    weapon_fire_sprite: { path: 'weapons/basic/common/fire_sprite.png' },

    // ------------- BASIC WEAPONS (Uncommon - Tier 2) -------------
    weapon_bifrost_bolt: { path: 'weapons/basic/uncommon/bifrost_bolt.png' },
    weapon_homing_missile: { path: 'weapons/basic/uncommon/homing_missile.png' },
    weapon_ricochet_shot: { path: 'weapons/basic/uncommon/ricochet_shot.png' },
    weapon_split_arrow: { path: 'weapons/basic/uncommon/split_arrow.png' },
    weapon_plasma_orb: { path: 'weapons/basic/uncommon/plasma_orb.png' },
    weapon_chakram: { path: 'weapons/basic/uncommon/chakram.png' },
    weapon_void_bullet: { path: 'weapons/basic/uncommon/void_bullet.png' },
    weapon_crystal_lance: { path: 'weapons/basic/uncommon/crystal_lance.png' },
    weapon_phantom_blade: { path: 'weapons/basic/uncommon/phantom_blade.png' },
    weapon_flame_scythe: { path: 'weapons/basic/uncommon/flame_scythe.png' },
    weapon_thunder_hammer: { path: 'weapons/basic/uncommon/thunder_hammer.png' },
    weapon_blood_razor: { path: 'weapons/basic/uncommon/blood_razor.png' },
    weapon_crescent_moon: { path: 'weapons/basic/uncommon/crescent_moon.png' },
    weapon_toxic_spores: { path: 'weapons/basic/uncommon/toxic_spores.png' },
    weapon_gravity_well: { path: 'weapons/basic/uncommon/gravity_well.png' },
    weapon_hallowed_ring: { path: 'weapons/basic/uncommon/hallowed_ring.png' },
    weapon_meteor_crater: { path: 'weapons/basic/uncommon/meteor_crater.png' },
    weapon_blizzard_zone: { path: 'weapons/basic/uncommon/blizzard_zone.png' },
    weapon_soul_orbit: { path: 'weapons/basic/uncommon/soul_orbit.png' },
    weapon_arc_lightning: { path: 'weapons/basic/uncommon/arc_lightning.png' },
    weapon_blade_vortex: { path: 'weapons/basic/uncommon/blade_vortex.png' },
    weapon_toxic_chain: { path: 'weapons/basic/uncommon/toxic_chain.png' },
    weapon_flame_dancers: { path: 'weapons/basic/uncommon/flame_dancers.png' },
    weapon_cluster_mine: { path: 'weapons/basic/uncommon/cluster_mine.png' },
    weapon_magnetic_mine: { path: 'weapons/basic/uncommon/magnetic_mine.png' },
    weapon_chain_reaction_mine: { path: 'weapons/basic/uncommon/chain_reaction_mine.png' },
    weapon_prismatic_ray: { path: 'weapons/basic/uncommon/prismatic_ray.png' },
    weapon_piercing_gaze: { path: 'weapons/basic/uncommon/piercing_gaze.png' },
    weapon_shadow_clone: { path: 'weapons/basic/uncommon/shadow_clone.png' },
    weapon_frost_elemental: { path: 'weapons/basic/uncommon/frost_elemental.png' },
    weapon_arcane_cannon: { path: 'weapons/basic/uncommon/arcane_cannon.png' },
    weapon_death_ray: { path: 'weapons/basic/uncommon/death_ray.png' },
    weapon_blade_storm: { path: 'weapons/basic/uncommon/blade_storm.png' },
    weapon_toxic_inferno: { path: 'weapons/basic/uncommon/toxic_inferno.png' },
    weapon_storm_blades: { path: 'weapons/basic/uncommon/storm_blades.png' },
    weapon_spread_seeker: { path: 'weapons/basic/uncommon/spread_seeker.png' },
    weapon_blood_cleaver: { path: 'weapons/basic/uncommon/blood_cleaver.png' },
    weapon_blazing_bolt: { path: 'weapons/basic/uncommon/blazing_bolt.png' },
    weapon_frozen_burst: { path: 'weapons/basic/uncommon/frozen_burst.png' },
    weapon_phantom_volley: { path: 'weapons/basic/uncommon/phantom_volley.png' },
    weapon_storm_scatter: { path: 'weapons/basic/uncommon/storm_scatter.png' },
    weapon_venomous_surge: { path: 'weapons/basic/uncommon/venomous_surge.png' },
    weapon_primal_strike: { path: 'weapons/basic/uncommon/primal_strike.png' },
    weapon_berserker_blade: { path: 'weapons/basic/uncommon/berserker_blade.png' },
    weapon_lightning_lash: { path: 'weapons/basic/uncommon/lightning_lash.png' },
    weapon_mystic_arrow: { path: 'weapons/basic/uncommon/mystic_arrow.png' },
    weapon_umbral_wave: { path: 'weapons/basic/uncommon/umbral_wave.png' },
    weapon_radiant_ground: { path: 'weapons/basic/uncommon/radiant_ground.png' },
    weapon_explosive_trap: { path: 'weapons/basic/uncommon/explosive_trap.png' },
    weapon_rock_storm: { path: 'weapons/basic/uncommon/rock_storm.png' },
    weapon_undead_legion: { path: 'weapons/basic/uncommon/undead_legion.png' },
    weapon_elemental_clash: { path: 'weapons/basic/uncommon/elemental_clash.png' },
    weapon_inferno_swarm: { path: 'weapons/basic/uncommon/inferno_swarm.png' },
    weapon_arcane_scatter: { path: 'weapons/basic/uncommon/arcane_scatter.png' },

    // ------------- BASIC WEAPONS (Rare - Tier 3) -------------
    weapon_moonlight_slash: { path: 'weapons/basic/rare/moonlight_slash.png' },
    weapon_constellation_arrow: { path: 'weapons/basic/rare/constellation_arrow.png' },
    weapon_quantum_mine: { path: 'weapons/basic/rare/quantum_mine.png' },
    weapon_phoenix_feather: { path: 'weapons/basic/rare/phoenix_feather.png' },
    weapon_dragonbreath_volley: { path: 'weapons/basic/rare/dragonbreath_volley.png' },
    weapon_phoenix_guardian: { path: 'weapons/basic/rare/phoenix_guardian.png' },
    weapon_storm_caller: { path: 'weapons/basic/rare/storm_caller.png' },
    weapon_mirrorblade: { path: 'weapons/basic/rare/mirrorblade.png' },
    weapon_soulrender: { path: 'weapons/basic/rare/soulrender.png' },
    weapon_singularity_orb: { path: 'weapons/basic/rare/singularity_orb.png' },
    weapon_celestial_orbit: { path: 'weapons/basic/rare/celestial_orbit.png' },
    weapon_aurora_field: { path: 'weapons/basic/rare/aurora_field.png' },
    weapon_orbital_bombardment: { path: 'weapons/basic/rare/orbital_bombardment.png' },
    weapon_dimensional_rift: { path: 'weapons/basic/rare/dimensional_rift.png' },
    weapon_void_reaver: { path: 'weapons/basic/rare/void_reaver.png' },
    weapon_cascade_lightning: { path: 'weapons/basic/rare/cascade_lightning.png' },
    weapon_supernova_core: { path: 'weapons/basic/rare/supernova_core.png' },
    weapon_temporal_bolt: { path: 'weapons/basic/rare/temporal_bolt.png' },
    weapon_sunbeam: { path: 'weapons/basic/rare/sunbeam.png' },
    weapon_void_anchor: { path: 'weapons/basic/rare/void_anchor.png' },

    // ------------- BASIC WEAPONS (Epic - Tier 4) -------------
    weapon_ragnarok: { path: 'weapons/basic/epic/ragnarok.png' },
    weapon_cosmic_annihilator: { path: 'weapons/basic/epic/cosmic_annihilator.png' },
    weapon_world_serpent: { path: 'weapons/basic/epic/world_serpent.png' },
    weapon_infinity_gauntlet: { path: 'weapons/basic/epic/infinity_gauntlet.png' },
    weapon_chrono_shatter: { path: 'weapons/basic/epic/chrono_shatter.png' },
    weapon_void_emperor: { path: 'weapons/basic/epic/void_emperor.png' },
    weapon_heavens_wrath: { path: 'weapons/basic/epic/heavens_wrath.png' },
    weapon_soul_nexus: { path: 'weapons/basic/epic/soul_nexus.png' },
    weapon_apocalypse_engine: { path: 'weapons/basic/epic/apocalypse_engine.png' },
    weapon_genesis_blade: { path: 'weapons/basic/epic/genesis_blade.png' },

    // ------------- CORE WEAPONS (Common - Tier 1) -------------
    weapon_inferno_bolt: { path: 'weapons/core/common/inferno_bolt.png' },
    weapon_frost_shard: { path: 'weapons/core/common/frost_shard.png' },
    weapon_thunder_strike: { path: 'weapons/core/common/thunder_strike.png' },
    weapon_shadow_blade: { path: 'weapons/core/common/shadow_blade.png' },
    weapon_blood_scythe: { path: 'weapons/core/common/blood_scythe.png' },
    weapon_arcane_barrage: { path: 'weapons/core/common/arcane_barrage.png' },
    weapon_venom_spore: { path: 'weapons/core/common/venom_spore.png' },
    weapon_steel_hammer: { path: 'weapons/core/common/steel_hammer.png' },
    weapon_wind_cutter_core: { path: 'weapons/core/common/wind_cutter_core.png' },
    weapon_earth_spike: { path: 'weapons/core/common/earth_spike.png' },
    weapon_void_rift: { path: 'weapons/core/common/void_rift.png' },
    weapon_holy_lance: { path: 'weapons/core/common/holy_lance.png' },
    weapon_tech_turret: { path: 'weapons/core/common/tech_turret.png' },
    weapon_beast_claw: { path: 'weapons/core/common/beast_claw.png' },
    weapon_chrono_beam: { path: 'weapons/core/common/chrono_beam.png' },

    // ------------- CORE WEAPONS (Uncommon - Tier 2) -------------
    weapon_glacial_spike: { path: 'weapons/core/uncommon/glacial_spike.png' },
    weapon_inferno_surge: { path: 'weapons/core/uncommon/inferno_surge.png' },
    weapon_storm_bolt: { path: 'weapons/core/uncommon/storm_bolt.png' },
    weapon_phantom_edge: { path: 'weapons/core/uncommon/phantom_edge.png' },
    weapon_crimson_reaper: { path: 'weapons/core/uncommon/crimson_reaper.png' },
    weapon_mystic_storm: { path: 'weapons/core/uncommon/mystic_storm.png' },
    weapon_toxic_bloom: { path: 'weapons/core/uncommon/toxic_bloom.png' },
    weapon_iron_crusher: { path: 'weapons/core/uncommon/iron_crusher.png' },
    weapon_gale_blade: { path: 'weapons/core/uncommon/gale_blade.png' },
    weapon_stone_cascade: { path: 'weapons/core/uncommon/stone_cascade.png' },
    weapon_null_tear: { path: 'weapons/core/uncommon/null_tear.png' },
    weapon_divine_spear: { path: 'weapons/core/uncommon/divine_spear.png' },
    weapon_temporal_ray: { path: 'weapons/core/uncommon/temporal_ray.png' },
    weapon_auto_sentinel: { path: 'weapons/core/uncommon/auto_sentinel.png' },
    weapon_feral_strike: { path: 'weapons/core/uncommon/feral_strike.png' },

    // ------------- CORE WEAPONS (Rare - Tier 3) -------------
    weapon_blizzard_lance: { path: 'weapons/core/rare/blizzard_lance.png' },
    weapon_phoenix_storm: { path: 'weapons/core/rare/phoenix_storm.png' },
    weapon_tempest_fury: { path: 'weapons/core/rare/tempest_fury.png' },
    weapon_nightmare_slash: { path: 'weapons/core/rare/nightmare_slash.png' },
    weapon_soul_harvester: { path: 'weapons/core/rare/soul_harvester.png' },
    weapon_arcane_tempest: { path: 'weapons/core/rare/arcane_tempest.png' },
    weapon_plague_forest: { path: 'weapons/core/rare/plague_forest.png' },
    weapon_titan_maul: { path: 'weapons/core/rare/titan_maul.png' },
    weapon_hurricane_slash: { path: 'weapons/core/rare/hurricane_slash.png' },
    weapon_tectonic_surge: { path: 'weapons/core/rare/tectonic_surge.png' },
    weapon_dimension_rend: { path: 'weapons/core/rare/dimension_rend.png' },
    weapon_seraph_judgment: { path: 'weapons/core/rare/seraph_judgment.png' },
    weapon_time_distortion: { path: 'weapons/core/rare/time_distortion.png' },
    weapon_siege_platform: { path: 'weapons/core/rare/siege_platform.png' },
    weapon_alpha_predator: { path: 'weapons/core/rare/alpha_predator.png' },

    // ------------- CORE WEAPONS (Epic - Tier 4) -------------
    weapon_absolute_zero: { path: 'weapons/core/epic/absolute_zero.png' },
    weapon_blazing_apocalypse: { path: 'weapons/core/epic/blazing_apocalypse.png' },
    weapon_lightning_god: { path: 'weapons/core/epic/lightning_god.png' },
    weapon_void_assassin: { path: 'weapons/core/epic/void_assassin.png' },
    weapon_blood_lord: { path: 'weapons/core/epic/blood_lord.png' },
    weapon_reality_shatter: { path: 'weapons/core/epic/reality_shatter.png' },
    weapon_nature_wrath: { path: 'weapons/core/epic/nature_wrath.png' },
    weapon_adamantine_breaker: { path: 'weapons/core/epic/adamantine_breaker.png' },
    weapon_storm_emperor: { path: 'weapons/core/epic/storm_emperor.png' },
    weapon_earthquake: { path: 'weapons/core/epic/earthquake.png' },
    weapon_reality_collapse: { path: 'weapons/core/epic/reality_collapse.png' },
    weapon_heaven_decree: { path: 'weapons/core/epic/heaven_decree.png' },
    weapon_chrono_master: { path: 'weapons/core/epic/chrono_master.png' },
    weapon_war_machine: { path: 'weapons/core/epic/war_machine.png' },
    weapon_beast_king: { path: 'weapons/core/epic/beast_king.png' },

    // ------------- CORE WEAPONS (Legendary - Tier 5) -------------
    weapon_eternal_winter: { path: 'weapons/core/legendary/eternal_winter.png' },
    weapon_solar_annihilation: { path: 'weapons/core/legendary/solar_annihilation.png' },
    weapon_thor_judgment: { path: 'weapons/core/legendary/thor_judgment.png' },
    weapon_oblivion_blade: { path: 'weapons/core/legendary/oblivion_blade.png' },
    weapon_eternal_bloodlust: { path: 'weapons/core/legendary/eternal_bloodlust.png' },
    weapon_cosmic_weave: { path: 'weapons/core/legendary/cosmic_weave.png' },
    weapon_world_tree: { path: 'weapons/core/legendary/world_tree.png' },
    weapon_mjolnir: { path: 'weapons/core/legendary/mjolnir.png' },
    weapon_primordial_wind: { path: 'weapons/core/legendary/primordial_wind.png' },
    weapon_continental_drift: { path: 'weapons/core/legendary/continental_drift.png' },
    weapon_void_god: { path: 'weapons/core/legendary/void_god.png' },
    weapon_god_light: { path: 'weapons/core/legendary/god_light.png' },
    weapon_eternity_weaver: { path: 'weapons/core/legendary/eternity_weaver.png' },
    weapon_omega_protocol: { path: 'weapons/core/legendary/omega_protocol.png' },
    weapon_primal_god: { path: 'weapons/core/legendary/primal_god.png' },

    // ------------- TECH CORES -------------
    tech_fire_core: { path: 'tech/fire_core.png' },
    tech_ice_core: { path: 'tech/ice_core.png' },
    tech_lightning_core: { path: 'tech/lightning_core.png' },
    tech_shadow_core: { path: 'tech/shadow_core.png' },
    tech_blood_core: { path: 'tech/blood_core.png' },
    tech_arcane_core: { path: 'tech/arcane_core.png' },
    tech_nature_core: { path: 'tech/nature_core.png' },
    tech_steel_core: { path: 'tech/steel_core.png' },
    tech_wind_core: { path: 'tech/wind_core.png' },
    tech_earth_core: { path: 'tech/earth_core.png' },
    tech_void_core: { path: 'tech/void_core.png' },
    tech_holy_core: { path: 'tech/holy_core.png' },
    tech_tech_core: { path: 'tech/tech_core.png' },
    tech_beast_core: { path: 'tech/beast_core.png' },
    tech_time_core: { path: 'tech/time_core.png' },

    // ------------- STAT UPGRADES -------------
    stat_maxHealth: { path: 'stats/max_health.png' },
    stat_damage: { path: 'stats/damage.png' },
    stat_moveSpeed: { path: 'stats/move_speed.png' },
    stat_critChance: { path: 'stats/crit_chance.png' },
    stat_critDamage: { path: 'stats/crit_damage.png' },
    stat_pickupRange: { path: 'stats/pickup_range.png' },
    stat_xpGain: { path: 'stats/xp_gain.png' },
    stat_range: { path: 'stats/range.png' },
    stat_cooldownReduction: { path: 'stats/cooldown_reduction.png' },
    stat_duration: { path: 'stats/duration.png' },
    stat_luck: { path: 'stats/luck.png' },

    // ------------- SUMMONS -------------
    summon_spirit: { path: 'summons/spirit.png' },
    summon_turret: { path: 'summons/turret.png' },
    summon_wolf: { path: 'summons/wolf.png' },
    summon_golem: { path: 'summons/golem.png' },
    summon_fairy: { path: 'summons/fairy.png' },

    // ============================================
    // WEAPON ATTACK TYPE IMAGES
    // ============================================

    // ------------- PROJECTILE ATTACK IMAGES -------------
    // Basic Common
    arcane_dart_projectile: { path: 'weapons/projectiles/arcane_dart.png' },
    stone_throw_projectile: { path: 'weapons/projectiles/stone_throw.png' },
    ice_shard_projectile: { path: 'weapons/projectiles/ice_shard.png' },
    ember_bolt_projectile: { path: 'weapons/projectiles/ember_bolt.png' },
    spectral_arrow_projectile: { path: 'weapons/projectiles/spectral_arrow.png' },
    scatter_shot_projectile: { path: 'weapons/projectiles/scatter_shot.png' },
    venom_fang_projectile: { path: 'weapons/projectiles/venom_fang.png' },
    wind_cutter_projectile: { path: 'weapons/projectiles/wind_cutter.png' },
    // Basic Uncommon
    bifrost_bolt_projectile: { path: 'weapons/projectiles/bifrost_bolt.png' },
    homing_missile_projectile: { path: 'weapons/projectiles/homing_missile.png' },
    ricochet_shot_projectile: { path: 'weapons/projectiles/ricochet_shot.png' },
    split_arrow_projectile: { path: 'weapons/projectiles/split_arrow.png' },
    plasma_orb_projectile: { path: 'weapons/projectiles/plasma_orb.png' },
    chakram_projectile: { path: 'weapons/projectiles/chakram.png' },
    void_bullet_projectile: { path: 'weapons/projectiles/void_bullet.png' },
    crystal_lance_projectile: { path: 'weapons/projectiles/crystal_lance.png' },
    arcane_cannon_projectile: { path: 'weapons/projectiles/arcane_cannon.png' },
    blazing_bolt_projectile: { path: 'weapons/projectiles/blazing_bolt.png' },
    frozen_burst_projectile: { path: 'weapons/projectiles/frozen_burst.png' },
    phantom_volley_projectile: { path: 'weapons/projectiles/phantom_volley.png' },
    storm_scatter_projectile: { path: 'weapons/projectiles/storm_scatter.png' },
    mystic_arrow_projectile: { path: 'weapons/projectiles/mystic_arrow.png' },
    spread_seeker_projectile: { path: 'weapons/projectiles/spread_seeker.png' },
    arcane_scatter_projectile: { path: 'weapons/projectiles/arcane_scatter.png' },
    rock_storm_projectile: { path: 'weapons/projectiles/rock_storm.png' },
    storm_blades_projectile: { path: 'weapons/projectiles/storm_blades.png' },
    // Basic Rare
    constellation_arrow_projectile: { path: 'weapons/projectiles/constellation_arrow.png' },
    singularity_orb_projectile: { path: 'weapons/projectiles/singularity_orb.png' },
    phoenix_feather_projectile: { path: 'weapons/projectiles/phoenix_feather.png' },
    temporal_bolt_projectile: { path: 'weapons/projectiles/temporal_bolt.png' },
    dragonbreath_volley_projectile: { path: 'weapons/projectiles/dragonbreath_volley.png' },
    // Basic Epic
    chrono_shatter_projectile: { path: 'weapons/projectiles/chrono_shatter.png' },
    // Core Common
    inferno_bolt_projectile: { path: 'weapons/projectiles/inferno_bolt.png' },
    frost_shard_projectile: { path: 'weapons/projectiles/frost_shard.png' },
    wind_cutter_core_projectile: { path: 'weapons/projectiles/wind_cutter_core.png' },
    arcane_barrage_projectile: { path: 'weapons/projectiles/arcane_barrage.png' },
    tech_turret_projectile: { path: 'weapons/projectiles/tech_turret.png' },
    // Core Uncommon
    auto_sentinel_projectile: { path: 'weapons/projectiles/auto_sentinel.png' },
    divine_spear_projectile: { path: 'weapons/projectiles/divine_spear.png' },
    gale_blade_projectile: { path: 'weapons/projectiles/gale_blade.png' },
    glacial_spike_projectile: { path: 'weapons/projectiles/glacial_spike.png' },
    inferno_surge_projectile: { path: 'weapons/projectiles/inferno_surge.png' },
    mystic_storm_projectile: { path: 'weapons/projectiles/mystic_storm.png' },
    storm_bolt_projectile: { path: 'weapons/projectiles/storm_bolt.png' },
    // Core Rare
    arcane_tempest_projectile: { path: 'weapons/projectiles/arcane_tempest.png' },
    blizzard_lance_projectile: { path: 'weapons/projectiles/blizzard_lance.png' },
    hurricane_slash_projectile: { path: 'weapons/projectiles/hurricane_slash.png' },
    phoenix_storm_projectile: { path: 'weapons/projectiles/phoenix_storm.png' },
    seraph_judgment_projectile: { path: 'weapons/projectiles/seraph_judgment.png' },
    siege_platform_projectile: { path: 'weapons/projectiles/siege_platform.png' },
    tempest_fury_projectile: { path: 'weapons/projectiles/tempest_fury.png' },
    // Core Epic
    absolute_zero_projectile: { path: 'weapons/projectiles/absolute_zero.png' },
    blazing_apocalypse_projectile: { path: 'weapons/projectiles/blazing_apocalypse.png' },
    heaven_decree_projectile: { path: 'weapons/projectiles/heaven_decree.png' },
    lightning_god_projectile: { path: 'weapons/projectiles/lightning_god.png' },
    reality_shatter_projectile: { path: 'weapons/projectiles/reality_shatter.png' },
    storm_emperor_projectile: { path: 'weapons/projectiles/storm_emperor.png' },
    war_machine_projectile: { path: 'weapons/projectiles/war_machine.png' },
    // Core Legendary
    cosmic_weave_projectile: { path: 'weapons/projectiles/cosmic_weave.png' },
    eternal_winter_projectile: { path: 'weapons/projectiles/eternal_winter.png' },
    god_light_projectile: { path: 'weapons/projectiles/god_light.png' },
    omega_protocol_projectile: { path: 'weapons/projectiles/omega_protocol.png' },
    primordial_wind_projectile: { path: 'weapons/projectiles/primordial_wind.png' },
    solar_annihilation_projectile: { path: 'weapons/projectiles/solar_annihilation.png' },
    thor_judgment_projectile: { path: 'weapons/projectiles/thor_judgment.png' },

    // ------------- LASER ATTACK IMAGES -------------
    // Basic Common
    shadow_beam_laser: { path: 'weapons/lasers/shadow_beam.png' },
    light_ray_laser: { path: 'weapons/lasers/light_ray.png' },
    // Basic Uncommon
    prismatic_ray_laser: { path: 'weapons/lasers/prismatic_ray.png' },
    piercing_gaze_laser: { path: 'weapons/lasers/piercing_gaze.png' },
    death_ray_laser: { path: 'weapons/lasers/death_ray.png' },
    // Basic Rare
    moonlight_slash_laser: { path: 'weapons/lasers/moonlight_slash.png' },
    sunbeam_laser: { path: 'weapons/lasers/sunbeam.png' },
    // Basic Epic
    cosmic_annihilator_laser: { path: 'weapons/lasers/cosmic_annihilator.png' },
    // Core Common
    chrono_beam_laser: { path: 'weapons/lasers/chrono_beam.png' },
    holy_lance_laser: { path: 'weapons/lasers/holy_lance.png' },
    // Core Uncommon
    temporal_ray_laser: { path: 'weapons/lasers/temporal_ray.png' },
    // Core Rare
    time_distortion_laser: { path: 'weapons/lasers/time_distortion.png' },
    // Core Epic
    chrono_master_laser: { path: 'weapons/lasers/chrono_master.png' },
    // Core Legendary
    eternity_weaver_laser: { path: 'weapons/lasers/eternity_weaver.png' },

    // ------------- MELEE ATTACK IMAGES -------------
    // Basic Common
    monks_fist_melee: { path: 'weapons/melee/monks_fist.png' },
    cleaver_melee: { path: 'weapons/melee/cleaver.png' },
    whip_lash_melee: { path: 'weapons/melee/whip_lash.png' },
    battle_axe_melee: { path: 'weapons/melee/battle_axe.png' },
    claw_strike_melee: { path: 'weapons/melee/claw_strike.png' },
    rusty_blade_melee: { path: 'weapons/melee/rusty_blade.png' },
    // Basic Uncommon
    phantom_blade_melee: { path: 'weapons/melee/phantom_blade.png' },
    flame_scythe_melee: { path: 'weapons/melee/flame_scythe.png' },
    thunder_hammer_melee: { path: 'weapons/melee/thunder_hammer.png' },
    blood_razor_melee: { path: 'weapons/melee/blood_razor.png' },
    crescent_moon_melee: { path: 'weapons/melee/crescent_moon.png' },
    berserker_blade_melee: { path: 'weapons/melee/berserker_blade.png' },
    blood_cleaver_melee: { path: 'weapons/melee/blood_cleaver.png' },
    primal_strike_melee: { path: 'weapons/melee/primal_strike.png' },
    lightning_lash_melee: { path: 'weapons/melee/lightning_lash.png' },
    blade_storm_melee: { path: 'weapons/melee/blade_storm.png' },
    umbral_wave_melee: { path: 'weapons/melee/umbral_wave.png' },
    // Basic Rare
    void_reaver_melee: { path: 'weapons/melee/void_reaver.png' },
    storm_caller_melee: { path: 'weapons/melee/storm_caller.png' },
    mirrorblade_melee: { path: 'weapons/melee/mirrorblade.png' },
    soulrender_melee: { path: 'weapons/melee/soulrender.png' },
    // Basic Epic
    ragnarok_melee: { path: 'weapons/melee/ragnarok.png' },
    infinity_gauntlet_melee: { path: 'weapons/melee/infinity_gauntlet.png' },
    genesis_blade_melee: { path: 'weapons/melee/genesis_blade.png' },
    // Core Common
    shadow_blade_melee: { path: 'weapons/melee/shadow_blade.png' },
    steel_hammer_melee: { path: 'weapons/melee/steel_hammer.png' },
    blood_scythe_melee: { path: 'weapons/melee/blood_scythe.png' },
    beast_claw_melee: { path: 'weapons/melee/beast_claw.png' },
    // Core Uncommon
    crimson_reaper_melee: { path: 'weapons/melee/crimson_reaper.png' },
    feral_strike_melee: { path: 'weapons/melee/feral_strike.png' },
    iron_crusher_melee: { path: 'weapons/melee/iron_crusher.png' },
    phantom_edge_melee: { path: 'weapons/melee/phantom_edge.png' },
    // Core Rare
    alpha_predator_melee: { path: 'weapons/melee/alpha_predator.png' },
    nightmare_slash_melee: { path: 'weapons/melee/nightmare_slash.png' },
    soul_harvester_melee: { path: 'weapons/melee/soul_harvester.png' },
    titan_maul_melee: { path: 'weapons/melee/titan_maul.png' },
    // Core Epic
    adamantine_breaker_melee: { path: 'weapons/melee/adamantine_breaker.png' },
    beast_king_melee: { path: 'weapons/melee/beast_king.png' },
    blood_lord_melee: { path: 'weapons/melee/blood_lord.png' },
    void_assassin_melee: { path: 'weapons/melee/void_assassin.png' },
    // Core Legendary
    eternal_bloodlust_melee: { path: 'weapons/melee/eternal_bloodlust.png' },
    mjolnir_melee: { path: 'weapons/melee/mjolnir.png' },
    oblivion_blade_melee: { path: 'weapons/melee/oblivion_blade.png' },
    primal_god_melee: { path: 'weapons/melee/primal_god.png' },

    // ------------- AREA DAMAGE ATTACK IMAGES -------------
    // Basic Common
    frost_circle_area: { path: 'weapons/areas/frost_circle.png' },
    ember_field_area: { path: 'weapons/areas/ember_field.png' },
    shadow_pool_area: { path: 'weapons/areas/shadow_pool.png' },
    holy_ground_area: { path: 'weapons/areas/holy_ground.png' },
    poison_puddle_area: { path: 'weapons/areas/poison_puddle.png' },
    // Basic Uncommon
    toxic_spores_area: { path: 'weapons/areas/toxic_spores.png' },
    gravity_well_area: { path: 'weapons/areas/gravity_well.png' },
    hallowed_ring_area: { path: 'weapons/areas/hallowed_ring.png' },
    meteor_crater_area: { path: 'weapons/areas/meteor_crater.png' },
    blizzard_zone_area: { path: 'weapons/areas/blizzard_zone.png' },
    elemental_clash_area: { path: 'weapons/areas/elemental_clash.png' },
    toxic_inferno_area: { path: 'weapons/areas/toxic_inferno.png' },
    radiant_ground_area: { path: 'weapons/areas/radiant_ground.png' },
    venomous_surge_area: { path: 'weapons/areas/venomous_surge.png' },
    inferno_swarm_area: { path: 'weapons/areas/inferno_swarm.png' },
    // Basic Rare
    aurora_field_area: { path: 'weapons/areas/aurora_field.png' },
    dimensional_rift_area: { path: 'weapons/areas/dimensional_rift.png' },
    supernova_core_area: { path: 'weapons/areas/supernova_core.png' },
    // Basic Epic
    void_emperor_area: { path: 'weapons/areas/void_emperor.png' },
    // Core Common
    void_rift_area: { path: 'weapons/areas/void_rift.png' },
    venom_spore_area: { path: 'weapons/areas/venom_spore.png' },
    earth_spike_area: { path: 'weapons/areas/earth_spike.png' },
    // Core Uncommon
    toxic_bloom_area: { path: 'weapons/areas/toxic_bloom.png' },
    stone_cascade_area: { path: 'weapons/areas/stone_cascade.png' },
    null_tear_area: { path: 'weapons/areas/null_tear.png' },
    // Core Rare
    dimension_rend_area: { path: 'weapons/areas/dimension_rend.png' },
    plague_forest_area: { path: 'weapons/areas/plague_forest.png' },
    tectonic_surge_area: { path: 'weapons/areas/tectonic_surge.png' },
    // Core Epic
    earthquake_area: { path: 'weapons/areas/earthquake.png' },
    nature_wrath_area: { path: 'weapons/areas/nature_wrath.png' },
    reality_collapse_area: { path: 'weapons/areas/reality_collapse.png' },
    // Core Legendary
    continental_drift_area: { path: 'weapons/areas/continental_drift.png' },
    world_tree_area: { path: 'weapons/areas/world_tree.png' },
    void_god_area: { path: 'weapons/areas/void_god.png' },

    // ------------- PARTICLE/BLADE ATTACK IMAGES -------------
    // Basic Common
    orbiting_stones_blade: { path: 'weapons/particles/orbiting_stones.png' },
    spark_chain_blade: { path: 'weapons/particles/spark_chain.png' },
    spirit_wisps_blade: { path: 'weapons/particles/spirit_wisps.png' },
    fire_motes_blade: { path: 'weapons/particles/fire_motes.png' },
    // Basic Uncommon
    arc_lightning_blade: { path: 'weapons/particles/arc_lightning.png' },
    blade_vortex_blade: { path: 'weapons/particles/blade_vortex.png' },
    toxic_chain_blade: { path: 'weapons/particles/toxic_chain.png' },
    flame_dancers_blade: { path: 'weapons/particles/flame_dancers.png' },
    soul_orbit_blade: { path: 'weapons/particles/soul_orbit.png' },
    // Basic Rare
    celestial_orbit_blade: { path: 'weapons/particles/celestial_orbit.png' },
    cascade_lightning_blade: { path: 'weapons/particles/cascade_lightning.png' },
    orbital_bombardment_blade: { path: 'weapons/particles/orbital_bombardment.png' },
    // Basic Epic
    heavens_wrath_blade: { path: 'weapons/particles/heavens_wrath.png' },
    soul_nexus_blade: { path: 'weapons/particles/soul_nexus.png' },
    // Core Common
    thunder_strike_blade: { path: 'weapons/particles/thunder_strike.png' },

    // ------------- MINE ATTACK IMAGES -------------
    // Basic Common
    flash_bomb_mine: { path: 'weapons/mines/flash_bomb.png' },
    ice_bomb_mine: { path: 'weapons/mines/ice_bomb.png' },
    spike_trap_mine: { path: 'weapons/mines/spike_trap.png' },
    // Basic Uncommon
    cluster_mine_mine: { path: 'weapons/mines/cluster_mine.png' },
    magnetic_mine_mine: { path: 'weapons/mines/magnetic_mine.png' },
    chain_reaction_mine_mine: { path: 'weapons/mines/chain_reaction_mine.png' },
    explosive_trap_mine: { path: 'weapons/mines/explosive_trap.png' },
    // Basic Rare
    quantum_mine_mine: { path: 'weapons/mines/quantum_mine.png' },
    void_anchor_mine: { path: 'weapons/mines/void_anchor.png' },
    // Basic Epic
    apocalypse_engine_mine: { path: 'weapons/mines/apocalypse_engine.png' },

    // ------------- SUMMON ATTACK IMAGES -------------
    // Basic Common
    skeleton_minion_summon: { path: 'weapons/summons/skeleton_minion.png' },
    fire_sprite_summon: { path: 'weapons/summons/fire_sprite.png' },
    // Basic Uncommon
    shadow_clone_summon: { path: 'weapons/summons/shadow_clone.png' },
    frost_elemental_summon: { path: 'weapons/summons/frost_elemental.png' },
    undead_legion_summon: { path: 'weapons/summons/undead_legion.png' },
    // Basic Rare
    phoenix_guardian_summon: { path: 'weapons/summons/phoenix_guardian.png' },
    // Basic Epic
    world_serpent_summon: { path: 'weapons/summons/world_serpent.png' },
  };

  // ============================================
  // Sprite Sheets
  // ============================================
  var SPRITE_SHEETS = {
    // Example sprite sheet definition (can be used later)
    // ui_icons: {
    //   path: 'ui/icons_sheet.png',
    //   frames: [
    //     { id: 'icon_damage', x: 0, y: 0, width: 32, height: 32 },
    //     { id: 'icon_speed', x: 32, y: 0, width: 32, height: 32 },
    //   ]
    // }
  };

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get all assets to load
   * @returns {Array<Object>}
   */
  function getAllAssets() {
    var assets = [];

    // Add individual images
    for (var id in IMAGES) {
      if (IMAGES.hasOwnProperty(id)) {
        assets.push({
          id: id,
          path: IMAGES[id].path,
          type: 'single',
        });
      }
    }

    // Add sprite sheets
    for (var sheetId in SPRITE_SHEETS) {
      if (SPRITE_SHEETS.hasOwnProperty(sheetId)) {
        var sheet = SPRITE_SHEETS[sheetId];
        assets.push({
          id: sheetId,
          path: sheet.path,
          type: 'spritesheet',
          frames: sheet.frames,
        });
      }
    }

    return assets;
  }

  /**
   * Get image config by ID
   * @param {string} imageId
   * @returns {Object|null}
   */
  function getImageConfig(imageId) {
    return IMAGES[imageId] || null;
  }

  /**
   * Get sprite sheet config by ID
   * @param {string} sheetId
   * @returns {Object|null}
   */
  function getSpriteSheetConfig(sheetId) {
    return SPRITE_SHEETS[sheetId] || null;
  }

  /**
   * Get base path for images
   * @returns {string}
   */
  function getBasePath() {
    return BASE_PATH;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.ImageConfig = {
    IMAGES: IMAGES,
    SPRITE_SHEETS: SPRITE_SHEETS,
    getAllAssets: getAllAssets,
    getImageConfig: getImageConfig,
    getSpriteSheetConfig: getSpriteSheetConfig,
    getBasePath: getBasePath,
  };
})(window.VampireSurvivors.Data);
