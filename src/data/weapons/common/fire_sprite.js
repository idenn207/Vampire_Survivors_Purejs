/**
 * @fileoverview Fire Sprite - Common ranged fire summon with burn
 * @module Data/Weapons/Common/FireSprite
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.fire_sprite = {
    id: 'fire_sprite',
    name: 'Fire Sprite',
    description: 'Summons a floating flame that shoots fireballs at enemies',
    attackType: AttackType.SUMMON,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 15,
    cooldown: 0.0,
    summonCount: 1,
    summonDuration: 0,

    color: '#FF6600',
    icon: 'fire_sprite',
    imageId: 'weapon_fire_sprite',

    summonStats: {
      health: 40,
      speed: 100,
      attackCooldown: 1.0,
      attackRange: 200,
      size: 15,
      attackType: 'projectile',
      projectileSpeed: 300,
    },

    statusEffect: {
      type: 'burn',
      damage: 3,
      duration: 2.0,
      tickRate: 0.5,
    },

    summonVisual: {
      type: 'flame_wisp',
      flameColors: ['#FF6600', '#FFAA00', '#FFCC00'],
      flicker: true,
    },

    particles: {
      enabled: true,
      type: 'embers',
      color: '#FFAA00',
      count: 4,
      spread: 10,
      lifetime: 0.4,
    },

    glow: {
      enabled: true,
      radius: 20,
      intensity: 0.5,
      color: '#FF6600',
    },

    upgrades: {
      2: { damage: 20, summonStats: { health: 55 }, summonCount: 2 },
      3: { damage: 27, summonStats: { attackCooldown: 0.85 }, statusEffect: { damage: 4 } },
      4: { damage: 35, summonStats: { health: 70 }, summonCount: 3 },
      5: { damage: 46, summonStats: { attackCooldown: 0.7 }, statusEffect: { damage: 6 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
