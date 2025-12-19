/**
 * @fileoverview Prismatic Ray - Uncommon laser with cycling rainbow effects
 * @module Data/Weapons/Uncommon/PrismaticRay
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.prismatic_ray = {
    id: 'prismatic_ray',
    name: 'Prismatic Ray',
    description: 'A rainbow beam that cycles colors, each color applying a different effect',
    attackType: AttackType.LASER,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 14,
    cooldown: 1.0,
    range: 380,
    width: 12,
    duration: 0.4,
    tickRate: 0.1,

    color: '#FF00FF',
    icon: 'prismatic_ray',
    imageId: 'weapon_prismatic_ray',

    colorCycle: {
      enabled: true,
      cycleRate: 0.5,
      colors: [
        { color: '#FF0000', effect: 'burn', damage: 4, duration: 2.0 },
        { color: '#FF8800', effect: 'none', damageBonus: 1.3 },
        { color: '#FFFF00', effect: 'slow', speedModifier: 0.5, duration: 1.5 },
        { color: '#00FF00', effect: 'poison', damage: 3, duration: 3.0 },
        { color: '#0088FF', effect: 'freeze', duration: 0.5 },
        { color: '#8800FF', effect: 'weakness', damageBonus: 1.2, duration: 2.0 },
      ],
    },

    laserVisual: {
      type: 'prismatic',
      coreColor: '#FFFFFF',
      rainbow: true,
      shimmer: true,
    },

    particles: {
      enabled: true,
      type: 'rainbow_sparkles',
      colors: ['#FF0000', '#FF8800', '#FFFF00', '#00FF00', '#0088FF', '#8800FF'],
      count: 8,
      spread: 25,
      lifetime: 0.3,
    },

    glow: {
      enabled: true,
      radius: 25,
      intensity: 0.6,
      rainbow: true,
    },

    upgrades: {
      2: { damage: 18, width: 14, colorCycle: { cycleRate: 0.4 } },
      3: { damage: 24, cooldown: 0.9, range: 420 },
      4: { damage: 31, width: 16, duration: 0.5 },
      5: { damage: 40, cooldown: 0.8, colorCycle: { cycleRate: 0.3 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
