/**
 * @fileoverview Toxic Bloom - Nature Core T2 Evolution (Uncommon)
 * @module Data/Weapons/Evolved/Nature/ToxicBloom
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.toxic_bloom = {
    id: 'toxic_bloom',
    name: 'Toxic Bloom',

    // Evolution metadata
    coreId: 'nature_core',
    baseWeaponId: 'venom_spore',
    evolutionChain: 'nature',
    isEvolved: true,
    isCore: true,

    // Tier properties (Uncommon)
    tier: 2,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    // Stats (1.6x base multiplier)
    damage: 13,
    cooldown: 1.15,
    areaRadius: 70,
    range: 350,
    duration: 4,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.POISON,
        chance: 1.0,
        duration: 5,
        tickRate: 2,
        damagePerTick: 5,
      },
    ],

    // T2 Special Ability: Spreading Spores
    specialAbility: {
      name: 'Spreading Spores',
      description: 'Poison spreads to nearby enemies',
      spreadingSpores: {
        enabled: true,
        spreadRadius: 60,
        spreadChance: 0.3,
        spreadDamageMultiplier: 0.7,
      },
    },

    // Visual properties
    color: '#32CD32',
    size: 70,
    shape: 'circle',
    lifetime: 4.0,
    icon: 'toxic_bloom',
    imageId: 'weapon_toxic_bloom',

    // Level upgrades
    upgrades: {
      2: { damage: 16, statusEffects: [{ type: StatusEffectType.POISON, chance: 1.0, duration: 5.5, tickRate: 2, damagePerTick: 6 }] },
      3: { damage: 20, areaRadius: 80, specialAbility: { spreadingSpores: { spreadChance: 0.4, spreadRadius: 70 } } },
      4: { damage: 25, cooldown: 1.0, duration: 5 },
      5: { damage: 31, statusEffects: [{ type: StatusEffectType.POISON, chance: 1.0, duration: 6, tickRate: 2, damagePerTick: 8 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
