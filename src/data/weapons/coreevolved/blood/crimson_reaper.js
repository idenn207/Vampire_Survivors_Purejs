/**
 * @fileoverview Crimson Reaper - Blood Core T2 Evolution (Uncommon)
 * @module Data/Weapons/CoreEvolved/Blood/CrimsonReaper
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreEvolvedRegistry = Data.CoreEvolvedRegistry || {};

  Data.CoreEvolvedRegistry.crimson_reaper = {
    id: 'crimson_reaper',
    name: 'Crimson Reaper',

    // Evolution metadata
    coreId: 'blood_core',
    baseWeaponId: 'blood_scythe',
    evolutionChain: 'blood',
    isEvolved: true,
    isCore: true,

    // Tier properties (Uncommon)
    tier: 2,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (1.3x base multiplier)
    damage: 32,
    cooldown: 0.85,
    range: 135,
    arc: 160,
    pierce: 999,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.BLEED,
        chance: 0.4,
        duration: 4,
        tickRate: 2,
        damagePerTick: 6,
      },
    ],

    // T2 Special Ability: Blood Drain
    specialAbility: {
      name: 'Blood Drain',
      description: 'Heals for a portion of damage dealt',
      bloodDrain: {
        enabled: true,
        healPercent: 0.05,
        maxHealPerHit: 5,
      },
    },

    // Visual properties
    color: '#8B0000',
    size: 50,
    shape: 'arc',
    lifetime: 0.25,
    icon: 'crimson_reaper',
    imageId: 'weapon_crimson_reaper',

    // Level upgrades
    upgrades: {
      2: { damage: 40, statusEffects: [{ type: StatusEffectType.BLEED, chance: 0.45, duration: 4.5, tickRate: 2, damagePerTick: 8 }] },
      3: { damage: 50, arc: 180, specialAbility: { bloodDrain: { healPercent: 0.07, maxHealPerHit: 7 } } },
      4: { damage: 63, cooldown: 0.75, range: 150 },
      5: { damage: 78, statusEffects: [{ type: StatusEffectType.BLEED, chance: 0.55, duration: 5, tickRate: 2, damagePerTick: 10 }], specialAbility: { bloodDrain: { healPercent: 0.1, maxHealPerHit: 10 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
