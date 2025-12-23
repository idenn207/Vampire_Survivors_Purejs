/**
 * @fileoverview Ice Bomb - Common mine that freezes enemies
 * @module Data/Weapons/Common/IceBomb
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.ice_bomb = {
    id: 'ice_bomb',
    name: 'Ice Bomb',
    description: 'An icy explosive that freezes enemies solid on detonation',
    attackType: AttackType.MINE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 30,
    cooldown: 4.5,
    range: 260,
    triggerRadius: 38,
    explosionRadius: 65,
    duration: 18.0,
    triggerMode: 'timed',
    detonationTime: 2,

    color: '#66DDFF',
    visualScale: 1.2,
    icon: 'ice_bomb',
    imageId: 'weapon_ice_bomb',
    mineImageId: 'ice_bomb_mine',

    statusEffect: {
      type: 'freeze',
      duration: 1.5,
    },

    mineVisual: {
      type: 'frost_crystal',
      shimmer: true,
    },

    particles: {
      enabled: true,
      type: 'ice_shards',
      color: '#AAEEFF',
      count: 8,
      spread: 55,
      lifetime: 0.5,
    },

    glow: {
      enabled: true,
      radius: 30,
      intensity: 0.4,
      color: '#66DDFF',
    },

    upgrades: {
      2: { damage: 40, statusEffect: { duration: 1.8 }, explosionRadius: 75 },
      3: { damage: 52, cooldown: 4.0, triggerRadius: 42 },
      4: { damage: 68, statusEffect: { duration: 2.2 }, explosionRadius: 85 },
      5: { damage: 88, statusEffect: { duration: 2.5 }, cooldown: 3.5 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
