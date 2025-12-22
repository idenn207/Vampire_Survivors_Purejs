/**
 * @fileoverview Nightmare Slash - Shadow Core T3 Evolution (Rare)
 * @module Data/Weapons/Evolved/Shadow/NightmareSlash
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.nightmare_slash = {
    id: 'nightmare_slash',
    name: 'Nightmare Slash',

    // Evolution metadata
    coreId: 'shadow_core',
    baseWeaponId: 'shadow_blade',
    evolutionChain: 'shadow',
    isEvolved: true,
    isCore: true,

    // Tier properties (Rare)
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (2.5x base multiplier)
    damage: 35,
    cooldown: 0.6,
    range: 145,
    arc: 180,
    pierce: 999,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.WEAKEN,
        chance: 0.4,
        duration: 4,
        damageReduction: 0.25,
      },
      {
        type: StatusEffectType.FEAR,
        chance: 0.15,
        duration: 2,
        fleeDuration: 1.5,
      },
    ],

    // T3 Special Ability: Shadow Clone
    specialAbility: {
      name: 'Shadow Clone',
      description: 'Creates shadow afterimages that deal damage',
      shadowClone: {
        enabled: true,
        cloneCount: 1,
        cloneDamageMultiplier: 0.4,
        cloneLifetime: 2,
      },
      // Keeps shadow step from T2
      shadowStep: {
        enabled: true,
        critChance: 0.2,
        critMultiplier: 2.0,
        invincibilityDuration: 0.4,
      },
    },

    // Visual properties
    color: '#5B00B5',
    size: 50,
    shape: 'arc',
    lifetime: 0.2,
    icon: 'nightmare_slash',
    imageId: 'weapon_nightmare_slash',
    meleeImageId: 'nightmare_slash_melee',

    // Level upgrades
    upgrades: {
      2: { damage: 44, statusEffects: [{ type: StatusEffectType.WEAKEN, chance: 0.45, duration: 4, damageReduction: 0.3 }, { type: StatusEffectType.FEAR, chance: 0.2, duration: 2, fleeDuration: 1.5 }] },
      3: { damage: 55, arc: 200, specialAbility: { shadowClone: { cloneCount: 2, cloneDamageMultiplier: 0.5 } } },
      4: { damage: 69, cooldown: 0.5, range: 160 },
      5: { damage: 86, specialAbility: { shadowClone: { cloneCount: 3, cloneDamageMultiplier: 0.6 }, shadowStep: { critChance: 0.3, critMultiplier: 2.5 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
