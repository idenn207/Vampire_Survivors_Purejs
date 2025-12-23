/**
 * @fileoverview Feral Strike - Beast Core T2 Evolution (Uncommon)
 * @module Data/Weapons/Evolved/Beast/FeralStrike
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.feral_strike = {
    id: 'feral_strike',
    name: 'Feral Strike',

    // Evolution metadata
    coreId: 'beast_core',
    baseWeaponId: 'beast_claw',
    evolutionChain: 'beast',
    isEvolved: true,
    isCore: true,

    // Tier properties (Uncommon)
    tier: 2,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.MELEE_THRUST,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (1.6x base multiplier)
    damage: 21,
    cooldown: 0.39,
    range: 60,
    pierce: 999,

    // Thrust parameters (punch/claw style)
    thrustStyle: 'punch',
    thrustDuration: 0.1,
    extendTime: 0.35,
    holdTime: 0,
    retractTime: 0.65,
    thrustWidth: 38,
    coneExpansion: 1.2,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.BLEED,
        chance: 0.35,
        duration: 3,
        tickRate: 3,
        damagePerTick: 4,
      },
    ],

    // T2 Special Ability: Frenzy
    specialAbility: {
      name: 'Frenzy',
      description: 'Killing enemies increases attack speed temporarily',
      frenzy: {
        enabled: true,
        attackSpeedBonus: 0.1,
        duration: 3,
        maxStacks: 5,
      },
    },

    // Visual properties
    color: '#8B4513',
    size: 40,
    shape: 'claw',
    lifetime: 0.15,
    icon: 'feral_strike',
    imageId: 'weapon_feral_strike',
    meleeImageId: 'feral_strike_melee',

    // Level upgrades
    upgrades: {
      2: { damage: 26, statusEffects: [{ type: StatusEffectType.BLEED, chance: 0.4, duration: 3.5, tickRate: 3, damagePerTick: 5 }] },
      3: { damage: 33, thrustWidth: 42, specialAbility: { frenzy: { attackSpeedBonus: 0.12, maxStacks: 6 } } },
      4: { damage: 41, cooldown: 0.33, range: 65 },
      5: { damage: 51, statusEffects: [{ type: StatusEffectType.BLEED, chance: 0.5, duration: 4, tickRate: 3, damagePerTick: 7 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
