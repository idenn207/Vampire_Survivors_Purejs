/**
 * @fileoverview Core weapon data definitions - 15 dedicated starting weapons for each core
 * @module Data/CoreWeaponData
 */
(function (Data) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;

  // ============================================
  // Core Weapon Definitions
  // ============================================
  var CoreWeaponData = {
    // ========================================
    // 1. FIRE CORE - Flame Bolt
    // ========================================
    flame_bolt: {
      id: 'flame_bolt',
      name: 'Flame Bolt',
      coreId: 'fire_core',
      attackType: AttackType.PROJECTILE,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      // Tier properties
      tier: 1,
      isExclusive: false,
      maxTier: 5,

      // Base stats
      damage: 18,
      cooldown: 0.9,
      projectileCount: 1,
      projectileSpeed: 380,
      range: 400,
      pierce: 0,
      spread: 0,

      // Fire-specific
      burnDuration: 2.0,
      burnDamage: 4,

      // Visual
      color: '#FF4500',
      size: 10,
      shape: 'circle',
      lifetime: 3.0,
      icon: 'flame_bolt',

      // Upgrades
      upgrades: {
        2: { damage: 24, burnDamage: 6 },
        3: { damage: 30, pierce: 1, burnDuration: 2.5 },
        4: { damage: 40, projectileCount: 2, cooldown: 0.75 },
        5: { damage: 55, burnDamage: 10, pierce: 2 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 2. ICE CORE - Frost Shard
    // ========================================
    frost_shard: {
      id: 'frost_shard',
      name: 'Frost Shard',
      coreId: 'ice_core',
      attackType: AttackType.PROJECTILE,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 22,
      cooldown: 1.1,
      projectileCount: 1,
      projectileSpeed: 350,
      range: 420,
      pierce: 0,
      spread: 0,

      // Ice-specific
      slowAmount: 0.2,
      slowDuration: 1.5,

      color: '#00BFFF',
      size: 9,
      shape: 'diamond',
      lifetime: 3.0,
      icon: 'frost_shard',

      upgrades: {
        2: { damage: 28, slowAmount: 0.25 },
        3: { damage: 36, pierce: 1, slowDuration: 2.0 },
        4: { damage: 46, projectileCount: 2, cooldown: 0.95 },
        5: { damage: 60, slowAmount: 0.35, pierce: 2 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 3. LIGHTNING CORE - Spark Bolt
    // ========================================
    spark_bolt: {
      id: 'spark_bolt',
      name: 'Spark Bolt',
      coreId: 'lightning_core',
      attackType: AttackType.PARTICLE,
      targetingMode: TargetingMode.CHAIN,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 25,
      cooldown: 1.3,
      chainCount: 2,
      chainRange: 120,
      chainDamageDecay: 0.75,
      range: 380,

      color: '#FFD700',
      size: 8,
      icon: 'spark_bolt',

      upgrades: {
        2: { damage: 32, chainCount: 3 },
        3: { damage: 42, chainRange: 150, chainDamageDecay: 0.8 },
        4: { damage: 54, chainCount: 4, cooldown: 1.1 },
        5: { damage: 72, chainCount: 5, chainRange: 180 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 4. SHADOW CORE - Shadow Knife
    // ========================================
    shadow_knife: {
      id: 'shadow_knife',
      name: 'Shadow Knife',
      coreId: 'shadow_core',
      attackType: AttackType.MELEE_SWING,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 30,
      cooldown: 0.7,
      range: 55,
      arcAngle: 80,
      swingDuration: 0.12,
      hitsPerSwing: 1,

      // Shadow-specific
      critBonus: 0.1,

      color: '#4B0082',
      icon: 'shadow_knife',

      upgrades: {
        2: { damage: 40, hitsPerSwing: 2 },
        3: { damage: 52, range: 70, critBonus: 0.15 },
        4: { damage: 68, hitsPerSwing: 3, cooldown: 0.6 },
        5: { damage: 90, arcAngle: 100, critBonus: 0.2 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 5. BLOOD CORE - Blood Lance
    // ========================================
    blood_lance: {
      id: 'blood_lance',
      name: 'Blood Lance',
      coreId: 'blood_core',
      attackType: AttackType.PROJECTILE,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 28,
      cooldown: 1.0,
      projectileCount: 1,
      projectileSpeed: 420,
      range: 450,
      pierce: 1,
      spread: 0,

      // Blood-specific
      lifesteal: 0.05,

      color: '#8B0000',
      size: 12,
      shape: 'arrow',
      lifetime: 3.0,
      icon: 'blood_lance',

      upgrades: {
        2: { damage: 36, lifesteal: 0.07 },
        3: { damage: 46, pierce: 2, range: 500 },
        4: { damage: 60, projectileCount: 2, lifesteal: 0.1 },
        5: { damage: 80, pierce: 3, lifesteal: 0.12 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 6. ARCANE CORE - Arcane Bolt
    // ========================================
    arcane_bolt: {
      id: 'arcane_bolt',
      name: 'Arcane Bolt',
      coreId: 'arcane_core',
      attackType: AttackType.PROJECTILE,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 20,
      cooldown: 0.85,
      projectileCount: 1,
      projectileSpeed: 400,
      range: 420,
      pierce: 0,
      spread: 0,

      color: '#9932CC',
      size: 9,
      shape: 'circle',
      lifetime: 3.0,
      icon: 'arcane_bolt',

      upgrades: {
        2: { damage: 26, cooldown: 0.75 },
        3: { damage: 34, projectileCount: 2, pierce: 1 },
        4: { damage: 44, cooldown: 0.65, range: 480 },
        5: { damage: 58, projectileCount: 3, pierce: 2 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 7. NATURE CORE - Thorn Shot
    // ========================================
    thorn_shot: {
      id: 'thorn_shot',
      name: 'Thorn Shot',
      coreId: 'nature_core',
      attackType: AttackType.PROJECTILE,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 16,
      cooldown: 0.8,
      projectileCount: 2,
      projectileSpeed: 360,
      range: 380,
      pierce: 0,
      spread: 15,

      color: '#228B22',
      size: 7,
      shape: 'circle',
      lifetime: 2.5,
      icon: 'thorn_shot',

      upgrades: {
        2: { damage: 20, projectileCount: 3 },
        3: { damage: 26, spread: 20, pierce: 1 },
        4: { damage: 34, projectileCount: 4, cooldown: 0.7 },
        5: { damage: 45, projectileCount: 5, pierce: 2 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 8. STEEL CORE - Steel Blade
    // ========================================
    steel_blade: {
      id: 'steel_blade',
      name: 'Steel Blade',
      coreId: 'steel_core',
      attackType: AttackType.MELEE_SWING,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 38,
      cooldown: 1.1,
      range: 65,
      arcAngle: 100,
      swingDuration: 0.2,
      hitsPerSwing: 1,

      color: '#708090',
      icon: 'steel_blade',

      upgrades: {
        2: { damage: 50, hitsPerSwing: 2 },
        3: { damage: 64, range: 80, arcAngle: 120 },
        4: { damage: 82, hitsPerSwing: 3, cooldown: 0.95 },
        5: { damage: 108, range: 95, arcAngle: 140 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 9. WIND CORE - Wind Slash
    // ========================================
    wind_slash: {
      id: 'wind_slash',
      name: 'Wind Slash',
      coreId: 'wind_core',
      attackType: AttackType.MELEE_SWING,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 22,
      cooldown: 0.5,
      range: 50,
      arcAngle: 90,
      swingDuration: 0.1,
      hitsPerSwing: 1,

      color: '#87CEEB',
      icon: 'wind_slash',

      upgrades: {
        2: { damage: 28, cooldown: 0.45 },
        3: { damage: 36, hitsPerSwing: 2, range: 60 },
        4: { damage: 46, cooldown: 0.4, arcAngle: 110 },
        5: { damage: 60, hitsPerSwing: 3, cooldown: 0.35 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 10. EARTH CORE - Rock Throw
    // ========================================
    rock_throw: {
      id: 'rock_throw',
      name: 'Rock Throw',
      coreId: 'earth_core',
      attackType: AttackType.AREA_DAMAGE,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 35,
      cooldown: 1.8,
      radius: 50,
      duration: 0.5,
      tickRate: 1,
      cloudCount: 1,
      spawnRange: 200,

      color: '#8B4513',
      icon: 'rock_throw',

      upgrades: {
        2: { damage: 46, radius: 60 },
        3: { damage: 60, cloudCount: 2, spawnRange: 250 },
        4: { damage: 78, radius: 75, cooldown: 1.5 },
        5: { damage: 105, cloudCount: 3, radius: 90 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 11. VOID CORE - Void Bolt
    // ========================================
    void_bolt: {
      id: 'void_bolt',
      name: 'Void Bolt',
      coreId: 'void_core',
      attackType: AttackType.PROJECTILE,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 24,
      cooldown: 1.0,
      projectileCount: 1,
      projectileSpeed: 340,
      range: 400,
      pierce: 2,
      spread: 0,

      // Void-specific
      weaknessApply: 0.05,

      color: '#2F0032',
      size: 11,
      shape: 'circle',
      lifetime: 3.5,
      icon: 'void_bolt',

      upgrades: {
        2: { damage: 32, weaknessApply: 0.07 },
        3: { damage: 42, pierce: 3, range: 450 },
        4: { damage: 55, projectileCount: 2, weaknessApply: 0.1 },
        5: { damage: 75, pierce: 4, weaknessApply: 0.12 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 12. HOLY CORE - Holy Beam
    // ========================================
    holy_beam: {
      id: 'holy_beam',
      name: 'Holy Beam',
      coreId: 'holy_core',
      attackType: AttackType.LASER,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 40,
      cooldown: 2.2,
      duration: 0.4,
      width: 6,
      range: 600,
      pierce: 999,
      tickRate: 8,

      color: '#FFD700',
      icon: 'holy_beam',

      upgrades: {
        2: { damage: 52, width: 8 },
        3: { damage: 68, duration: 0.5, range: 700 },
        4: { damage: 88, width: 12, cooldown: 1.9 },
        5: { damage: 120, duration: 0.7, width: 15 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 13. TECH CORE - Auto Turret
    // ========================================
    auto_turret: {
      id: 'auto_turret',
      name: 'Auto Turret',
      coreId: 'tech_core',
      attackType: AttackType.PARTICLE,
      targetingMode: TargetingMode.ROTATING,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 12,
      cooldown: 0,
      bladeCount: 2,
      orbitRadius: 70,
      rotationSpeed: 4,
      hitCooldown: 0.3,

      color: '#00CED1',
      size: 10,
      icon: 'auto_turret',

      upgrades: {
        2: { damage: 16, bladeCount: 3 },
        3: { damage: 22, orbitRadius: 85, rotationSpeed: 5 },
        4: { damage: 30, bladeCount: 4, hitCooldown: 0.25 },
        5: { damage: 42, bladeCount: 5, orbitRadius: 100 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 14. BEAST CORE - Claw Swipe
    // ========================================
    claw_swipe: {
      id: 'claw_swipe',
      name: 'Claw Swipe',
      coreId: 'beast_core',
      attackType: AttackType.MELEE_SWING,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 18,
      cooldown: 0.4,
      range: 45,
      arcAngle: 70,
      swingDuration: 0.08,
      hitsPerSwing: 1,

      color: '#FF6347',
      icon: 'claw_swipe',

      upgrades: {
        2: { damage: 24, cooldown: 0.35 },
        3: { damage: 32, hitsPerSwing: 2, arcAngle: 85 },
        4: { damage: 42, cooldown: 0.3, range: 55 },
        5: { damage: 56, hitsPerSwing: 3, cooldown: 0.25 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 15. TIME CORE - Chrono Bolt
    // ========================================
    chrono_bolt: {
      id: 'chrono_bolt',
      name: 'Chrono Bolt',
      coreId: 'time_core',
      attackType: AttackType.PROJECTILE,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 20,
      cooldown: 1.2,
      projectileCount: 1,
      projectileSpeed: 300,
      range: 400,
      pierce: 0,
      spread: 0,

      // Time-specific
      slowAmount: 0.15,
      slowDuration: 2.0,

      color: '#DDA0DD',
      size: 10,
      shape: 'circle',
      lifetime: 4.0,
      icon: 'chrono_bolt',

      upgrades: {
        2: { damage: 26, slowAmount: 0.2 },
        3: { damage: 34, pierce: 1, slowDuration: 2.5 },
        4: { damage: 44, projectileCount: 2, cooldown: 1.0 },
        5: { damage: 58, slowAmount: 0.3, pierce: 2 },
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
    return CoreWeaponData[weaponId] || null;
  }

  /**
   * Get weapon data by core ID
   * @param {string} coreId
   * @returns {Object|null}
   */
  function getWeaponByCoreId(coreId) {
    for (var id in CoreWeaponData) {
      if (CoreWeaponData.hasOwnProperty(id) && CoreWeaponData[id].coreId === coreId) {
        return CoreWeaponData[id];
      }
    }
    return null;
  }

  /**
   * Get all core weapon IDs
   * @returns {Array<string>}
   */
  function getAllWeaponIds() {
    return Object.keys(CoreWeaponData);
  }

  /**
   * Check if a weapon is a core weapon
   * @param {string} weaponId
   * @returns {boolean}
   */
  function isCoreWeapon(weaponId) {
    return CoreWeaponData.hasOwnProperty(weaponId);
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.CoreWeaponData = CoreWeaponData;
  Data.getCoreWeaponData = getWeaponData;
  Data.getWeaponByCoreId = getWeaponByCoreId;
  Data.getAllCoreWeaponIds = getAllWeaponIds;
  Data.isCoreWeapon = isCoreWeapon;
})(window.VampireSurvivors.Data = window.VampireSurvivors.Data || {});
