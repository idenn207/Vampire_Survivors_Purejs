/**
 * @fileoverview Eternal Winter - Ice Core T5 Evolution (Legendary)
 * @module Data/Weapons/Evolved/Ice/EternalWinter
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.eternal_winter = {
    id: 'eternal_winter',
    name: 'Eternal Winter',

    // Evolution metadata
    coreId: 'ice_core',
    baseWeaponId: 'frost_shard',
    evolutionChain: 'ice',
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
    damage: 39,
    cooldown: 0.6,
    projectileCount: 6,
    projectileSpeed: 500,
    range: 500,
    pierce: 5,
    spread: 50,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SLOW,
        chance: 1.0,
        duration: 4,
        slowAmount: 0.6,
      },
      {
        type: StatusEffectType.FREEZE,
        chance: 0.5,
        duration: 3,
      },
    ],

    // T5 Special Ability: Frost Aura
    specialAbility: {
      name: 'Frost Aura',
      description: 'Enemies near player are slowed and take frost damage',
      frostAura: {
        enabled: true,
        radius: 150,
        slowAmount: 0.3,
        damagePerSecond: 10,
        freezeChance: 0.1,
      },
      // Keeps blizzard from T4
      blizzard: {
        enabled: true,
        interval: 15,
        radius: 320,
        damage: 100,
        duration: 5,
        slowAmount: 0.7,
        freezeChance: 0.4,
      },
      // Keeps ice prison from T3
      icePrison: {
        enabled: true,
        shatterRadius: 130,
        shatterDamage: 60,
        shatterChance: 1.0,
      },
    },

    // Visual properties
    color: '#00FFFF',
    size: 16,
    shape: 'diamond',
    lifetime: 4.0,
    icon: 'eternal_winter',
    imageId: 'weapon_eternal_winter',
    projectileImageId: 'eternal_winter_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 49, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 4.5, slowAmount: 0.65 }, { type: StatusEffectType.FREEZE, chance: 0.55, duration: 3 }] },
      3: { damage: 61, pierce: 6, specialAbility: { frostAura: { radius: 180, damagePerSecond: 15 } } },
      4: { damage: 76, projectileCount: 7, cooldown: 0.5 },
      5: { damage: 95, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 5, slowAmount: 0.7 }, { type: StatusEffectType.FREEZE, chance: 0.65, duration: 3.5 }], specialAbility: { frostAura: { radius: 220, damagePerSecond: 25, freezeChance: 0.2 }, blizzard: { interval: 12, radius: 400, damage: 140, freezeChance: 0.5 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
