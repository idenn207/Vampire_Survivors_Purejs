/**
 * @fileoverview Void Assassin - Shadow Core T4 Evolution (Epic)
 * @module Data/Weapons/Evolved/Shadow/VoidAssassin
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.void_assassin = {
    id: 'void_assassin',
    name: 'Void Assassin',

    // Evolution metadata
    coreId: 'shadow_core',
    baseWeaponId: 'shadow_blade',
    evolutionChain: 'shadow',
    isEvolved: true,
    isCore: true,

    // Tier properties (Epic)
    tier: 4,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (4.0x base multiplier)
    damage: 44,
    cooldown: 0.55,
    range: 160,
    arc: 200,
    pierce: 999,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.WEAKEN,
        chance: 0.5,
        duration: 4.5,
        damageReduction: 0.3,
      },
      {
        type: StatusEffectType.FEAR,
        chance: 0.25,
        duration: 2.5,
        fleeDuration: 2,
      },
    ],

    // T4 Special Ability: Death Mark
    specialAbility: {
      name: 'Death Mark',
      description: 'Marks enemies, executing them when below 20% HP',
      deathMark: {
        enabled: true,
        markChance: 0.3,
        executeThreshold: 0.2,
        markDuration: 5,
      },
      // Keeps shadow clone from T3
      shadowClone: {
        enabled: true,
        cloneCount: 2,
        cloneDamageMultiplier: 0.5,
        cloneLifetime: 3,
      },
      // Keeps shadow step from T2
      shadowStep: {
        enabled: true,
        critChance: 0.25,
        critMultiplier: 2.5,
        invincibilityDuration: 0.5,
      },
    },

    // Visual properties
    color: '#6B00D8',
    size: 55,
    shape: 'arc',
    lifetime: 0.25,
    icon: 'void_assassin',
    imageId: 'weapon_void_assassin',
    meleeImageId: 'void_assassin_melee',

    // Level upgrades
    upgrades: {
      2: { damage: 55, statusEffects: [{ type: StatusEffectType.WEAKEN, chance: 0.55, duration: 5, damageReduction: 0.35 }, { type: StatusEffectType.FEAR, chance: 0.3, duration: 2.5, fleeDuration: 2 }] },
      3: { damage: 69, arc: 220, specialAbility: { deathMark: { markChance: 0.4, executeThreshold: 0.25 } } },
      4: { damage: 86, cooldown: 0.45, range: 175 },
      5: { damage: 108, specialAbility: { deathMark: { markChance: 0.5, executeThreshold: 0.3 }, shadowClone: { cloneCount: 3, cloneDamageMultiplier: 0.7 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
