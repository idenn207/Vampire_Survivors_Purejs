/**
 * @fileoverview Light Ray - Common basic thin laser
 * @module Data/Weapons/Common/LightRay
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.light_ray = {
    id: 'light_ray',
    name: 'Light Ray',
    description: 'A focused beam of light that pierces through enemies',
    attackType: AttackType.LASER,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 12,
    cooldown: 0.8,
    range: 350,
    width: 8,
    duration: 0.3,
    tickRate: 0.1,

    color: '#FFFF00',
    icon: 'light_ray',
    imageId: 'weapon_light_ray',

    laserVisual: {
      type: 'beam',
      coreColor: '#FFFFFF',
      edgeColor: '#FFFF00',
    },

    particles: {
      enabled: true,
      type: 'light_motes',
      color: '#FFFFAA',
      count: 4,
      spread: 15,
      lifetime: 0.25,
    },

    glow: {
      enabled: true,
      radius: 15,
      intensity: 0.5,
      color: '#FFFF00',
    },

    upgrades: {
      2: { damage: 16, width: 10, range: 380 },
      3: { damage: 21, duration: 0.4, cooldown: 0.7 },
      4: { damage: 28, width: 12, range: 420 },
      5: { damage: 37, duration: 0.5, cooldown: 0.6 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
