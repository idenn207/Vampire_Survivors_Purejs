/**
 * @fileoverview Shadow Clone - Uncommon summon that copies player weapons
 * @module Data/Weapons/Uncommon/ShadowClone
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.shadow_clone = {
    id: 'shadow_clone',
    name: 'Shadow Clone',
    description: 'Summons a dark copy of yourself that uses your weapons at 40% damage',
    attackType: AttackType.SUMMON,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 0,
    cooldown: 0.0,
    summonCount: 1,
    summonDuration: 0,

    color: '#333366',
    icon: 'shadow_clone',
    imageId: 'weapon_shadow_clone',
    summonImageId: 'shadow_clone_summon',

    summonStats: {
      health: 80,
      speed: 100,
      attackCooldown: 0.0,
      attackRange: 0,
      size: 25,
    },

    cloneBehavior: {
      enabled: true,
      damageMultiplier: 0.4,
      copyWeapons: true,
      followDistance: 80,
      mirrorMovement: true,
    },

    summonVisual: {
      type: 'shadow',
      transparency: 0.6,
      shadowColor: '#222244',
      distortion: true,
    },

    trail: {
      enabled: true,
      type: 'shadow',
      color: '#333366',
      length: 20,
      fade: true,
    },

    particles: {
      enabled: true,
      type: 'shadow_wisps',
      color: '#444488',
      count: 4,
      spread: 20,
      lifetime: 0.4,
    },

    glow: {
      enabled: true,
      radius: 25,
      intensity: 0.3,
      color: '#333366',
    },

    upgrades: {
      2: { cloneBehavior: { damageMultiplier: 0.45 }, summonStats: { health: 100 } },
      3: { cloneBehavior: { damageMultiplier: 0.5 }, summonCount: 2 },
      4: { cloneBehavior: { damageMultiplier: 0.55 }, summonStats: { health: 120 } },
      5: { cloneBehavior: { damageMultiplier: 0.6 }, summonCount: 3 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
