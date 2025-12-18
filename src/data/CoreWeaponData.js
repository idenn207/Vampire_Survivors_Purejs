/**
 * @fileoverview Core weapon data definitions - 15 unique starting weapons with status effects
 * @module Data/CoreWeaponData
 */
(function (Data) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  // ============================================
  // Core Weapon Definitions
  // ============================================
  var CoreWeaponData = {
    // ========================================
    // 1. INFERNO BOLT (Fire) - Burn DoT + Explosion on Kill
    // ========================================
    inferno_bolt: {
      id: 'inferno_bolt',
      name: 'Inferno Bolt',
      coreId: 'fire_core',
      attackType: AttackType.PROJECTILE,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

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

      // Status effects
      statusEffects: [
        {
          type: StatusEffectType.BURN,
          chance: 1.0,
          duration: 3,
          tickRate: 2,
          damagePerTick: 5,
        },
      ],

      // On-kill effect
      onKill: {
        chance: 0.5,
        explosion: { radius: 60, damage: 25 },
      },

      // Visual
      color: '#FF4500',
      size: 10,
      shape: 'circle',
      lifetime: 3.0,
      icon: 'inferno_bolt',

      // Upgrades
      upgrades: {
        2: { damage: 24, statusEffects: [{ type: StatusEffectType.BURN, chance: 1.0, duration: 3, tickRate: 2, damagePerTick: 7 }] },
        3: { damage: 32, pierce: 1, onKill: { chance: 0.7, explosion: { radius: 70, damage: 30 } } },
        4: { damage: 42, projectileCount: 2, cooldown: 0.75 },
        5: { damage: 55, statusEffects: [{ type: StatusEffectType.BURN, chance: 1.0, duration: 4, tickRate: 2, damagePerTick: 10 }], onKill: { chance: 1.0, explosion: { radius: 80, damage: 40 } } },
      },
      maxLevel: 5,
    },

    // ========================================
    // 2. FROST SHARD (Ice) - Slow + Freeze + Shatter
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

      damage: 15,
      cooldown: 1.0,
      projectileCount: 1,
      projectileSpeed: 350,
      range: 420,
      pierce: 0,
      spread: 0,

      // Status effects
      statusEffects: [
        {
          type: StatusEffectType.SLOW,
          chance: 1.0,
          duration: 2,
          speedModifier: 0.7, // 30% slower
        },
        {
          type: StatusEffectType.FREEZE,
          chance: 0.1, // 10% freeze chance
          duration: 1.5,
        },
      ],

      // On-kill: shatter AoE if frozen
      onKill: {
        chance: 1.0,
        shatter: { radius: 50, damage: 20 },
      },

      color: '#00BFFF',
      size: 9,
      shape: 'diamond',
      lifetime: 3.0,
      icon: 'frost_shard',

      upgrades: {
        2: { damage: 20, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 2, speedModifier: 0.65 }, { type: StatusEffectType.FREEZE, chance: 0.15, duration: 1.5 }] },
        3: { damage: 26, pierce: 1, onKill: { chance: 1.0, shatter: { radius: 60, damage: 25 } } },
        4: { damage: 34, projectileCount: 2, cooldown: 0.85 },
        5: { damage: 45, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 2.5, speedModifier: 0.6 }, { type: StatusEffectType.FREEZE, chance: 0.35, duration: 2 }], onKill: { chance: 1.0, shatter: { radius: 75, damage: 35 } } },
      },
      maxLevel: 5,
    },

    // ========================================
    // 3. THUNDER STRIKE (Lightning) - Chain + Stun
    // ========================================
    thunder_strike: {
      id: 'thunder_strike',
      name: 'Thunder Strike',
      coreId: 'lightning_core',
      attackType: AttackType.PARTICLE,
      targetingMode: TargetingMode.CHAIN,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 28,
      cooldown: 1.2,
      chainCount: 3,
      chainRange: 120,
      chainDamageDecay: 0.8,
      range: 400,

      // Status effects
      statusEffects: [
        {
          type: StatusEffectType.STUN,
          chance: 0.15,
          duration: 0.8,
        },
      ],

      color: '#FFD700',
      size: 8,
      icon: 'thunder_strike',

      upgrades: {
        2: { damage: 36, chainCount: 4, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.2, duration: 0.8 }] },
        3: { damage: 46, chainRange: 150, chainDamageDecay: 0.85 },
        4: { damage: 58, chainCount: 5, cooldown: 1.0, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.25, duration: 1.0 }] },
        5: { damage: 75, chainCount: 7, chainRange: 180, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.35, duration: 1.2 }] },
      },
      maxLevel: 5,
    },

    // ========================================
    // 4. SHADOW BLADE (Shadow) - 30% Crit + Execute
    // ========================================
    shadow_blade: {
      id: 'shadow_blade',
      name: 'Shadow Blade',
      coreId: 'shadow_core',
      attackType: AttackType.MELEE_SWING,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 40,
      cooldown: 0.7,
      range: 60,
      arcAngle: 90,
      swingDuration: 0.12,
      hitsPerSwing: 1,

      // Critical hit
      critChance: 0.3,
      critMultiplier: 2.5,

      // Execute: bonus damage to low HP enemies
      executeThreshold: 0.25, // Below 25% HP
      executeMultiplier: 2.0,

      color: '#4B0082',
      icon: 'shadow_blade',

      upgrades: {
        2: { damage: 52, critChance: 0.35 },
        3: { damage: 66, range: 70, executeThreshold: 0.28 },
        4: { damage: 82, hitsPerSwing: 2, cooldown: 0.6, critChance: 0.4 },
        5: { damage: 105, critChance: 0.5, critMultiplier: 2.5, executeThreshold: 0.3, executeMultiplier: 2.5 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 5. BLOOD SCYTHE (Blood) - Bleed + 15% Lifesteal
    // ========================================
    blood_scythe: {
      id: 'blood_scythe',
      name: 'Blood Scythe',
      coreId: 'blood_core',
      attackType: AttackType.MELEE_SWING,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 30,
      cooldown: 0.8,
      range: 70,
      arcAngle: 140,
      swingDuration: 0.15,
      hitsPerSwing: 1,

      // Lifesteal
      lifesteal: 0.15, // 15% of damage dealt

      // Status effects
      statusEffects: [
        {
          type: StatusEffectType.BLEED,
          chance: 1.0,
          duration: 4,
          tickRate: 2,
          damagePerTick: 3,
        },
      ],

      color: '#8B0000',
      icon: 'blood_scythe',

      upgrades: {
        2: { damage: 40, lifesteal: 0.18 },
        3: { damage: 52, statusEffects: [{ type: StatusEffectType.BLEED, chance: 1.0, duration: 4, tickRate: 2, damagePerTick: 5 }] },
        4: { damage: 66, hitsPerSwing: 2, lifesteal: 0.22 },
        5: { damage: 85, lifesteal: 0.28, statusEffects: [{ type: StatusEffectType.BLEED, chance: 1.0, duration: 5, tickRate: 2, damagePerTick: 7 }] },
      },
      maxLevel: 5,
    },

    // ========================================
    // 6. ARCANE BARRAGE (Arcane) - Triple Shot + CDR Aura
    // ========================================
    arcane_barrage: {
      id: 'arcane_barrage',
      name: 'Arcane Barrage',
      coreId: 'arcane_core',
      attackType: AttackType.PROJECTILE,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 12,
      cooldown: 0.6, // Very fast
      projectileCount: 3,
      projectileSpeed: 450,
      range: 400,
      pierce: 0,
      spread: 20,

      // Passive: CDR for ALL weapons
      passiveCDR: 0.1, // 10% cooldown reduction

      color: '#9932CC',
      size: 8,
      shape: 'circle',
      lifetime: 2.5,
      icon: 'arcane_barrage',

      upgrades: {
        2: { damage: 15, passiveCDR: 0.12 },
        3: { damage: 19, projectileCount: 4, pierce: 1 },
        4: { damage: 24, cooldown: 0.5, passiveCDR: 0.18 },
        5: { damage: 30, projectileCount: 6, passiveCDR: 0.25, pierce: 2 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 7. VENOM SPORE (Nature) - Poison Stacking + Player Regen
    // ========================================
    venom_spore: {
      id: 'venom_spore',
      name: 'Venom Spore',
      coreId: 'nature_core',
      attackType: AttackType.AREA_DAMAGE,
      targetingMode: TargetingMode.RANDOM,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 6,
      cooldown: 1.5,
      radius: 50,
      duration: 3.0,
      tickRate: 2,
      cloudCount: 1,
      spawnRange: 200,

      // Status effects
      statusEffects: [
        {
          type: StatusEffectType.POISON,
          chance: 1.0,
          duration: 5,
          tickRate: 1,
          damagePerTick: 2,
        },
      ],

      // Passive: Player heals while in cloud
      passivePlayerRegen: 2, // HP per second

      color: '#228B22',
      icon: 'venom_spore',

      upgrades: {
        2: { damage: 8, statusEffects: [{ type: StatusEffectType.POISON, chance: 1.0, duration: 5, tickRate: 1, damagePerTick: 3 }] },
        3: { damage: 10, cloudCount: 2, radius: 60 },
        4: { damage: 13, passivePlayerRegen: 3, duration: 4.0 },
        5: { damage: 18, cloudCount: 3, statusEffects: [{ type: StatusEffectType.POISON, chance: 1.0, duration: 6, tickRate: 1, damagePerTick: 5 }], passivePlayerRegen: 5 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 8. STEEL HAMMER (Steel) - High Knockback + Armor Pierce (MANUAL)
    // ========================================
    steel_hammer: {
      id: 'steel_hammer',
      name: 'Steel Hammer',
      coreId: 'steel_core',
      attackType: AttackType.MELEE_SWING,
      targetingMode: TargetingMode.MOUSE,
      isAuto: false, // MANUAL

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 55,
      cooldown: 1.1,
      range: 70,
      arcAngle: 100,
      swingDuration: 0.2,
      hitsPerSwing: 1,

      // High knockback
      knockback: 300,

      // Armor penetration (future implementation)
      armorPierce: 0.3, // 30% armor ignored

      color: '#708090',
      icon: 'steel_hammer',

      upgrades: {
        2: { damage: 72, knockback: 380 },
        3: { damage: 92, range: 85, armorPierce: 0.45 },
        4: { damage: 118, hitsPerSwing: 2, cooldown: 0.95, knockback: 480 },
        5: { damage: 155, knockback: 600, armorPierce: 0.8, arcAngle: 120 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 9. WIND CUTTER (Wind) - Knockback + Speed Boost (MANUAL)
    // ========================================
    wind_cutter: {
      id: 'wind_cutter',
      name: 'Wind Cutter',
      coreId: 'wind_core',
      attackType: AttackType.PROJECTILE,
      targetingMode: TargetingMode.MOUSE,
      isAuto: false, // MANUAL

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 22,
      cooldown: 0.7,
      projectileCount: 2,
      projectileSpeed: 500,
      range: 450,
      pierce: 2,
      spread: 15,

      // Knockback on hit
      knockback: 150,

      // Passive: Player movement speed boost
      passiveSpeedBoost: 0.15, // +15% move speed

      color: '#87CEEB',
      size: 8,
      shape: 'arc',
      lifetime: 2.0,
      icon: 'wind_cutter',

      upgrades: {
        2: { damage: 28, knockback: 180, passiveSpeedBoost: 0.18 },
        3: { damage: 36, projectileCount: 3, pierce: 3 },
        4: { damage: 46, cooldown: 0.6, passiveSpeedBoost: 0.22, knockback: 220 },
        5: { damage: 60, projectileCount: 4, passiveSpeedBoost: 0.3, knockback: 280 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 10. EARTH SPIKE (Earth) - Stun + Large AoE
    // ========================================
    earth_spike: {
      id: 'earth_spike',
      name: 'Earth Spike',
      coreId: 'earth_core',
      attackType: AttackType.AREA_DAMAGE,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 35,
      cooldown: 1.6,
      radius: 80, // Large AoE
      duration: 0.3,
      tickRate: 10, // Single hit
      cloudCount: 1,
      spawnRange: 200,

      // Status effects
      statusEffects: [
        {
          type: StatusEffectType.STUN,
          chance: 0.8,
          duration: 1.0,
        },
      ],

      color: '#8B4513',
      icon: 'earth_spike',

      upgrades: {
        2: { damage: 46, radius: 95 },
        3: { damage: 60, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.9, duration: 1.2 }], cloudCount: 2 },
        4: { damage: 78, radius: 110, cooldown: 1.4 },
        5: { damage: 105, radius: 120, statusEffects: [{ type: StatusEffectType.STUN, chance: 1.0, duration: 1.5 }] },
      },
      maxLevel: 5,
    },

    // ========================================
    // 11. VOID RIFT (Void) - Weakness + Pull
    // ========================================
    void_rift: {
      id: 'void_rift',
      name: 'Void Rift',
      coreId: 'void_core',
      attackType: AttackType.AREA_DAMAGE,
      targetingMode: TargetingMode.RANDOM,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 8,
      cooldown: 2.0,
      radius: 60,
      duration: 4.0, // Persistent zone
      tickRate: 2,
      cloudCount: 1,
      spawnRange: 250,

      // Status effects
      statusEffects: [
        {
          type: StatusEffectType.WEAKNESS,
          chance: 1.0,
          duration: 4,
          damageMultiplier: 1.25, // +25% damage taken
        },
        {
          type: StatusEffectType.PULL,
          chance: 1.0,
          duration: 4,
          pullForce: 50,
        },
      ],

      color: '#2F0032',
      icon: 'void_rift',

      upgrades: {
        2: { damage: 11, statusEffects: [{ type: StatusEffectType.WEAKNESS, chance: 1.0, duration: 4, damageMultiplier: 1.3 }, { type: StatusEffectType.PULL, chance: 1.0, duration: 4, pullForce: 60 }] },
        3: { damage: 14, radius: 75, duration: 5.0 },
        4: { damage: 18, cloudCount: 2, statusEffects: [{ type: StatusEffectType.WEAKNESS, chance: 1.0, duration: 5, damageMultiplier: 1.4 }, { type: StatusEffectType.PULL, chance: 1.0, duration: 5, pullForce: 75 }] },
        5: { damage: 24, radius: 90, statusEffects: [{ type: StatusEffectType.WEAKNESS, chance: 1.0, duration: 6, damageMultiplier: 1.5 }, { type: StatusEffectType.PULL, chance: 1.0, duration: 6, pullForce: 100 }] },
      },
      maxLevel: 5,
    },

    // ========================================
    // 12. HOLY LANCE (Holy) - Heal on Hit + Smite Proc
    // ========================================
    holy_lance: {
      id: 'holy_lance',
      name: 'Holy Lance',
      coreId: 'holy_core',
      attackType: AttackType.LASER,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 40,
      cooldown: 2.0,
      duration: 0.4,
      width: 8,
      range: 600,
      pierce: 999,
      tickRate: 8,

      // Heal on hit
      healOnHit: 2, // HP per enemy hit

      // Smite proc
      onHit: {
        chance: 0.2, // 20% chance
        smite: { radius: 40, damage: 50 },
      },

      color: '#FFD700',
      icon: 'holy_lance',

      upgrades: {
        2: { damage: 52, healOnHit: 3 },
        3: { damage: 68, width: 10, onHit: { chance: 0.28, smite: { radius: 50, damage: 60 } } },
        4: { damage: 88, cooldown: 1.7, healOnHit: 4 },
        5: { damage: 120, healOnHit: 5, onHit: { chance: 0.4, smite: { radius: 60, damage: 80 } }, width: 14 },
      },
      maxLevel: 5,
    },

    // ========================================
    // 13. TECH TURRET (Tech) - Ricochet + Rapid Fire
    // ========================================
    tech_turret: {
      id: 'tech_turret',
      name: 'Tech Turret',
      coreId: 'tech_core',
      attackType: AttackType.PROJECTILE,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 10,
      cooldown: 0.25, // Very fast
      projectileCount: 2,
      projectileSpeed: 600,
      range: 350,
      pierce: 0,
      spread: 8,

      // Ricochet
      ricochet: {
        bounces: 2,
        damageDecay: 0.7, // 70% damage per bounce
        bounceRange: 100,
      },

      color: '#00CED1',
      size: 6,
      shape: 'square',
      lifetime: 2.0,
      icon: 'tech_turret',

      upgrades: {
        2: { damage: 13, ricochet: { bounces: 2, damageDecay: 0.75, bounceRange: 110 } },
        3: { damage: 16, projectileCount: 3, ricochet: { bounces: 3, damageDecay: 0.75, bounceRange: 120 } },
        4: { damage: 20, cooldown: 0.2, ricochet: { bounces: 3, damageDecay: 0.8, bounceRange: 130 } },
        5: { damage: 26, projectileCount: 4, ricochet: { bounces: 4, damageDecay: 0.8, bounceRange: 150 } },
      },
      maxLevel: 5,
    },

    // ========================================
    // 14. BEAST CLAW (Beast) - Bleed + Frenzy Stacking
    // ========================================
    beast_claw: {
      id: 'beast_claw',
      name: 'Beast Claw',
      coreId: 'beast_core',
      attackType: AttackType.MELEE_SWING,
      targetingMode: TargetingMode.NEAREST,
      isAuto: true,

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 20,
      cooldown: 0.6,
      range: 50,
      arcAngle: 85,
      swingDuration: 0.1,
      hitsPerSwing: 2,

      // Status effects
      statusEffects: [
        {
          type: StatusEffectType.BLEED,
          chance: 0.7,
          duration: 3,
          tickRate: 2,
          damagePerTick: 4,
        },
      ],

      // Frenzy: attack speed bonus per kill
      frenzy: {
        attackSpeedPerKill: 0.05, // +5% per kill
        maxStacks: 10,
        decayTime: 5, // Seconds before stacks decay
      },

      color: '#FF6347',
      icon: 'beast_claw',

      upgrades: {
        2: { damage: 26, frenzy: { attackSpeedPerKill: 0.06, maxStacks: 10, decayTime: 5 } },
        3: { damage: 34, hitsPerSwing: 3, statusEffects: [{ type: StatusEffectType.BLEED, chance: 0.8, duration: 3, tickRate: 2, damagePerTick: 5 }] },
        4: { damage: 44, cooldown: 0.5, frenzy: { attackSpeedPerKill: 0.07, maxStacks: 12, decayTime: 6 } },
        5: { damage: 58, hitsPerSwing: 4, frenzy: { attackSpeedPerKill: 0.08, maxStacks: 15, decayTime: 7 }, statusEffects: [{ type: StatusEffectType.BLEED, chance: 1.0, duration: 4, tickRate: 2, damagePerTick: 7 }] },
      },
      maxLevel: 5,
    },

    // ========================================
    // 15. CHRONO BEAM (Time) - Slow + CDR Aura (MANUAL)
    // ========================================
    chrono_beam: {
      id: 'chrono_beam',
      name: 'Chrono Beam',
      coreId: 'time_core',
      attackType: AttackType.LASER,
      targetingMode: TargetingMode.MOUSE,
      isAuto: false, // MANUAL

      tier: 1,
      isExclusive: false,
      maxTier: 5,

      damage: 35,
      cooldown: 1.8,
      duration: 0.5,
      width: 10,
      range: 500,
      pierce: 999,
      tickRate: 6,

      // Status effects
      statusEffects: [
        {
          type: StatusEffectType.SLOW,
          chance: 1.0,
          duration: 2,
          speedModifier: 0.6, // 40% slower
        },
      ],

      // Passive: CDR for ALL weapons
      passiveCDR: 0.15, // 15% cooldown reduction

      // Slow aura around player
      passiveSlowAura: {
        radius: 150,
        slowPercent: 0.2, // 20% slow
      },

      color: '#DDA0DD',
      icon: 'chrono_beam',

      upgrades: {
        2: { damage: 46, passiveCDR: 0.18 },
        3: { damage: 58, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 2.5, speedModifier: 0.55 }], passiveSlowAura: { radius: 175, slowPercent: 0.25 } },
        4: { damage: 74, cooldown: 1.5, passiveCDR: 0.22 },
        5: { damage: 95, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 3, speedModifier: 0.5 }], passiveCDR: 0.25, passiveSlowAura: { radius: 200, slowPercent: 0.35 } },
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
