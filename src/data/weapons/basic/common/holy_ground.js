/**
 * @fileoverview Holy Ground - Common area that heals player inside
 * @module Data/Weapons/Common/HolyGround
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.holy_ground = {
    id: 'holy_ground',
    name: 'Holy Ground',
    description: 'Creates blessed ground that damages enemies and heals the player',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.NEAREST, // Centers on player
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 10,
    cooldown: 6.0,
    radius: 70,
    tickRate: 0.5,
    duration: 4.0,
    followPlayer: false,

    color: '#FFDD66',
    icon: 'holy_ground',
    imageId: 'weapon_holy_ground',

    // Healing effect
    healing: {
      enabled: true,
      healPerTick: 2,
      requirePlayerInside: true,
    },

    areaVisual: {
      type: 'golden_circle',
      lightRays: true,
      alpha: 0.5,
    },

    particles: {
      enabled: true,
      type: 'light_motes',
      color: '#FFFFAA',
      count: 6,
      spread: 60,
      lifetime: 0.8,
      riseUp: true,
    },

    glow: {
      enabled: true,
      radius: 80,
      intensity: 0.35,
      color: '#FFDD66',
    },

    upgrades: {
      2: { damage: 14, healing: { healPerTick: 3 }, radius: 80 },
      3: { damage: 18, duration: 5.0, cooldown: 5.5 },
      4: { damage: 24, healing: { healPerTick: 4 }, radius: 90 },
      5: { damage: 32, duration: 6.0, healing: { healPerTick: 5 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
