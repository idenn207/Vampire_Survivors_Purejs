/**
 * @fileoverview Arcane Tempest - Arcane Core T3 Evolution (Rare)
 * @module Data/Weapons/CoreEvolved/Arcane/ArcaneTempest
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreEvolvedRegistry = Data.CoreEvolvedRegistry || {};

  Data.CoreEvolvedRegistry.arcane_tempest = {
    id: 'arcane_tempest',
    name: 'Arcane Tempest',

    // Evolution metadata
    coreId: 'arcane_core',
    baseWeaponId: 'arcane_barrage',
    evolutionChain: 'arcane',
    isEvolved: true,
    isCore: true,

    // Tier properties (Rare)
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    // Stats (1.6x base multiplier)
    damage: 19,
    cooldown: 0.28,
    projectileCount: 5,
    projectileSpeed: 580,
    range: 450,
    pierce: 2,
    spread: 360,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.ARCANE_MARK,
        chance: 0.35,
        duration: 5,
        bonusDamage: 0.2,
      },
    ],

    // T3 Special Ability: Arcane Detonation
    specialAbility: {
      name: 'Arcane Detonation',
      description: 'Marked enemies explode when mark expires',
      arcaneDetonation: {
        enabled: true,
        explosionRadius: 60,
        explosionDamage: 25,
        spreadMarkChance: 0.3,
      },
      // Keeps magic missile from T2
      magicMissile: {
        enabled: true,
        homingStrength: 0.4,
        homingRange: 130,
      },
    },

    // Visual properties
    color: '#A855F7',
    size: 9,
    shape: 'diamond',
    lifetime: 2.5,
    icon: 'arcane_tempest',
    imageId: 'weapon_arcane_tempest',

    // Level upgrades
    upgrades: {
      2: { damage: 24, projectileCount: 6, statusEffects: [{ type: StatusEffectType.ARCANE_MARK, chance: 0.4, duration: 5.5, bonusDamage: 0.23 }] },
      3: { damage: 30, pierce: 3, specialAbility: { arcaneDetonation: { explosionRadius: 75, explosionDamage: 35 } } },
      4: { damage: 38, projectileCount: 7, cooldown: 0.24 },
      5: { damage: 47, specialAbility: { arcaneDetonation: { explosionRadius: 90, explosionDamage: 50, spreadMarkChance: 0.5 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
