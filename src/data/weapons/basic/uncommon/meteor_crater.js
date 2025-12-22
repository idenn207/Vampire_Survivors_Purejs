/**
 * @fileoverview Meteor Crater - Uncommon area with warning and afterburn
 * @module Data/Weapons/Uncommon/MeteorCrater
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.meteor_crater = {
    id: 'meteor_crater',
    name: 'Meteor Crater',
    description: 'Calls down a meteor that creates a burning crater on impact',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 55,
    cooldown: 5.5,
    radius: 80,
    duration: 3.0,
    tickRate: 0.4,
    range: 350,

    color: '#FF6600',
    icon: 'meteor_crater',
    imageId: 'weapon_meteor_crater',
    areaImageId: 'meteor_crater_area',

    warning: {
      enabled: true,
      duration: 0.8,
      type: 'target_circle',
      color: '#FF4400',
    },

    impact: {
      damage: 55,
      knockback: 200,
      screenShake: 8,
    },

    afterburn: {
      enabled: true,
      damage: 10,
      duration: 3.0,
      tickRate: 0.4,
    },

    statusEffect: {
      type: 'burn',
      damage: 6,
      duration: 2.5,
      tickRate: 0.5,
    },

    areaVisual: {
      type: 'crater',
      coreColor: '#FF2200',
      edgeColor: '#FF8800',
      crackPattern: true,
      embers: true,
    },

    particles: {
      enabled: true,
      type: 'meteor_debris',
      colors: ['#FF4400', '#FF8800', '#444444'],
      count: 15,
      spread: 70,
      lifetime: 0.6,
      gravity: true,
    },

    glow: {
      enabled: true,
      radius: 50,
      intensity: 0.7,
      color: '#FF6600',
    },

    upgrades: {
      2: { damage: 72, impact: { damage: 72 }, afterburn: { damage: 13 } },
      3: { damage: 94, cooldown: 5.0, radius: 90 },
      4: { damage: 122, afterburn: { duration: 4.0 }, statusEffect: { damage: 8 } },
      5: { damage: 160, cooldown: 4.5, impact: { screenShake: 12 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
