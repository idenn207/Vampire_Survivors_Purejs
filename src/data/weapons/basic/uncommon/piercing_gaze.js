/**
 * @fileoverview Piercing Gaze - Uncommon laser that locks on and ramps damage
 * @module Data/Weapons/Uncommon/PiercingGaze
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.piercing_gaze = {
    id: 'piercing_gaze',
    name: 'Piercing Gaze',
    description: 'A focused beam that locks onto a target, damage ramping up to 3x over time',
    attackType: AttackType.LASER,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 8,
    cooldown: 0.0,
    range: 350,
    width: 8,
    duration: 0.0,
    tickRate: 0.1,

    color: '#FF00AA',
    icon: 'piercing_gaze',
    imageId: 'weapon_piercing_gaze',

    lockOn: {
      enabled: true,
      lockTime: 0.3,
      breakDistance: 400,
    },

    damageRamp: {
      enabled: true,
      startMultiplier: 1.0,
      maxMultiplier: 3.0,
      rampTime: 2.0,
      decayOnBreak: true,
    },

    channeled: {
      enabled: true,
      drainRate: 0,
    },

    laserVisual: {
      type: 'focused_beam',
      coreColor: '#FFFFFF',
      edgeColor: '#FF00AA',
      intensityRamp: true,
      focusRing: true,
    },

    particles: {
      enabled: true,
      type: 'focus_sparks',
      color: '#FF66CC',
      count: 4,
      spread: 15,
      lifetime: 0.2,
    },

    glow: {
      enabled: true,
      radius: 15,
      intensity: 0.4,
      color: '#FF00AA',
      intensityRamp: true,
    },

    upgrades: {
      2: { damage: 10, damageRamp: { maxMultiplier: 3.5, rampTime: 1.8 } },
      3: { damage: 13, width: 10, range: 380 },
      4: { damage: 17, damageRamp: { maxMultiplier: 4.0, rampTime: 1.6 } },
      5: { damage: 22, width: 12, damageRamp: { maxMultiplier: 5.0 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
