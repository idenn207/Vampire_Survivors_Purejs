/**
 * @fileoverview Alpha Predator - Beast Core T3 Evolution (Rare)
 * @module Data/Weapons/Evolved/Beast/AlphaPredator
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.alpha_predator = {
    id: 'alpha_predator',
    name: 'Alpha Predator',

    // Evolution metadata
    coreId: 'beast_core',
    baseWeaponId: 'beast_claw',
    evolutionChain: 'beast',
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
    damage: 26,
    cooldown: 0.35,
    range: 95,
    arc: 120,
    pierce: 999,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.BLEED,
        chance: 0.45,
        duration: 4,
        tickRate: 3,
        damagePerTick: 6,
      },
    ],

    // T3 Special Ability: Pack Hunt
    specialAbility: {
      name: 'Pack Hunt',
      description: 'Summons spirit wolves to attack',
      packHunt: {
        enabled: true,
        wolfCount: 2,
        wolfDamage: 15,
        wolfDuration: 5,
        wolfSpeed: 250,
      },
      // Keeps frenzy from T2
      frenzy: {
        enabled: true,
        attackSpeedBonus: 0.12,
        duration: 4,
        maxStacks: 6,
      },
    },

    // Visual properties
    color: '#A0522D',
    size: 45,
    shape: 'claw',
    lifetime: 0.15,
    icon: 'alpha_predator',
    imageId: 'weapon_alpha_predator',

    // Level upgrades
    upgrades: {
      2: { damage: 33, statusEffects: [{ type: StatusEffectType.BLEED, chance: 0.5, duration: 4.5, tickRate: 3, damagePerTick: 8 }] },
      3: { damage: 41, arc: 140, specialAbility: { packHunt: { wolfCount: 3, wolfDamage: 22 } } },
      4: { damage: 51, cooldown: 0.3, range: 105 },
      5: { damage: 64, specialAbility: { packHunt: { wolfCount: 4, wolfDamage: 30, wolfDuration: 6 }, frenzy: { attackSpeedBonus: 0.15, maxStacks: 8 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
