/**
 * @fileoverview Ember Field - Common area with fast fire tick rate
 * @module Data/Weapons/Common/EmberField
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.ember_field = {
    id: 'ember_field',
    name: 'Ember Field',
    description: 'A field of burning embers with rapid tick damage',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 5,
    cooldown: 3.5,
    radius: 55,
    tickRate: 0.25,
    duration: 4.0,
    range: 230,

    color: '#FF6600',
    visualScale: 1.2,
    icon: 'ember_field',
    imageId: 'weapon_ember_field',
    areaImageId: 'ember_field_area',

    statusEffect: {
      type: 'burn',
      damage: 3,
      duration: 2.0,
      tickRate: 0.5,
    },

    areaVisual: {
      type: 'burning_ground',
      flickering: true,
      alpha: 0.55,
    },

    particles: {
      enabled: true,
      type: 'embers',
      color: '#FFAA00',
      count: 8,
      spread: 45,
      lifetime: 0.6,
    },

    glow: {
      enabled: true,
      radius: 60,
      intensity: 0.3,
      color: '#FF6600',
    },

    upgrades: {
      2: { damage: 7, tickRate: 0.22, statusEffect: { damage: 4 } },
      3: { damage: 9, radius: 65, duration: 5.0 },
      4: { damage: 12, tickRate: 0.2, statusEffect: { damage: 5 } },
      5: { damage: 16, radius: 75, duration: 6.0 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
