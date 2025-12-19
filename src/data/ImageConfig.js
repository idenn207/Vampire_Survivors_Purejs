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

    // ------------- COMMON WEAPONS (Tier 1) -------------
    weapon_arcane_dart: { path: 'weapons/common/arcane_dart.png' },
    weapon_stone_throw: { path: 'weapons/common/stone_throw.png' },
    weapon_ice_shard: { path: 'weapons/common/ice_shard.png' },
    weapon_ember_bolt: { path: 'weapons/common/ember_bolt.png' },
    weapon_spectral_arrow: { path: 'weapons/common/spectral_arrow.png' },
    weapon_scatter_shot: { path: 'weapons/common/scatter_shot.png' },
    weapon_venom_fang: { path: 'weapons/common/venom_fang.png' },
    weapon_wind_cutter: { path: 'weapons/common/wind_cutter.png' },
    weapon_rusty_blade: { path: 'weapons/common/rusty_blade.png' },
    weapon_monks_fist: { path: 'weapons/common/monks_fist.png' },
    weapon_cleaver: { path: 'weapons/common/cleaver.png' },
    weapon_whip_lash: { path: 'weapons/common/whip_lash.png' },
    weapon_battle_axe: { path: 'weapons/common/battle_axe.png' },
    weapon_claw_strike: { path: 'weapons/common/claw_strike.png' },
    weapon_poison_puddle: { path: 'weapons/common/poison_puddle.png' },
    weapon_frost_circle: { path: 'weapons/common/frost_circle.png' },
    weapon_ember_field: { path: 'weapons/common/ember_field.png' },
    weapon_shadow_pool: { path: 'weapons/common/shadow_pool.png' },
    weapon_holy_ground: { path: 'weapons/common/holy_ground.png' },
    weapon_orbiting_stones: { path: 'weapons/common/orbiting_stones.png' },
    weapon_spark_chain: { path: 'weapons/common/spark_chain.png' },
    weapon_spirit_wisps: { path: 'weapons/common/spirit_wisps.png' },
    weapon_fire_motes: { path: 'weapons/common/fire_motes.png' },
    weapon_spike_trap: { path: 'weapons/common/spike_trap.png' },
    weapon_flash_bomb: { path: 'weapons/common/flash_bomb.png' },
    weapon_ice_bomb: { path: 'weapons/common/ice_bomb.png' },
    weapon_light_ray: { path: 'weapons/common/light_ray.png' },
    weapon_shadow_beam: { path: 'weapons/common/shadow_beam.png' },
    weapon_skeleton_minion: { path: 'weapons/common/skeleton_minion.png' },
    weapon_fire_sprite: { path: 'weapons/common/fire_sprite.png' },

    // ------------- UNCOMMON WEAPONS (Tier 2) -------------
    weapon_bifrost_bolt: { path: 'weapons/uncommon/bifrost_bolt.png' },
    weapon_homing_missile: { path: 'weapons/uncommon/homing_missile.png' },
    weapon_ricochet_shot: { path: 'weapons/uncommon/ricochet_shot.png' },
    weapon_split_arrow: { path: 'weapons/uncommon/split_arrow.png' },
    weapon_plasma_orb: { path: 'weapons/uncommon/plasma_orb.png' },
    weapon_chakram: { path: 'weapons/uncommon/chakram.png' },
    weapon_void_bullet: { path: 'weapons/uncommon/void_bullet.png' },
    weapon_crystal_lance: { path: 'weapons/uncommon/crystal_lance.png' },
    weapon_phantom_blade: { path: 'weapons/uncommon/phantom_blade.png' },
    weapon_flame_scythe: { path: 'weapons/uncommon/flame_scythe.png' },
    weapon_thunder_hammer: { path: 'weapons/uncommon/thunder_hammer.png' },
    weapon_blood_razor: { path: 'weapons/uncommon/blood_razor.png' },
    weapon_crescent_moon: { path: 'weapons/uncommon/crescent_moon.png' },
    weapon_toxic_spores: { path: 'weapons/uncommon/toxic_spores.png' },
    weapon_gravity_well: { path: 'weapons/uncommon/gravity_well.png' },
    weapon_hallowed_ring: { path: 'weapons/uncommon/hallowed_ring.png' },
    weapon_meteor_crater: { path: 'weapons/uncommon/meteor_crater.png' },
    weapon_blizzard_zone: { path: 'weapons/uncommon/blizzard_zone.png' },
    weapon_soul_orbit: { path: 'weapons/uncommon/soul_orbit.png' },
    weapon_arc_lightning: { path: 'weapons/uncommon/arc_lightning.png' },
    weapon_blade_vortex: { path: 'weapons/uncommon/blade_vortex.png' },
    weapon_toxic_chain: { path: 'weapons/uncommon/toxic_chain.png' },
    weapon_flame_dancers: { path: 'weapons/uncommon/flame_dancers.png' },
    weapon_cluster_mine: { path: 'weapons/uncommon/cluster_mine.png' },
    weapon_magnetic_mine: { path: 'weapons/uncommon/magnetic_mine.png' },
    weapon_chain_reaction_mine: { path: 'weapons/uncommon/chain_reaction_mine.png' },
    weapon_prismatic_ray: { path: 'weapons/uncommon/prismatic_ray.png' },
    weapon_piercing_gaze: { path: 'weapons/uncommon/piercing_gaze.png' },
    weapon_shadow_clone: { path: 'weapons/uncommon/shadow_clone.png' },
    weapon_frost_elemental: { path: 'weapons/uncommon/frost_elemental.png' },
    weapon_arcane_cannon: { path: 'weapons/uncommon/arcane_cannon.png' },
    weapon_death_ray: { path: 'weapons/uncommon/death_ray.png' },
    weapon_blade_storm: { path: 'weapons/uncommon/blade_storm.png' },
    weapon_toxic_inferno: { path: 'weapons/uncommon/toxic_inferno.png' },
    weapon_storm_blades: { path: 'weapons/uncommon/storm_blades.png' },
    weapon_spread_seeker: { path: 'weapons/uncommon/spread_seeker.png' },
    weapon_blood_cleaver: { path: 'weapons/uncommon/blood_cleaver.png' },
    weapon_blazing_bolt: { path: 'weapons/uncommon/blazing_bolt.png' },
    weapon_frozen_burst: { path: 'weapons/uncommon/frozen_burst.png' },
    weapon_phantom_volley: { path: 'weapons/uncommon/phantom_volley.png' },
    weapon_storm_scatter: { path: 'weapons/uncommon/storm_scatter.png' },
    weapon_venomous_surge: { path: 'weapons/uncommon/venomous_surge.png' },
    weapon_primal_strike: { path: 'weapons/uncommon/primal_strike.png' },
    weapon_berserker_blade: { path: 'weapons/uncommon/berserker_blade.png' },
    weapon_lightning_lash: { path: 'weapons/uncommon/lightning_lash.png' },
    weapon_mystic_arrow: { path: 'weapons/uncommon/mystic_arrow.png' },
    weapon_umbral_wave: { path: 'weapons/uncommon/umbral_wave.png' },
    weapon_radiant_ground: { path: 'weapons/uncommon/radiant_ground.png' },
    weapon_explosive_trap: { path: 'weapons/uncommon/explosive_trap.png' },
    weapon_rock_storm: { path: 'weapons/uncommon/rock_storm.png' },
    weapon_undead_legion: { path: 'weapons/uncommon/undead_legion.png' },
    weapon_elemental_clash: { path: 'weapons/uncommon/elemental_clash.png' },
    weapon_inferno_swarm: { path: 'weapons/uncommon/inferno_swarm.png' },
    weapon_arcane_scatter: { path: 'weapons/uncommon/arcane_scatter.png' },

    // ------------- RARE WEAPONS (Tier 3) -------------
    weapon_moonlight_slash: { path: 'weapons/rare/moonlight_slash.png' },
    weapon_constellation_arrow: { path: 'weapons/rare/constellation_arrow.png' },
    weapon_quantum_mine: { path: 'weapons/rare/quantum_mine.png' },
    weapon_phoenix_feather: { path: 'weapons/rare/phoenix_feather.png' },
    weapon_dragonbreath_volley: { path: 'weapons/rare/dragonbreath_volley.png' },
    weapon_phoenix_guardian: { path: 'weapons/rare/phoenix_guardian.png' },
    weapon_storm_caller: { path: 'weapons/rare/storm_caller.png' },
    weapon_mirrorblade: { path: 'weapons/rare/mirrorblade.png' },
    weapon_soulrender: { path: 'weapons/rare/soulrender.png' },
    weapon_singularity_orb: { path: 'weapons/rare/singularity_orb.png' },
    weapon_celestial_orbit: { path: 'weapons/rare/celestial_orbit.png' },
    weapon_aurora_field: { path: 'weapons/rare/aurora_field.png' },
    weapon_orbital_bombardment: { path: 'weapons/rare/orbital_bombardment.png' },
    weapon_dimensional_rift: { path: 'weapons/rare/dimensional_rift.png' },
    weapon_void_reaver: { path: 'weapons/rare/void_reaver.png' },
    weapon_cascade_lightning: { path: 'weapons/rare/cascade_lightning.png' },
    weapon_supernova_core: { path: 'weapons/rare/supernova_core.png' },
    weapon_temporal_bolt: { path: 'weapons/rare/temporal_bolt.png' },
    weapon_sunbeam: { path: 'weapons/rare/sunbeam.png' },
    weapon_void_anchor: { path: 'weapons/rare/void_anchor.png' },

    // ------------- EPIC WEAPONS (Tier 4) -------------
    weapon_ragnarok: { path: 'weapons/epic/ragnarok.png' },
    weapon_cosmic_annihilator: { path: 'weapons/epic/cosmic_annihilator.png' },
    weapon_world_serpent: { path: 'weapons/epic/world_serpent.png' },
    weapon_infinity_gauntlet: { path: 'weapons/epic/infinity_gauntlet.png' },
    weapon_chrono_shatter: { path: 'weapons/epic/chrono_shatter.png' },
    weapon_void_emperor: { path: 'weapons/epic/void_emperor.png' },
    weapon_heavens_wrath: { path: 'weapons/epic/heavens_wrath.png' },
    weapon_soul_nexus: { path: 'weapons/epic/soul_nexus.png' },
    weapon_apocalypse_engine: { path: 'weapons/epic/apocalypse_engine.png' },
    weapon_genesis_blade: { path: 'weapons/epic/genesis_blade.png' },

    // ------------- CORE WEAPONS (Tier 1) -------------
    weapon_inferno_bolt: { path: 'weapons/core/inferno_bolt.png' },
    weapon_frost_shard: { path: 'weapons/core/frost_shard.png' },
    weapon_thunder_strike: { path: 'weapons/core/thunder_strike.png' },
    weapon_shadow_blade: { path: 'weapons/core/shadow_blade.png' },
    weapon_blood_scythe: { path: 'weapons/core/blood_scythe.png' },
    weapon_arcane_barrage: { path: 'weapons/core/arcane_barrage.png' },
    weapon_venom_spore: { path: 'weapons/core/venom_spore.png' },
    weapon_steel_hammer: { path: 'weapons/core/steel_hammer.png' },
    weapon_wind_cutter_core: { path: 'weapons/core/wind_cutter_core.png' },
    weapon_earth_spike: { path: 'weapons/core/earth_spike.png' },
    weapon_void_rift: { path: 'weapons/core/void_rift.png' },
    weapon_holy_lance: { path: 'weapons/core/holy_lance.png' },
    weapon_tech_turret: { path: 'weapons/core/tech_turret.png' },
    weapon_beast_claw: { path: 'weapons/core/beast_claw.png' },
    weapon_chrono_beam: { path: 'weapons/core/chrono_beam.png' },

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
          type: 'single'
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
          frames: sheet.frames
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
    getBasePath: getBasePath
  };
})(window.VampireSurvivors.Data);
