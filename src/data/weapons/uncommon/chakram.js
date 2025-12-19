/**
 * @fileoverview Chakram - Uncommon returning projectile
 * @module Data/Weapons/Uncommon/Chakram
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.chakram = {
    id: 'chakram',
    name: 'Chakram',
    description: 'A golden spinning ring that returns to you, dealing extra damage on the way back',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 24,
    cooldown: 1.6,
    projectileCount: 1,
    projectileSpeed: 380,
    range: 300,
    pierce: 99,

    color: '#FFD700',
    icon: 'chakram',
    imageId: 'weapon_chakram',

    boomerang: {
      enabled: true,
      returnDamageMultiplier: 1.5,
      returnSpeed: 450,
      curveStrength: 0.3,
    },

    projectileVisual: {
      type: 'ring',
      size: 18,
      innerRadius: 8,
      outerRadius: 18,
      rotation: true,
      rotationSpeed: 720,
      metallic: true,
    },

    trail: {
      enabled: true,
      type: 'arc',
      color: '#FFEE00',
      length: 30,
      width: 6,
      fade: true,
    },

    particles: {
      enabled: true,
      type: 'golden_sparks',
      color: '#FFD700',
      count: 4,
      spread: 15,
      lifetime: 0.2,
    },

    glow: {
      enabled: true,
      radius: 15,
      intensity: 0.5,
      color: '#FFD700',
    },

    upgrades: {
      2: { damage: 32, boomerang: { returnDamageMultiplier: 1.6 }, projectileCount: 2 },
      3: { damage: 42, cooldown: 1.4, range: 350 },
      4: { damage: 55, boomerang: { returnDamageMultiplier: 1.8 }, projectileCount: 3 },
      5: { damage: 72, cooldown: 1.2, boomerang: { returnDamageMultiplier: 2.0 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
