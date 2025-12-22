/**
 * @fileoverview Blizzard Zone - Uncommon area with stacking slow into freeze
 * @module Data/Weapons/Uncommon/BlizzardZone
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.blizzard_zone = {
    id: 'blizzard_zone',
    name: 'Blizzard Zone',
    description: 'A freezing storm that stacks slow. At 3 stacks, enemies freeze solid',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 6,
    cooldown: 4.5,
    radius: 85,
    duration: 4.0,
    tickRate: 0.3,
    range: 280,

    color: '#88DDFF',
    icon: 'blizzard_zone',
    imageId: 'weapon_blizzard_zone',
    areaImageId: 'blizzard_zone_area',

    stackingSlow: {
      enabled: true,
      slowPerStack: 0.2,
      maxStacks: 3,
      stackDuration: 2.0,
      freezeAtMax: true,
      freezeDuration: 1.5,
    },

    areaVisual: {
      type: 'blizzard',
      coreColor: '#FFFFFF',
      edgeColor: '#88DDFF',
      snowfall: true,
      windLines: true,
    },

    particles: {
      enabled: true,
      type: 'snowflakes',
      color: '#FFFFFF',
      count: 20,
      spread: 70,
      lifetime: 0.8,
      swirl: true,
    },

    glow: {
      enabled: true,
      radius: 45,
      intensity: 0.4,
      color: '#88DDFF',
    },

    upgrades: {
      2: { damage: 8, stackingSlow: { freezeDuration: 1.8 }, radius: 95 },
      3: { damage: 10, cooldown: 4.0, duration: 4.5 },
      4: { damage: 13, stackingSlow: { freezeDuration: 2.2, slowPerStack: 0.25 } },
      5: { damage: 17, cooldown: 3.5, radius: 110 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
