/**
 * @fileoverview Oblivion Blade - Shadow Core T5 Evolution (Legendary)
 * @module Data/Weapons/Evolved/Shadow/OblivionBlade
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.oblivion_blade = {
    id: 'oblivion_blade',
    name: 'Oblivion Blade',

    // Evolution metadata
    coreId: 'shadow_core',
    baseWeaponId: 'shadow_blade',
    evolutionChain: 'shadow',
    isEvolved: true,
    isCore: true,

    // Tier properties (Legendary)
    tier: 5,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (2.5x base multiplier)
    damage: 55,
    cooldown: 0.5,
    range: 180,
    arc: 240,
    pierce: 999,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.WEAKEN,
        chance: 0.6,
        duration: 5,
        damageReduction: 0.4,
      },
      {
        type: StatusEffectType.FEAR,
        chance: 0.35,
        duration: 3,
        fleeDuration: 2.5,
      },
    ],

    // T5 Special Ability: Shadow Realm
    specialAbility: {
      name: 'Shadow Realm',
      description: 'Permanent shadow aura that damages and weakens enemies',
      shadowRealm: {
        enabled: true,
        radius: 160,
        damagePerSecond: 15,
        weakenAmount: 0.15,
        fearChance: 0.05,
      },
      // Enhanced death mark from T4
      deathMark: {
        enabled: true,
        markChance: 0.5,
        executeThreshold: 0.3,
        markDuration: 6,
      },
      // Enhanced shadow clone from T3
      shadowClone: {
        enabled: true,
        cloneCount: 3,
        cloneDamageMultiplier: 0.7,
        cloneLifetime: 4,
      },
      // Enhanced shadow step from T2
      shadowStep: {
        enabled: true,
        critChance: 0.35,
        critMultiplier: 3.0,
        invincibilityDuration: 0.6,
      },
    },

    // Visual properties
    color: '#8000FF',
    size: 60,
    shape: 'arc',
    lifetime: 0.25,
    icon: 'oblivion_blade',
    imageId: 'weapon_oblivion_blade',

    // Level upgrades
    upgrades: {
      2: { damage: 69, statusEffects: [{ type: StatusEffectType.WEAKEN, chance: 0.65, duration: 5.5, damageReduction: 0.45 }, { type: StatusEffectType.FEAR, chance: 0.4, duration: 3, fleeDuration: 2.5 }] },
      3: { damage: 86, arc: 270, specialAbility: { shadowRealm: { radius: 200, damagePerSecond: 22 } } },
      4: { damage: 108, cooldown: 0.4, range: 200 },
      5: { damage: 135, specialAbility: { shadowRealm: { radius: 250, damagePerSecond: 35, weakenAmount: 0.25, fearChance: 0.1 }, deathMark: { markChance: 0.65, executeThreshold: 0.35 }, shadowStep: { critChance: 0.45, critMultiplier: 3.5 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
