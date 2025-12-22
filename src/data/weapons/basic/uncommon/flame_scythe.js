/**
 * @fileoverview Flame Scythe - Uncommon melee that leaves fire trail
 * @module Data/Weapons/Uncommon/FlameScythe
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.flame_scythe = {
    id: 'flame_scythe',
    name: 'Flame Scythe',
    description: 'A burning scythe that leaves a trail of fire with each wide sweep',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 32,
    cooldown: 1.2,
    range: 100,
    arc: 180,
    knockback: 60,

    color: '#FF6600',
    icon: 'flame_scythe',
    imageId: 'weapon_flame_scythe',
    meleeImageId: 'flame_scythe_melee',

    statusEffect: {
      type: 'burn',
      damage: 5,
      duration: 2.5,
      tickRate: 0.5,
    },

    fireTrail: {
      enabled: true,
      duration: 1.5,
      tickDamage: 8,
      tickRate: 0.3,
      width: 30,
    },

    swingVisual: {
      type: 'scythe',
      width: 15,
      length: 100,
      curveAmount: 0.4,
      bladeColor: '#FF4400',
      handleColor: '#442200',
    },

    trail: {
      enabled: true,
      type: 'fire',
      colors: ['#FF6600', '#FFAA00', '#FFCC00'],
      length: 50,
      width: 20,
      fade: true,
    },

    particles: {
      enabled: true,
      type: 'flames',
      colors: ['#FF4400', '#FF8800', '#FFCC00'],
      count: 8,
      spread: 35,
      lifetime: 0.4,
    },

    glow: {
      enabled: true,
      radius: 25,
      intensity: 0.6,
      color: '#FF6600',
    },

    upgrades: {
      2: { damage: 42, statusEffect: { damage: 7 }, fireTrail: { duration: 2.0 } },
      3: { damage: 55, cooldown: 1.1, range: 110 },
      4: { damage: 72, fireTrail: { tickDamage: 12 }, arc: 200 },
      5: { damage: 94, cooldown: 1.0, statusEffect: { damage: 10 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
