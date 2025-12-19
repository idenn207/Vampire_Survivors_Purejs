/**
 * @fileoverview God Light - Holy Core T5 Evolution (Legendary)
 * @module Data/Weapons/Evolved/Holy/GodLight
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.god_light = {
    id: 'god_light',
    name: 'God Light',

    // Evolution metadata
    coreId: 'holy_core',
    baseWeaponId: 'holy_lance',
    evolutionChain: 'holy',
    isEvolved: true,
    isCore: true,

    // Tier properties (Legendary)
    tier: 5,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (10.0x base multiplier)
    damage: 50,
    cooldown: 0.8,
    projectileCount: 4,
    projectileSpeed: 650,
    range: 600,
    pierce: 8,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.HOLY_MARK,
        chance: 0.7,
        duration: 7,
        bonusDamage: 0.45,
      },
    ],

    // T5 Special Ability: Holy Aura
    specialAbility: {
      name: 'Holy Aura',
      description: 'Permanent aura that heals and damages enemies',
      holyAura: {
        enabled: true,
        radius: 180,
        healPerSecond: 5,
        damagePerSecond: 18,
        holyMarkChance: 0.1,
      },
      // Enhanced divine judgment from T4
      divineJudgment: {
        enabled: true,
        interval: 8,
        pillarCount: 6,
        pillarRadius: 85,
        pillarDamage: 130,
        holyMarkChance: 0.75,
      },
      // Enhanced smite from T3
      smite: {
        enabled: true,
        smiteDamage: 90,
        smiteRadius: 130,
        healOnSmite: 12,
      },
      // Enhanced divine light from T2
      divineLight: {
        enabled: true,
        burstRadius: 100,
        burstDamage: 40,
        healPlayer: 6,
      },
    },

    // Visual properties
    color: '#FFFFFF',
    size: 20,
    shape: 'lance',
    lifetime: 3.0,
    icon: 'god_light',
    imageId: 'weapon_god_light',

    // Level upgrades
    upgrades: {
      2: { damage: 63, statusEffects: [{ type: StatusEffectType.HOLY_MARK, chance: 0.75, duration: 7.5, bonusDamage: 0.5 }] },
      3: { damage: 78, pierce: 9, specialAbility: { holyAura: { radius: 220, healPerSecond: 8, damagePerSecond: 28 } } },
      4: { damage: 98, cooldown: 0.7, projectileCount: 5 },
      5: { damage: 122, specialAbility: { holyAura: { radius: 280, healPerSecond: 12, damagePerSecond: 45, holyMarkChance: 0.2 }, divineJudgment: { interval: 6, pillarCount: 8, pillarDamage: 200 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
