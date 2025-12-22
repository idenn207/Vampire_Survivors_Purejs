/**
 * @fileoverview Plague Forest - Nature Core T3 Evolution (Rare)
 * @module Data/Weapons/Evolved/Nature/PlagueForest
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.plague_forest = {
    id: 'plague_forest',
    name: 'Plague Forest',

    // Evolution metadata
    coreId: 'nature_core',
    baseWeaponId: 'venom_spore',
    evolutionChain: 'nature',
    isEvolved: true,
    isCore: true,

    // Tier properties (Rare)
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    // Stats (2.5x base multiplier)
    damage: 16,
    cooldown: 1.0,
    areaRadius: 85,
    range: 380,
    duration: 5,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.POISON,
        chance: 1.0,
        duration: 6,
        tickRate: 2,
        damagePerTick: 7,
      },
      {
        type: StatusEffectType.SLOW,
        chance: 0.4,
        duration: 3,
        slowAmount: 0.25,
      },
    ],

    // T3 Special Ability: Toxic Explosion
    specialAbility: {
      name: 'Toxic Explosion',
      description: 'Poisoned enemies explode on death',
      toxicExplosion: {
        enabled: true,
        explosionRadius: 70,
        explosionDamage: 25,
        applyPoison: true,
        poisonChance: 0.6,
      },
      // Keeps spreading spores from T2
      spreadingSpores: {
        enabled: true,
        spreadRadius: 70,
        spreadChance: 0.4,
        spreadDamageMultiplier: 0.75,
      },
    },

    // Visual properties
    color: '#228B22',
    size: 85,
    shape: 'circle',
    lifetime: 5.0,
    icon: 'plague_forest',
    imageId: 'weapon_plague_forest',
    areaImageId: 'plague_forest_area',

    // Level upgrades
    upgrades: {
      2: { damage: 20, statusEffects: [{ type: StatusEffectType.POISON, chance: 1.0, duration: 6.5, tickRate: 2, damagePerTick: 9 }, { type: StatusEffectType.SLOW, chance: 0.45, duration: 3.5, slowAmount: 0.3 }] },
      3: { damage: 25, areaRadius: 95, specialAbility: { toxicExplosion: { explosionRadius: 85, explosionDamage: 35 } } },
      4: { damage: 31, cooldown: 0.9, duration: 6 },
      5: { damage: 39, specialAbility: { toxicExplosion: { explosionRadius: 100, explosionDamage: 50, poisonChance: 0.8 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
