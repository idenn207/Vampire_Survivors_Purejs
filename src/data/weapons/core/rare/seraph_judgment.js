/**
 * @fileoverview Seraph Judgment - Holy Core T3 Evolution (Rare)
 * @module Data/Weapons/Evolved/Holy/SeraphJudgment
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.seraph_judgment = {
    id: 'seraph_judgment',
    name: 'Seraph Judgment',

    // Evolution metadata
    coreId: 'holy_core',
    baseWeaponId: 'holy_lance',
    evolutionChain: 'holy',
    isEvolved: true,
    isCore: true,

    // Tier properties (Rare)
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (2.5x base multiplier)
    damage: 32,
    cooldown: 0.9,
    projectileCount: 2,
    projectileSpeed: 560,
    range: 520,
    pierce: 5,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.HOLY_MARK,
        chance: 0.45,
        duration: 5,
        bonusDamage: 0.25,
      },
    ],

    // T3 Special Ability: Smite
    specialAbility: {
      name: 'Smite',
      description: 'Marked enemies take bonus holy damage on kill',
      smite: {
        enabled: true,
        smiteDamage: 40,
        smiteRadius: 80,
        healOnSmite: 5,
      },
      // Keeps divine light from T2
      divineLight: {
        enabled: true,
        burstRadius: 65,
        burstDamage: 20,
        healPlayer: 3,
      },
    },

    // Visual properties
    color: '#FFA500',
    size: 16,
    shape: 'lance',
    lifetime: 2.5,
    icon: 'seraph_judgment',
    imageId: 'weapon_seraph_judgment',

    // Level upgrades
    upgrades: {
      2: { damage: 40, statusEffects: [{ type: StatusEffectType.HOLY_MARK, chance: 0.5, duration: 5.5, bonusDamage: 0.28 }] },
      3: { damage: 50, pierce: 6, specialAbility: { smite: { smiteDamage: 55, smiteRadius: 100, healOnSmite: 7 } } },
      4: { damage: 63, cooldown: 0.8, projectileCount: 3 },
      5: { damage: 78, specialAbility: { smite: { smiteDamage: 75, smiteRadius: 120, healOnSmite: 10 }, divineLight: { burstRadius: 85, burstDamage: 30 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
