/**
 * @fileoverview Arc Lightning - Uncommon chain lightning with stacking stun
 * @module Data/Weapons/Uncommon/ArcLightning
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.arc_lightning = {
    id: 'arc_lightning',
    name: 'Arc Lightning',
    description: 'Lightning chains between 5 enemies, each jump adding stacking stun',
    attackType: AttackType.PARTICLE,
    targetingMode: TargetingMode.CHAIN,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 18,
    cooldown: 1.2,
    chainCount: 5,
    chainRange: 120,
    damageDecay: 0.9,

    color: '#FFFF00',
    icon: 'arc_lightning',
    imageId: 'weapon_arc_lightning',

    stackingStun: {
      enabled: true,
      stunPerChain: 0.1,
      maxStun: 0.8,
    },

    chainVisual: {
      type: 'lightning',
      color: '#FFFF00',
      secondaryColor: '#FFFFFF',
      thickness: 3,
      jagged: true,
      segments: 6,
    },

    particles: {
      enabled: true,
      type: 'electric_sparks',
      color: '#FFFF88',
      count: 6,
      spread: 25,
      lifetime: 0.2,
    },

    glow: {
      enabled: true,
      radius: 20,
      intensity: 0.6,
      color: '#FFFF00',
      flash: true,
    },

    sound: {
      type: 'thunder_crack',
      volume: 0.5,
    },

    upgrades: {
      2: { damage: 24, chainCount: 6, stackingStun: { stunPerChain: 0.12 } },
      3: { damage: 31, cooldown: 1.1, chainRange: 140 },
      4: { damage: 40, chainCount: 7, damageDecay: 0.92 },
      5: { damage: 52, cooldown: 1.0, stackingStun: { maxStun: 1.0 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
