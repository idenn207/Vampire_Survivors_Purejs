/**
 * @fileoverview Phantom Edge - Shadow Core T2 Evolution (Uncommon)
 * @module Data/Weapons/Evolved/Shadow/PhantomEdge
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.phantom_edge = {
    id: 'phantom_edge',
    name: 'Phantom Edge',

    // Evolution metadata
    coreId: 'shadow_core',
    baseWeaponId: 'shadow_blade',
    evolutionChain: 'shadow',
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
    damage: 29,
    cooldown: 0.65,
    range: 130,
    arc: 150,
    pierce: 999,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.WEAKEN,
        chance: 0.3,
        duration: 3,
        damageReduction: 0.2,
      },
    ],

    // T2 Special Ability: Shadow Step
    specialAbility: {
      name: 'Shadow Step',
      description: 'Critical hits cause brief invincibility',
      shadowStep: {
        enabled: true,
        critChance: 0.15,
        critMultiplier: 2.0,
        invincibilityDuration: 0.3,
      },
    },

    // Visual properties
    color: '#4B0082',
    size: 45,
    shape: 'arc',
    lifetime: 0.2,
    icon: 'phantom_edge',
    imageId: 'weapon_phantom_edge',

    // Level upgrades
    upgrades: {
      2: { damage: 36, statusEffects: [{ type: StatusEffectType.WEAKEN, chance: 0.35, duration: 3.5, damageReduction: 0.25 }] },
      3: { damage: 45, arc: 180, specialAbility: { shadowStep: { critChance: 0.2, invincibilityDuration: 0.4 } } },
      4: { damage: 56, cooldown: 0.55, range: 150 },
      5: { damage: 70, statusEffects: [{ type: StatusEffectType.WEAKEN, chance: 0.45, duration: 4, damageReduction: 0.3 }], specialAbility: { shadowStep: { critChance: 0.25, critMultiplier: 2.5 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
