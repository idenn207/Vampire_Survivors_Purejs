/**
 * @fileoverview Frost Elemental - Uncommon summon with slow aura and freeze explosion
 * @module Data/Weapons/Uncommon/FrostElemental
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.frost_elemental = {
    id: 'frost_elemental',
    name: 'Frost Elemental',
    description: 'An ice golem with a slow aura that explodes into a freeze nova on death',
    attackType: AttackType.SUMMON,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 22,
    cooldown: 0.0,
    summonCount: 1,
    summonDuration: 0,

    color: '#66DDFF',
    visualScale: 1.2,
    icon: 'frost_elemental',
    imageId: 'weapon_frost_elemental',
    summonImageId: 'frost_elemental_summon',

    summonStats: {
      health: 100,
      speed: 70,
      attackCooldown: 1.2,
      attackRange: 50,
      size: 28,
      attackType: 'melee',
    },

    slowAura: {
      enabled: true,
      radius: 80,
      slowAmount: 0.3,
    },

    deathExplosion: {
      enabled: true,
      radius: 100,
      damage: 40,
      freezeDuration: 1.5,
    },

    statusEffect: {
      type: 'slow',
      speedModifier: 0.6,
      duration: 1.5,
    },

    summonVisual: {
      type: 'ice_golem',
      bodyColor: '#88DDFF',
      coreColor: '#FFFFFF',
      iceShards: true,
      frostAura: true,
    },

    particles: {
      enabled: true,
      type: 'frost_crystals',
      color: '#AAEEFF',
      count: 6,
      spread: 40,
      lifetime: 0.5,
      floating: true,
    },

    glow: {
      enabled: true,
      radius: 30,
      intensity: 0.4,
      color: '#66DDFF',
    },

    upgrades: {
      2: { damage: 29, summonStats: { health: 130 }, slowAura: { slowAmount: 0.35 } },
      3: { damage: 38, deathExplosion: { radius: 120, damage: 55 } },
      4: { damage: 50, summonStats: { health: 160 }, slowAura: { radius: 100 } },
      5: { damage: 65, deathExplosion: { freezeDuration: 2.0, damage: 75 }, summonCount: 2 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
