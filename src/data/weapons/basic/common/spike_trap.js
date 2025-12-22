/**
 * @fileoverview Spike Trap - Common proximity mine
 * @module Data/Weapons/Common/SpikeTrap
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.spike_trap = {
    id: 'spike_trap',
    name: 'Spike Trap',
    description: 'A basic proximity trap that impales enemies who step on it',
    attackType: AttackType.MINE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 40,
    cooldown: 3.0,
    range: 250,
    triggerRadius: 35,
    explosionRadius: 45,
    duration: 20.0,

    color: '#888888',
    icon: 'spike_trap',
    imageId: 'weapon_spike_trap',
    mineImageId: 'test_mine',

    mineVisual: {
      type: 'metal_spikes',
      hidden: true,
      revealOnProximity: 30,
    },

    particles: {
      enabled: true,
      type: 'metal_shards',
      color: '#AAAAAA',
      count: 5,
      spread: 30,
      lifetime: 0.3,
    },

    upgrades: {
      2: { damage: 52, triggerRadius: 40, cooldown: 2.8 },
      3: { damage: 68, explosionRadius: 55, duration: 25.0 },
      4: { damage: 88, triggerRadius: 45, cooldown: 2.5 },
      5: { damage: 115, explosionRadius: 65, duration: 30.0 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
