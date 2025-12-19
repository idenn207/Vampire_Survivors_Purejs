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

    // ------------- BASE WEAPONS -------------
    weapon_magic_missile: { path: 'weapons/magic_missile.png' },
    weapon_rifle: { path: 'weapons/rifle.png' },
    weapon_shotgun: { path: 'weapons/shotgun.png' },
    weapon_laser_gun: { path: 'weapons/laser_gun.png' },
    weapon_auto_laser: { path: 'weapons/auto_laser.png' },
    weapon_sword_slash: { path: 'weapons/sword_slash.png' },
    weapon_auto_blade: { path: 'weapons/auto_blade.png' },
    weapon_poison_cloud: { path: 'weapons/poison_cloud.png' },
    weapon_fire_zone: { path: 'weapons/fire_zone.png' },
    weapon_rotating_blade: { path: 'weapons/rotating_blade.png' },
    weapon_chain_lightning: { path: 'weapons/chain_lightning.png' },
    weapon_proximity_mine: { path: 'weapons/proximity_mine.png' },
    weapon_spirit_companion: { path: 'weapons/spirit_companion.png' },
    weapon_spread_shot: { path: 'weapons/spread_shot.png' },
    weapon_homing_orb: { path: 'weapons/homing_orb.png' },
    weapon_lightning_aura: { path: 'weapons/lightning_aura.png' },
    weapon_frost_nova: { path: 'weapons/frost_nova.png' },

    // ------------- EVOLVED WEAPONS -------------
    weapon_arcane_cannon: { path: 'weapons/arcane_cannon.png' },
    weapon_death_ray: { path: 'weapons/death_ray.png' },
    weapon_blade_storm: { path: 'weapons/blade_storm.png' },
    weapon_toxic_inferno: { path: 'weapons/toxic_inferno.png' },
    weapon_storm_blades: { path: 'weapons/storm_blades.png' },
    weapon_spread_seeker: { path: 'weapons/spread_seeker.png' },

    // ------------- CORE WEAPONS -------------
    weapon_inferno_bolt: { path: 'weapons/inferno_bolt.png' },
    weapon_frost_shard: { path: 'weapons/frost_shard.png' },
    weapon_thunder_strike: { path: 'weapons/thunder_strike.png' },
    weapon_shadow_blade: { path: 'weapons/shadow_blade.png' },
    weapon_blood_scythe: { path: 'weapons/blood_scythe.png' },
    weapon_arcane_barrage: { path: 'weapons/arcane_barrage.png' },
    weapon_venom_spore: { path: 'weapons/venom_spore.png' },
    weapon_steel_hammer: { path: 'weapons/steel_hammer.png' },
    weapon_wind_cutter: { path: 'weapons/wind_cutter.png' },
    weapon_earth_spike: { path: 'weapons/earth_spike.png' },
    weapon_void_rift: { path: 'weapons/void_rift.png' },
    weapon_holy_lance: { path: 'weapons/holy_lance.png' },
    weapon_tech_turret: { path: 'weapons/tech_turret.png' },
    weapon_beast_claw: { path: 'weapons/beast_claw.png' },
    weapon_chrono_beam: { path: 'weapons/chrono_beam.png' },

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
