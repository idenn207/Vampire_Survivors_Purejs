/**
 * @fileoverview Nature Wrath - Nature Core T4 Evolution (Epic)
 * @module Data/Weapons/Evolved/Nature/NatureWrath
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.nature_wrath = {
    id: 'nature_wrath',
    name: 'Nature Wrath',

    // Evolution metadata
    coreId: 'nature_core',
    baseWeaponId: 'venom_spore',
    evolutionChain: 'nature',
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
    damage: 20,
    cooldown: 0.9,
    areaRadius: 100,
    range: 420,
    duration: 6,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.POISON,
        chance: 1.0,
        duration: 7,
        tickRate: 2,
        damagePerTick: 10,
      },
      {
        type: StatusEffectType.SLOW,
        chance: 0.5,
        duration: 4,
        slowAmount: 0.3,
      },
    ],

    // T4 Special Ability: Entangling Roots
    specialAbility: {
      name: 'Entangling Roots',
      description: 'Spawns roots that immobilize enemies',
      entanglingRoots: {
        enabled: true,
        interval: 10,
        rootCount: 3,
        rootRadius: 50,
        rootDuration: 3,
        rootDamage: 15,
      },
      // Keeps toxic explosion from T3
      toxicExplosion: {
        enabled: true,
        explosionRadius: 90,
        explosionDamage: 40,
        applyPoison: true,
        poisonChance: 0.7,
      },
      // Keeps spreading spores from T2
      spreadingSpores: {
        enabled: true,
        spreadRadius: 80,
        spreadChance: 0.5,
        spreadDamageMultiplier: 0.8,
      },
    },

    // Visual properties
    color: '#006400',
    size: 100,
    shape: 'circle',
    lifetime: 6.0,
    icon: 'nature_wrath',
    imageId: 'weapon_nature_wrath',
    areaImageId: 'nature_wrath_area',

    // Level upgrades
    upgrades: {
      2: { damage: 25, statusEffects: [{ type: StatusEffectType.POISON, chance: 1.0, duration: 7.5, tickRate: 2, damagePerTick: 13 }, { type: StatusEffectType.SLOW, chance: 0.55, duration: 4.5, slowAmount: 0.35 }] },
      3: { damage: 31, areaRadius: 115, specialAbility: { entanglingRoots: { rootCount: 4, rootDamage: 22 } } },
      4: { damage: 39, cooldown: 0.8, duration: 7 },
      5: { damage: 49, specialAbility: { entanglingRoots: { interval: 8, rootCount: 5, rootRadius: 65, rootDuration: 4 }, toxicExplosion: { explosionRadius: 110, explosionDamage: 60 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
