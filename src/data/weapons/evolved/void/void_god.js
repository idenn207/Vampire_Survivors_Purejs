/**
 * @fileoverview Void God - Void Core T5 Evolution (Legendary)
 * @module Data/Weapons/Evolved/Void/VoidGod
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.void_god = {
    id: 'void_god',
    name: 'Void God',

    // Evolution metadata
    coreId: 'void_core',
    baseWeaponId: 'void_rift',
    evolutionChain: 'void',
    isEvolved: true,
    isCore: true,

    // Tier properties (Legendary)
    tier: 5,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    // Stats (2.5x base multiplier)
    damage: 50,
    cooldown: 1.25,
    areaRadius: 120,
    range: 500,
    duration: 4,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.VOID_MARK,
        chance: 0.7,
        duration: 7,
        bonusDamage: 0.45,
      },
    ],

    // T5 Special Ability: Void Domain
    specialAbility: {
      name: 'Void Domain',
      description: 'Permanent void aura that damages and weakens enemies',
      voidDomain: {
        enabled: true,
        radius: 200,
        damagePerSecond: 20,
        voidMarkChance: 0.1,
        damageAmplification: 0.15,
      },
      // Enhanced reality implosion from T4
      realityImplosion: {
        enabled: true,
        explosionRadius: 200,
        explosionDamage: 180,
        voidMarkChance: 0.75,
      },
      // Enhanced dimensional instability from T3
      dimensionalInstability: {
        enabled: true,
        damageIncreasePerSecond: 0.25,
        maxDamageIncrease: 1.2,
      },
      // Enhanced gravity pull from T2
      gravityPull: {
        enabled: true,
        pullStrength: 130,
        pullRadius: 180,
      },
    },

    // Visual properties
    color: '#7B68EE',
    size: 120,
    shape: 'circle',
    lifetime: 4.0,
    icon: 'void_god',
    imageId: 'weapon_void_god',

    // Level upgrades
    upgrades: {
      2: { damage: 63, statusEffects: [{ type: StatusEffectType.VOID_MARK, chance: 0.75, duration: 7.5, bonusDamage: 0.5 }] },
      3: { damage: 78, areaRadius: 140, specialAbility: { voidDomain: { radius: 250, damagePerSecond: 30, damageAmplification: 0.2 } } },
      4: { damage: 98, cooldown: 1.1, duration: 5 },
      5: { damage: 122, specialAbility: { voidDomain: { radius: 320, damagePerSecond: 45, voidMarkChance: 0.2, damageAmplification: 0.3 }, realityImplosion: { explosionRadius: 280, explosionDamage: 280 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
