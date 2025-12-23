/**
 * @fileoverview Singularity Orb - Rare projectile that creates a black hole effect
 * @module Data/Weapons/Rare/SingularityOrb
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.singularity_orb = {
    id: 'singularity_orb',
    name: 'Singularity Orb',
    description: 'Creates a miniature black hole that pulls enemies in before violently imploding',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 35,
    cooldown: 2.5,
    projectileCount: 1,
    projectileSpeed: 200,
    range: 400,
    pierce: 0, // Stops and creates singularity on hit
    spread: 0,

    // Visual
    color: '#220033',
    secondaryColor: '#660099',
    visualScale: 1.2,
    size: 14,
    shape: 'singularity',
    lifetime: 4.0,
    icon: 'black_hole',
    imageId: 'weapon_singularity_orb',
    projectileImageId: 'singularity_orb_projectile',

    // Singularity behavior
    singularity: {
      enabled: true,
      createOnHit: true,
      pullRadius: 120,
      pullForce: 80,
      duration: 2.0,
      tickDamage: 8, // Damage per tick while pulling
      tickRate: 0.25,
      implodeDamage: 60, // Explosion damage at end
      implodeRadius: 100,
    },

    // Visual effects
    distortion: {
      enabled: true,
      type: 'gravitational_lens',
      radius: 80,
      intensity: 0.8,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 25,
      intensity: 0.7,
      color: '#660099',
      pulse: true,
      pulseSpeed: 4,
    },

    // Particle effects - matter being pulled in
    particles: {
      enabled: true,
      type: 'spiral_inward',
      colors: ['#9933FF', '#6600CC', '#330066'],
      count: 15,
      spread: 100,
      lifetime: 0.8,
    },

    // Screen shake on implode
    screenEffects: {
      onImplode: {
        shake: { intensity: 8, duration: 0.3 },
        flash: { color: '#9933FF', intensity: 0.3, duration: 0.15 },
      },
    },

    upgrades: {
      2: { damage: 45, pullRadius: 140, implodeDamage: 75 },
      3: { damage: 58, duration: 2.5, tickDamage: 12, cooldown: 2.2 },
      4: { damage: 72, pullRadius: 160, implodeRadius: 120, pullForce: 100 },
      5: { damage: 90, projectileCount: 2, implodeDamage: 100, duration: 3.0 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
