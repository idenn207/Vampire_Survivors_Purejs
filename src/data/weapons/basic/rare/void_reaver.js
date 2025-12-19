/**
 * @fileoverview Void Reaver - Rare melee that creates void rifts and stacks damage on kills
 * @module Data/Weapons/Rare/VoidReaver
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.void_reaver = {
    id: 'void_reaver',
    name: 'Void Reaver',
    description: 'Each kill tears open a void rift. Damage stacks permanently with each soul claimed',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 55,
    cooldown: 1.0,
    range: 70,
    arcAngle: 140,
    swingDuration: 0.22,
    hitsPerSwing: 2,

    // Visual
    color: '#330066',
    secondaryColor: '#9933FF',
    icon: 'void_reaver',
    imageId: 'weapon_void_reaver',

    // Kill stacking mechanic
    killStacking: {
      enabled: true,
      damagePerKill: 0.5, // +0.5 damage per kill
      maxStacks: 100, // Cap at +50 bonus damage
      showCounter: true,
      visualIntensityScale: true, // Visual effects intensify with stacks
    },

    // Void rift on kill
    voidRift: {
      enabled: true,
      createOnKill: true,
      chanceToCreate: 0.6, // 60% chance per kill
      riftDuration: 3.0,
      riftRadius: 50,
      riftDamage: 15, // DoT per tick
      riftTickRate: 0.5,
      pullForce: 40, // Slight pull toward rift
      maxRifts: 4, // Maximum active rifts
    },

    // Visual effects
    swingEffect: {
      type: 'void_tear',
      trailColor: '#660099',
      trailAlpha: 0.7,
      tearEffect: true, // Reality-tearing visual
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 20,
      intensity: 0.6,
      color: '#9933FF',
      pulse: true,
      pulseSpeed: 2.5,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'void_wisps',
      colors: ['#330066', '#660099', '#9933FF'],
      count: 10,
      spread: 40,
      lifetime: 0.7,
    },

    // Screen effects
    screenEffects: {
      onRiftCreate: {
        distortion: { intensity: 0.3, duration: 0.2, radius: 80 },
      },
    },

    upgrades: {
      2: { damage: 70, riftDamage: 20, chanceToCreate: 0.7, arcAngle: 160 },
      3: { damage: 88, damagePerKill: 0.7, maxRifts: 5, cooldown: 0.9 },
      4: { damage: 110, riftRadius: 65, riftDuration: 4.0, hitsPerSwing: 3 },
      5: { damage: 140, damagePerKill: 1.0, maxRifts: 6, chanceToCreate: 0.85 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
