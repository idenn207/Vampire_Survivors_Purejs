/**
 * @fileoverview World Tree - Nature Core T5 Evolution (Legendary)
 * @module Data/Weapons/Evolved/Nature/WorldTree
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.world_tree = {
    id: 'world_tree',
    name: 'World Tree',

    // Evolution metadata
    coreId: 'nature_core',
    baseWeaponId: 'venom_spore',
    evolutionChain: 'nature',
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

    // Stats (10.0x base multiplier)
    damage: 25,
    cooldown: 0.8,
    areaRadius: 120,
    range: 460,
    duration: 7,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.POISON,
        chance: 1.0,
        duration: 8,
        tickRate: 2,
        damagePerTick: 14,
      },
      {
        type: StatusEffectType.SLOW,
        chance: 0.6,
        duration: 5,
        slowAmount: 0.4,
      },
    ],

    // T5 Special Ability: Nature Aura
    specialAbility: {
      name: 'Nature Aura',
      description: 'Permanent aura that poisons enemies and heals player',
      natureAura: {
        enabled: true,
        radius: 160,
        poisonChance: 0.1,
        poisonDamage: 8,
        healPerSecond: 3,
      },
      // Enhanced entangling roots from T4
      entanglingRoots: {
        enabled: true,
        interval: 8,
        rootCount: 5,
        rootRadius: 60,
        rootDuration: 4,
        rootDamage: 25,
      },
      // Enhanced toxic explosion from T3
      toxicExplosion: {
        enabled: true,
        explosionRadius: 110,
        explosionDamage: 55,
        applyPoison: true,
        poisonChance: 0.85,
      },
      // Enhanced spreading spores from T2
      spreadingSpores: {
        enabled: true,
        spreadRadius: 100,
        spreadChance: 0.6,
        spreadDamageMultiplier: 0.9,
      },
    },

    // Visual properties
    color: '#00FF00',
    visualScale: 1.2,
    size: 120,
    shape: 'circle',
    lifetime: 7.0,
    icon: 'world_tree',
    imageId: 'weapon_world_tree',
    areaImageId: 'world_tree_area',

    // Level upgrades
    upgrades: {
      2: { damage: 31, statusEffects: [{ type: StatusEffectType.POISON, chance: 1.0, duration: 9, tickRate: 2, damagePerTick: 18 }, { type: StatusEffectType.SLOW, chance: 0.65, duration: 5.5, slowAmount: 0.45 }] },
      3: { damage: 39, areaRadius: 140, specialAbility: { natureAura: { radius: 200, healPerSecond: 5 } } },
      4: { damage: 49, cooldown: 0.7, duration: 8 },
      5: { damage: 61, specialAbility: { natureAura: { radius: 250, poisonChance: 0.2, poisonDamage: 15, healPerSecond: 8 }, entanglingRoots: { interval: 6, rootCount: 7, rootDamage: 40 }, toxicExplosion: { explosionRadius: 140, explosionDamage: 80 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
