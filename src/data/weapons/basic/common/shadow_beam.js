/**
 * @fileoverview Shadow Beam - Common dark laser that causes brief fear
 * @module Data/Weapons/Common/ShadowBeam
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.shadow_beam = {
    id: 'shadow_beam',
    name: 'Shadow Beam',
    description: 'A dark beam that terrifies enemies, briefly slowing them',
    attackType: AttackType.LASER,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 10,
    cooldown: 1.0,
    range: 320,
    width: 10,
    duration: 0.35,
    tickRate: 0.1,

    color: '#660099',
    visualScale: 1.2,
    icon: 'shadow_beam',
    imageId: 'weapon_shadow_beam',
    laserImageId: 'shadow_beam_laser',

    statusEffect: {
      type: 'slow',
      speedModifier: 0.5,
      duration: 1.0,
    },

    laserVisual: {
      type: 'dark_beam',
      coreColor: '#000000',
      edgeColor: '#660099',
      shadowEffect: true,
    },

    particles: {
      enabled: true,
      type: 'shadow_wisps',
      color: '#9966CC',
      count: 5,
      spread: 20,
      lifetime: 0.35,
    },

    glow: {
      enabled: true,
      radius: 18,
      intensity: 0.4,
      color: '#660099',
    },

    upgrades: {
      2: { damage: 14, statusEffect: { duration: 1.3 }, width: 12 },
      3: { damage: 18, cooldown: 0.9, range: 350 },
      4: { damage: 24, statusEffect: { speedModifier: 0.4 }, width: 14 },
      5: { damage: 32, statusEffect: { duration: 1.8 }, cooldown: 0.8 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
