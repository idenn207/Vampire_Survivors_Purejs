/**
 * @fileoverview Hallowed Ring - Uncommon area that buffs player in center
 * @module Data/Weapons/Uncommon/HallowedRing
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.hallowed_ring = {
    id: 'hallowed_ring',
    name: 'Hallowed Ring',
    description: 'A holy ring that damages enemies and heals the player standing within',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.MOUSE,
    isAuto: false,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 10,
    cooldown: 6.0,
    radius: 90,
    duration: 4.0,
    tickRate: 0.5,
    range: 0,

    color: '#FFD700',
    icon: 'hallowed_ring',
    imageId: 'weapon_hallowed_ring',
    areaImageId: 'hallowed_ring_area',

    ringShape: {
      enabled: true,
      innerRadius: 50,
      outerRadius: 90,
    },

    playerBuff: {
      enabled: true,
      healPerSecond: 3,
      damageBonus: 1.15,
      speedBonus: 1.1,
    },

    areaVisual: {
      type: 'holy_ring',
      coreColor: '#FFFFFF',
      edgeColor: '#FFD700',
      rays: true,
      rayCount: 8,
    },

    particles: {
      enabled: true,
      type: 'holy_motes',
      color: '#FFFFAA',
      count: 8,
      spread: 60,
      lifetime: 0.5,
      rising: true,
    },

    glow: {
      enabled: true,
      radius: 60,
      intensity: 0.6,
      color: '#FFD700',
    },

    upgrades: {
      2: { damage: 13, playerBuff: { healPerSecond: 4 }, duration: 4.5 },
      3: { damage: 17, cooldown: 5.5, playerBuff: { damageBonus: 1.2 } },
      4: { damage: 22, playerBuff: { healPerSecond: 5, speedBonus: 1.15 } },
      5: { damage: 29, cooldown: 5.0, radius: 100, playerBuff: { damageBonus: 1.3 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
