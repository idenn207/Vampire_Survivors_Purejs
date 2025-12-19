/**
 * @fileoverview Spark Chain - Common particle with 2-chain lightning
 * @module Data/Weapons/Common/SparkChain
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.spark_chain = {
    id: 'spark_chain',
    name: 'Spark Chain',
    description: 'Electric sparks that chain between two nearby enemies',
    attackType: AttackType.PARTICLE,
    targetingMode: TargetingMode.CHAIN,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 18,
    cooldown: 1.0,
    chainCount: 2,
    chainRange: 100,
    particleCount: 1,

    color: '#FFFF00',
    icon: 'spark',
    imageId: 'weapon_spark_chain',

    chainVisual: {
      type: 'electric_arc',
      color: '#FFFF66',
      thickness: 2,
      jagged: true,
    },

    particles: {
      enabled: true,
      type: 'sparks',
      color: '#FFFFFF',
      count: 4,
      spread: 15,
      lifetime: 0.2,
    },

    glow: {
      enabled: true,
      radius: 12,
      intensity: 0.5,
      color: '#FFFF00',
    },

    upgrades: {
      2: { damage: 24, chainCount: 3, chainRange: 120 },
      3: { damage: 32, cooldown: 0.9, particleCount: 2 },
      4: { damage: 42, chainCount: 4, chainRange: 140 },
      5: { damage: 55, chainCount: 5, cooldown: 0.8 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
