/**
 * @fileoverview Weapon data definitions - data-driven weapon configurations
 * @module Data/WeaponData
 */
(function (Data) {
  'use strict';

  // ============================================
  // Attack Type Constants
  // ============================================
  var AttackType = {
    PROJECTILE: 'projectile',
    LASER: 'laser',
    MELEE_SWING: 'melee_swing',
    AREA_DAMAGE: 'area_damage',
    PARTICLE: 'particle',
    MINE: 'mine',
    SUMMON: 'summon',
  };

  // ============================================
  // Targeting Mode Constants
  // ============================================
  var TargetingMode = {
    NEAREST: 'nearest',
    RANDOM: 'random',
    WEAKEST: 'weakest',
    MOUSE: 'mouse',
    ROTATING: 'rotating',
    CHAIN: 'chain',
  };

  // ============================================
  // Weapon Definitions
  // ============================================
  var WeaponData = {
    // ------------------------------------
    // PROJECTILE WEAPONS
    // ------------------------------------
    magic_missile: {
      id: 'magic_missile',
      name: 'Magic Missile',
      attackType: AttackType.PROJECTILE,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      // Tier properties
      tier: 1,
      isExclusive: false,
      maxTier: 4,

      // Base stats (level 1)
      damage: 20,
      cooldown: 1.0,
      projectileCount: 1,
      projectileSpeed: 400,
      range: 400,
      pierce: 0,
      spread: 0,

      // Visual
      color: '#0088FF',
      size: 8,
      shape: 'circle',
      lifetime: 3.0,
      icon: 'magic_orb', // Glowing magic orb
      imageId: 'weapon_magic_missile',

      // Upgrades per level
      upgrades: {
        2: { damage: 25, projectileCount: 2 },
        3: { damage: 32, range: 500, pierce: 1 },
        4: { damage: 40, projectileCount: 3, cooldown: 0.8 },
        5: { damage: 55, pierce: 2, range: 600 },
      },
      maxLevel: 5,
    },

    rifle: {
      id: 'rifle',
      name: 'Rifle',
      attackType: AttackType.PROJECTILE,
      targetingMode: TargetingMode.MOUSE,
      isAuto: false,

      // Tier properties
      tier: 1,
      isExclusive: false,
      maxTier: 4,

      damage: 15,
      cooldown: 0.33,
      projectileCount: 1,
      projectileSpeed: 600,
      range: 500,
      pierce: 0,
      spread: 0,

      color: '#FFAA00',
      size: 6,
      shape: 'circle',
      lifetime: 2.0,
      icon: 'rifle', // Rifle barrel
      imageId: 'weapon_rifle',

      upgrades: {
        2: { damage: 18, cooldown: 0.28 },
        3: { damage: 22, pierce: 1, projectileCount: 2 },
        4: { damage: 28, cooldown: 0.25, pierce: 2 },
        5: { damage: 38, projectileCount: 3, pierce: 3 },
      },
      maxLevel: 5,
    },

    shotgun: {
      id: 'shotgun',
      name: 'Shotgun',
      attackType: AttackType.PROJECTILE,
      targetingMode: TargetingMode.MOUSE,
      isAuto: false,

      // Tier properties
      tier: 1,
      isExclusive: false,
      maxTier: 4,

      damage: 12,
      cooldown: 1.2,
      projectileCount: 5,
      projectileSpeed: 500,
      range: 300,
      pierce: 0,
      spread: 30,

      color: '#FF8844',
      size: 5,
      shape: 'circle',
      lifetime: 1.5,
      icon: 'shotgun', // Spread pattern
      imageId: 'weapon_shotgun',

      upgrades: {
        2: { damage: 14, projectileCount: 7 },
        3: { damage: 17, range: 350, spread: 40 },
        4: { damage: 21, projectileCount: 9, cooldown: 1.0 },
        5: { damage: 27, projectileCount: 12, spread: 50 },
      },
      maxLevel: 5,
    },

    // ------------------------------------
    // LASER WEAPONS
    // ------------------------------------
    laser_gun: {
      id: 'laser_gun',
      name: 'Laser Gun',
      attackType: AttackType.LASER,
      targetingMode: TargetingMode.MOUSE,
      isAuto: false,

      // Tier properties
      tier: 1,
      isExclusive: false,
      maxTier: 4,

      damage: 50,
      cooldown: 2.0,
      duration: 0.5,
      width: 5,
      range: 800,
      pierce: 999,
      tickRate: 10,

      color: '#00FFFF',
      icon: 'laser_beam', // Concentrated beam
      imageId: 'weapon_laser_gun',

      upgrades: {
        2: { damage: 60, width: 8 },
        3: { damage: 75, duration: 0.7 },
        4: { damage: 95, width: 12, cooldown: 1.7 },
        5: { damage: 130, duration: 1.0 },
      },
      maxLevel: 5,
    },

    auto_laser: {
      id: 'auto_laser',
      name: 'Auto Laser',
      attackType: AttackType.LASER,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      // Tier properties
      tier: 1,
      isExclusive: false,
      maxTier: 4,

      damage: 35,
      cooldown: 1.5,
      duration: 0.3,
      width: 4,
      range: 500,
      pierce: 999,
      tickRate: 8,

      color: '#FF00FF',
      icon: 'auto_laser', // Auto-targeting laser
      imageId: 'weapon_auto_laser',

      upgrades: {
        2: { damage: 45, range: 600 },
        3: { damage: 55, width: 6, duration: 0.4 },
        4: { damage: 70, cooldown: 1.2 },
        5: { damage: 95, range: 700, width: 8 },
      },
      maxLevel: 5,
    },

    // ------------------------------------
    // MELEE WEAPONS
    // ------------------------------------
    sword_slash: {
      id: 'sword_slash',
      name: 'Sword Slash',
      attackType: AttackType.MELEE_SWING,
      targetingMode: TargetingMode.MOUSE,
      isAuto: false,

      // Tier properties
      tier: 1,
      isExclusive: false,
      maxTier: 4,

      damage: 35,
      cooldown: 1.0,
      range: 60,
      arcAngle: 90,
      swingDuration: 0.2,
      hitsPerSwing: 1,
      doubleSwing: false, // When true, swings forward then backward

      color: '#CCCCCC',
      icon: 'sword', // Sword blade
      imageId: 'weapon_sword_slash',

      upgrades: {
        2: { damage: 45, hitsPerSwing: 2 },
        3: { damage: 55, range: 75, arcAngle: 110 },
        4: { damage: 70, hitsPerSwing: 3, cooldown: 0.85, doubleSwing: true },
        5: { damage: 95, range: 90, arcAngle: 130, hitsPerSwing: 4 },
      },
      maxLevel: 5,
    },

    auto_blade: {
      id: 'auto_blade',
      name: 'Auto Blade',
      attackType: AttackType.MELEE_SWING,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      // Tier properties
      tier: 1,
      isExclusive: false,
      maxTier: 4,

      damage: 25,
      cooldown: 0.8,
      range: 50,
      arcAngle: 120,
      swingDuration: 0.15,
      hitsPerSwing: 1,
      doubleSwing: false, // When true, swings forward then backward

      color: '#AAAAAA',
      icon: 'dagger', // Quick blade
      imageId: 'weapon_auto_blade',

      upgrades: {
        2: { damage: 32, cooldown: 0.7 },
        3: { damage: 40, range: 65, hitsPerSwing: 2 },
        4: { damage: 52, arcAngle: 150, cooldown: 0.6, doubleSwing: true },
        5: { damage: 70, range: 80, hitsPerSwing: 3 },
      },
      maxLevel: 5,
    },

    // ------------------------------------
    // AREA DAMAGE WEAPONS
    // ------------------------------------
    poison_cloud: {
      id: 'poison_cloud',
      name: 'Poison Cloud',
      attackType: AttackType.AREA_DAMAGE,
      targetingMode: TargetingMode.RANDOM,
      isAuto: true,

      // Tier properties
      tier: 1,
      isExclusive: false,
      maxTier: 4,

      damage: 8,
      cooldown: 3.0,
      radius: 60,
      duration: 4.0,
      tickRate: 2,
      cloudCount: 1,
      spawnRange: 200,

      color: '#00FF00',
      icon: 'poison', // Toxic cloud
      imageId: 'weapon_poison_cloud',

      upgrades: {
        2: { damage: 10, duration: 5.0 },
        3: { damage: 13, radius: 80, cloudCount: 2 },
        4: { damage: 17, tickRate: 3, duration: 6.0 },
        5: { damage: 22, cloudCount: 3, radius: 100 },
      },
      maxLevel: 5,
    },

    fire_zone: {
      id: 'fire_zone',
      name: 'Fire Zone',
      attackType: AttackType.AREA_DAMAGE,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      // Tier properties
      tier: 1,
      isExclusive: false,
      maxTier: 4,

      damage: 12,
      cooldown: 2.5,
      radius: 50,
      duration: 5.0,
      tickRate: 3,
      cloudCount: 1,
      spawnRange: 150,

      color: '#FF6600',
      icon: 'fire', // Burning ground
      imageId: 'weapon_fire_zone',

      upgrades: {
        2: { damage: 15, tickRate: 4 },
        3: { damage: 19, radius: 70, cloudCount: 2 },
        4: { damage: 24, duration: 6.0, tickRate: 5 },
        5: { damage: 32, cloudCount: 3, radius: 90 },
      },
      maxLevel: 5,
    },

    // ------------------------------------
    // PARTICLE WEAPONS
    // ------------------------------------
    rotating_blade: {
      id: 'rotating_blade',
      name: 'Rotating Blade',
      attackType: AttackType.PARTICLE,
      targetingMode: TargetingMode.ROTATING,
      isAuto: true,

      // Tier properties
      tier: 1,
      isExclusive: false,
      maxTier: 4,

      damage: 25,
      cooldown: 0,
      bladeCount: 4,
      orbitRadius: 80,
      rotationSpeed: 3,
      hitCooldown: 0.5,

      color: '#CCCCCC',
      size: 12,
      icon: 'spinning_blade', // Circular blade
      imageId: 'weapon_rotating_blade',

      upgrades: {
        2: { damage: 32, bladeCount: 5 },
        3: { damage: 40, orbitRadius: 100, rotationSpeed: 4 },
        4: { damage: 52, bladeCount: 6 },
        5: { damage: 70, orbitRadius: 120, bladeCount: 8 },
      },
      maxLevel: 5,
    },

    chain_lightning: {
      id: 'chain_lightning',
      name: 'Chain Lightning',
      attackType: AttackType.PARTICLE,
      targetingMode: TargetingMode.CHAIN,
      isAuto: true,

      // Tier properties
      tier: 1,
      isExclusive: false,
      maxTier: 4,

      damage: 30,
      cooldown: 1.5,
      chainCount: 3,
      chainRange: 150,
      chainDamageDecay: 0.7,
      range: 400,

      color: '#FFFF00',
      icon: 'lightning', // Electric bolt
      imageId: 'weapon_chain_lightning',

      upgrades: {
        2: { damage: 38, chainCount: 4 },
        3: { damage: 48, chainRange: 180, chainDamageDecay: 0.75 },
        4: { damage: 62, chainCount: 5, cooldown: 1.3 },
        5: { damage: 85, chainCount: 7, chainRange: 200 },
      },
      maxLevel: 5,
    },

    // ------------------------------------
    // MINE WEAPONS
    // ------------------------------------
    proximity_mine: {
      id: 'proximity_mine',
      name: 'Proximity Mine',
      attackType: AttackType.MINE,
      targetingMode: TargetingMode.RANDOM,
      isAuto: true,

      // Tier properties
      tier: 1,
      isExclusive: false,
      maxTier: 4,

      damage: 80,
      cooldown: 3.0,
      mineCount: 1,
      explosionRadius: 60,
      triggerRadius: 40,
      duration: 15.0,
      spawnRange: 150,

      color: '#FF4444',
      icon: 'mine', // Explosive trap
      imageId: 'weapon_proximity_mine',

      upgrades: {
        2: { damage: 100, mineCount: 2 },
        3: { damage: 130, explosionRadius: 80, triggerRadius: 50 },
        4: { damage: 170, mineCount: 3, cooldown: 2.5 },
        5: { damage: 220, explosionRadius: 100, mineCount: 4 },
      },
      maxLevel: 5,
    },

    // ------------------------------------
    // SUMMON WEAPONS
    // ------------------------------------
    spirit_companion: {
      id: 'spirit_companion',
      name: 'Spirit Companion',
      attackType: AttackType.SUMMON,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      // Tier properties
      tier: 1,
      isExclusive: false,
      maxTier: 4,

      damage: 20,
      cooldown: 10.0,
      summonCount: 1,
      summonHealth: 50,
      attackCooldown: 1.0,
      attackRange: 50,
      summonSpeed: 150,
      duration: 15.0,

      color: '#88CCFF',
      icon: 'spirit', // Ghostly companion
      imageId: 'weapon_spirit_companion',

      upgrades: {
        2: { damage: 28, summonHealth: 70, summonCount: 2 },
        3: { damage: 38, summonSpeed: 180, attackRange: 60 },
        4: { damage: 50, summonCount: 3, duration: 20.0 },
        5: { damage: 70, summonHealth: 100, summonCount: 4 },
      },
      maxLevel: 5,
    },
  };

  // ============================================
  // Helper Functions
  // ============================================
  /**
   * Get weapon data by ID
   * @param {string} weaponId
   * @returns {Object|null}
   */
  function getWeaponData(weaponId) {
    return WeaponData[weaponId] || null;
  }

  /**
   * Get all weapons of a specific attack type
   * @param {string} attackType
   * @returns {Array<Object>}
   */
  function getWeaponsByType(attackType) {
    var result = [];
    for (var id in WeaponData) {
      if (WeaponData.hasOwnProperty(id) && WeaponData[id].attackType === attackType) {
        result.push(WeaponData[id]);
      }
    }
    return result;
  }

  /**
   * Get all auto weapons
   * @returns {Array<Object>}
   */
  function getAutoWeapons() {
    var result = [];
    for (var id in WeaponData) {
      if (WeaponData.hasOwnProperty(id) && WeaponData[id].isAuto) {
        result.push(WeaponData[id]);
      }
    }
    return result;
  }

  /**
   * Get all manual weapons
   * @returns {Array<Object>}
   */
  function getManualWeapons() {
    var result = [];
    for (var id in WeaponData) {
      if (WeaponData.hasOwnProperty(id) && !WeaponData[id].isAuto) {
        result.push(WeaponData[id]);
      }
    }
    return result;
  }

  /**
   * Get all weapon IDs
   * @returns {Array<string>}
   */
  function getAllWeaponIds() {
    return Object.keys(WeaponData);
  }

  /**
   * Get all weapons of a specific tier
   * @param {number} tier - Tier number (1-5)
   * @returns {Array<Object>}
   */
  function getWeaponsByTier(tier) {
    var result = [];
    for (var id in WeaponData) {
      if (WeaponData.hasOwnProperty(id) && WeaponData[id].tier === tier) {
        result.push(WeaponData[id]);
      }
    }
    return result;
  }

  /**
   * Get all exclusive weapons (can reach Tier 5)
   * @returns {Array<Object>}
   */
  function getExclusiveWeapons() {
    var result = [];
    for (var id in WeaponData) {
      if (WeaponData.hasOwnProperty(id) && WeaponData[id].isExclusive) {
        result.push(WeaponData[id]);
      }
    }
    return result;
  }

  /**
   * Check if weapon can evolve to a specific tier
   * @param {string} weaponId
   * @param {number} targetTier
   * @returns {boolean}
   */
  function canWeaponEvolveToTier(weaponId, targetTier) {
    var weapon = WeaponData[weaponId];
    if (!weapon) return false;
    return targetTier <= weapon.maxTier;
  }

  /**
   * Get weapon IDs by tier
   * @param {number} tier - Tier number (1-5)
   * @returns {Array<string>}
   */
  function getWeaponIdsByTier(tier) {
    var result = [];
    for (var id in WeaponData) {
      if (WeaponData.hasOwnProperty(id) && WeaponData[id].tier === tier) {
        result.push(id);
      }
    }
    return result;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.AttackType = AttackType;
  Data.TargetingMode = TargetingMode;
  Data.WeaponData = WeaponData;
  Data.getWeaponData = getWeaponData;
  Data.getWeaponsByType = getWeaponsByType;
  Data.getAutoWeapons = getAutoWeapons;
  Data.getManualWeapons = getManualWeapons;
  Data.getAllWeaponIds = getAllWeaponIds;
  Data.getWeaponsByTier = getWeaponsByTier;
  Data.getExclusiveWeapons = getExclusiveWeapons;
  Data.canWeaponEvolveToTier = canWeaponEvolveToTier;
  Data.getWeaponIdsByTier = getWeaponIdsByTier;
})(window.VampireSurvivors.Data = window.VampireSurvivors.Data || {});
