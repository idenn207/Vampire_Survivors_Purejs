/**
 * @fileoverview Reality Collapse - Void Core T4 Evolution (Epic)
 * @module Data/Weapons/Evolved/Void/RealityCollapse
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.reality_collapse = {
    id: 'reality_collapse',
    name: 'Reality Collapse',

    // Evolution metadata
    coreId: 'void_core',
    baseWeaponId: 'void_rift',
    evolutionChain: 'void',
    isEvolved: true,
    isCore: true,

    // Tier properties (Epic)
    tier: 4,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    // Stats (4.0x base multiplier)
    damage: 40,
    cooldown: 1.35,
    areaRadius: 100,
    range: 440,
    duration: 3.5,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.VOID_MARK,
        chance: 0.55,
        duration: 6,
        bonusDamage: 0.35,
      },
    ],

    // T4 Special Ability: Reality Implosion
    specialAbility: {
      name: 'Reality Implosion',
      description: 'Rifts explode on expiry, dealing massive damage',
      realityImplosion: {
        enabled: true,
        explosionRadius: 150,
        explosionDamage: 100,
        voidMarkChance: 0.6,
      },
      // Keeps dimensional instability from T3
      dimensionalInstability: {
        enabled: true,
        damageIncreasePerSecond: 0.2,
        maxDamageIncrease: 0.9,
      },
      // Keeps gravity pull from T2
      gravityPull: {
        enabled: true,
        pullStrength: 100,
        pullRadius: 140,
      },
    },

    // Visual properties
    color: '#5D3FD3',
    size: 100,
    shape: 'circle',
    lifetime: 3.5,
    icon: 'reality_collapse',
    imageId: 'weapon_reality_collapse',
    areaImageId: 'reality_collapse_area',

    // Level upgrades
    upgrades: {
      2: { damage: 50, statusEffects: [{ type: StatusEffectType.VOID_MARK, chance: 0.6, duration: 6.5, bonusDamage: 0.4 }] },
      3: { damage: 63, areaRadius: 115, specialAbility: { realityImplosion: { explosionRadius: 180, explosionDamage: 140 } } },
      4: { damage: 78, cooldown: 1.2, duration: 4 },
      5: { damage: 98, specialAbility: { realityImplosion: { explosionRadius: 220, explosionDamage: 200, voidMarkChance: 0.8 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
