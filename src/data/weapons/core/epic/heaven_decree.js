/**
 * @fileoverview Heaven Decree - Holy Core T4 Evolution (Epic)
 * @module Data/Weapons/Evolved/Holy/HeavenDecree
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.heaven_decree = {
    id: 'heaven_decree',
    name: 'Heaven Decree',

    // Evolution metadata
    coreId: 'holy_core',
    baseWeaponId: 'holy_lance',
    evolutionChain: 'holy',
    isEvolved: true,
    isCore: true,

    // Tier properties (Epic)
    tier: 4,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (4.0x base multiplier)
    damage: 40,
    cooldown: 0.85,
    projectileCount: 3,
    projectileSpeed: 600,
    range: 560,
    pierce: 6,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.HOLY_MARK,
        chance: 0.55,
        duration: 6,
        bonusDamage: 0.35,
      },
    ],

    // T4 Special Ability: Divine Judgment
    specialAbility: {
      name: 'Divine Judgment',
      description: 'Periodically calls down holy pillars',
      divineJudgment: {
        enabled: true,
        interval: 10,
        pillarCount: 4,
        pillarRadius: 70,
        pillarDamage: 80,
        holyMarkChance: 0.6,
      },
      // Keeps smite from T3
      smite: {
        enabled: true,
        smiteDamage: 60,
        smiteRadius: 100,
        healOnSmite: 8,
      },
      // Keeps divine light from T2
      divineLight: {
        enabled: true,
        burstRadius: 80,
        burstDamage: 28,
        healPlayer: 4,
      },
    },

    // Visual properties
    color: '#FFFF00',
    size: 18,
    shape: 'lance',
    lifetime: 3.0,
    icon: 'heaven_decree',
    imageId: 'weapon_heaven_decree',

    // Level upgrades
    upgrades: {
      2: { damage: 50, statusEffects: [{ type: StatusEffectType.HOLY_MARK, chance: 0.6, duration: 6.5, bonusDamage: 0.4 }] },
      3: { damage: 63, pierce: 7, specialAbility: { divineJudgment: { pillarCount: 5, pillarDamage: 110 } } },
      4: { damage: 78, cooldown: 0.75, projectileCount: 4 },
      5: { damage: 98, specialAbility: { divineJudgment: { interval: 8, pillarCount: 6, pillarRadius: 90, pillarDamage: 150 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
