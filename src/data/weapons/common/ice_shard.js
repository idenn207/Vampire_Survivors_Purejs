/**
 * @fileoverview Ice Shard - Common projectile with pierce and slow effect
 * @module Data/Weapons/Common/IceShard
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.ice_shard = {
    id: 'ice_shard',
    name: 'Ice Shard',
    description: 'Crystalline ice that pierces enemies and chills their movement',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 15,
    cooldown: 0.8,
    projectileCount: 1,
    projectileSpeed: 380,
    range: 350,
    pierce: 1,
    spread: 0,

    color: '#66DDFF',
    size: 8,
    shape: 'diamond',
    lifetime: 2.0,
    icon: 'ice_shard',
    imageId: 'weapon_ice_shard',

    statusEffect: {
      type: 'slow',
      speedModifier: 0.7,
      duration: 1.5,
    },

    trail: {
      enabled: true,
      color: '#AAEEFF',
      length: 12,
      fade: 0.5,
    },

    particles: {
      enabled: true,
      type: 'frost',
      color: '#CCFFFF',
      count: 3,
      spread: 10,
      lifetime: 0.4,
    },

    upgrades: {
      2: { damage: 20, pierce: 2, statusEffect: { duration: 2.0 } },
      3: { damage: 27, projectileCount: 2, cooldown: 0.7 },
      4: { damage: 36, pierce: 3, statusEffect: { speedModifier: 0.6 } },
      5: { damage: 48, projectileCount: 3, pierce: 4 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
