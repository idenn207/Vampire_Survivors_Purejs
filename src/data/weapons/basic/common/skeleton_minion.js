/**
 * @fileoverview Skeleton Minion - Common basic melee summon
 * @module Data/Weapons/Common/SkeletonMinion
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.skeleton_minion = {
    id: 'skeleton_minion',
    name: 'Skeleton Minion',
    description: 'Summons a basic skeleton warrior that fights for you',
    attackType: AttackType.SUMMON,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 18,
    cooldown: 5.0,
    summonCount: 1,
    summonDuration: 0,

    color: '#DDDDAA',
    visualScale: 1.2,
    icon: 'skeleton',
    imageId: 'weapon_skeleton_minion',
    summonImageId: 'skeleton_minion_summon',

    summonStats: {
      health: 60,
      speed: 120,
      attackCooldown: 0.8,
      attackRange: 40,
      size: 20,
    },

    summonVisual: {
      type: 'skeleton',
      boneColor: '#EEDDCC',
      eyeGlow: '#FFFF00',
    },

    particles: {
      enabled: true,
      type: 'bone_dust',
      color: '#DDCCAA',
      count: 3,
      spread: 15,
      lifetime: 0.3,
    },

    upgrades: {
      2: { damage: 24, summonStats: { health: 80 }, summonCount: 2 },
      3: { damage: 32, summonStats: { speed: 140, attackCooldown: 0.7 } },
      4: { damage: 42, summonStats: { health: 100 }, summonCount: 3 },
      5: { damage: 55, summonStats: { attackCooldown: 0.6 }, summonCount: 4 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
