/**
 * @fileoverview Frost Circle - Common area that slows enemies
 * @module Data/Weapons/Common/FrostCircle
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.frost_circle = {
    id: 'frost_circle',
    name: 'Frost Circle',
    description: 'Creates an icy ring that slows all enemies within',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 6,
    cooldown: 5.0,
    radius: 70,
    tickRate: 0.4,
    duration: 4.0,
    range: 220,

    color: '#66DDFF',
    icon: 'frost_ring',
    imageId: 'weapon_frost_circle',

    statusEffect: {
      type: 'slow',
      speedModifier: 0.6,
      duration: 1.5,
    },

    areaVisual: {
      type: 'icy_ring',
      frostPattern: true,
      alpha: 0.5,
    },

    particles: {
      enabled: true,
      type: 'snowflakes',
      color: '#AAEEFF',
      count: 6,
      spread: 60,
      lifetime: 1.0,
    },

    upgrades: {
      2: { damage: 8, radius: 80, statusEffect: { speedModifier: 0.55 } },
      3: { damage: 11, duration: 5.0, cooldown: 4.5 },
      4: { damage: 15, radius: 90, statusEffect: { speedModifier: 0.5 } },
      5: { damage: 20, duration: 6.0, statusEffect: { duration: 2.0 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
