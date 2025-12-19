/**
 * @fileoverview Cluster Mine - Uncommon mine that splits into smaller explosions
 * @module Data/Weapons/Uncommon/ClusterMine
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.cluster_mine = {
    id: 'cluster_mine',
    name: 'Cluster Mine',
    description: 'A mine that splits into 4 smaller explosions on detonation',
    attackType: AttackType.MINE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 35,
    cooldown: 4.0,
    range: 280,
    triggerRadius: 40,
    explosionRadius: 55,
    duration: 20.0,

    color: '#FF6600',
    icon: 'cluster_mine',
    imageId: 'weapon_cluster_mine',

    cluster: {
      enabled: true,
      clusterCount: 4,
      clusterDamage: 0.4,
      clusterRadius: 35,
      clusterSpread: 50,
      clusterDelay: 0.15,
    },

    mineVisual: {
      type: 'cluster_device',
      coreColor: '#FF4400',
      segmentColor: '#FF8800',
      segments: 4,
      blinkRate: 2,
    },

    particles: {
      enabled: true,
      type: 'explosion_fragments',
      colors: ['#FF4400', '#FF8800', '#FFCC00'],
      count: 12,
      spread: 60,
      lifetime: 0.5,
      gravity: true,
    },

    glow: {
      enabled: true,
      radius: 25,
      intensity: 0.5,
      color: '#FF6600',
      pulse: true,
    },

    screenShake: {
      enabled: true,
      intensity: 4,
      duration: 0.2,
    },

    upgrades: {
      2: { damage: 46, cluster: { clusterCount: 5, clusterDamage: 0.45 } },
      3: { damage: 60, cooldown: 3.5, explosionRadius: 65 },
      4: { damage: 78, cluster: { clusterCount: 6, clusterRadius: 40 } },
      5: { damage: 100, cooldown: 3.0, cluster: { clusterDamage: 0.5 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
