/**
 * @fileoverview Blood Razor - Uncommon melee with lifesteal
 * @module Data/Weapons/Uncommon/BloodRazor
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.blood_razor = {
    id: 'blood_razor',
    name: 'Blood Razor',
    description: 'A vampiric blade that steals life. Deals more damage when you are wounded',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 26,
    cooldown: 0.8,
    range: 75,
    arc: 100,
    knockback: 40,

    color: '#CC0000',
    icon: 'blood_razor',
    imageId: 'weapon_blood_razor',

    lifesteal: {
      enabled: true,
      percent: 15,
    },

    woundedBonus: {
      enabled: true,
      thresholdPercent: 50,
      damageMultiplier: 1.5,
    },

    statusEffect: {
      type: 'bleed',
      damage: 4,
      duration: 2.0,
      tickRate: 0.4,
    },

    swingVisual: {
      type: 'razor',
      width: 8,
      length: 75,
      bladeColor: '#880000',
      bloodDrip: true,
    },

    trail: {
      enabled: true,
      type: 'blood',
      color: '#AA0000',
      length: 30,
      width: 12,
      fade: true,
      drip: true,
    },

    particles: {
      enabled: true,
      type: 'blood_droplets',
      color: '#CC0000',
      count: 6,
      spread: 25,
      lifetime: 0.4,
      gravity: true,
    },

    glow: {
      enabled: true,
      radius: 15,
      intensity: 0.4,
      color: '#CC0000',
    },

    upgrades: {
      2: { damage: 34, lifesteal: { percent: 18 }, statusEffect: { damage: 5 } },
      3: { damage: 44, cooldown: 0.7, woundedBonus: { damageMultiplier: 1.7 } },
      4: { damage: 58, lifesteal: { percent: 22 }, range: 85 },
      5: { damage: 75, cooldown: 0.6, woundedBonus: { damageMultiplier: 2.0 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
