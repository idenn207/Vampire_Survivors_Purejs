/**
 * @fileoverview Split Arrow - Uncommon arrow that fragments on impact
 * @module Data/Weapons/Uncommon/SplitArrow
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.split_arrow = {
    id: 'split_arrow',
    name: 'Split Arrow',
    description: 'An arrow that shatters into 3 fragments on impact, each seeking new targets',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 22,
    cooldown: 1.3,
    projectileCount: 1,
    projectileSpeed: 450,
    range: 400,
    pierce: 1,

    color: '#44AA44',
    icon: 'split_arrow',
    imageId: 'weapon_split_arrow',

    split: {
      enabled: true,
      fragmentCount: 3,
      fragmentDamage: 0.5,
      fragmentSpeed: 350,
      fragmentRange: 200,
      spreadAngle: 60,
    },

    projectileVisual: {
      type: 'arrow',
      size: 16,
      shape: 'pointed',
      featherColor: '#66CC66',
    },

    trail: {
      enabled: true,
      type: 'line',
      color: '#66CC66',
      length: 18,
      width: 3,
      fade: true,
    },

    particles: {
      enabled: true,
      type: 'splinters',
      color: '#88DD88',
      count: 6,
      spread: 30,
      lifetime: 0.3,
      onSplit: true,
    },

    glow: {
      enabled: true,
      radius: 10,
      intensity: 0.3,
      color: '#44AA44',
    },

    upgrades: {
      2: { damage: 29, split: { fragmentCount: 4, fragmentDamage: 0.55 } },
      3: { damage: 38, cooldown: 1.1, projectileCount: 2 },
      4: { damage: 50, split: { fragmentCount: 5, fragmentRange: 250 } },
      5: { damage: 65, split: { fragmentDamage: 0.65 }, cooldown: 0.9 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
