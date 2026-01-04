/**
 * @fileoverview Orbital Bombardment - Rare particle with meteors that can be launched for impacts
 * @module Data/Weapons/Rare/OrbitalBombardment
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.orbital_bombardment = {
    id: 'orbital_bombardment',
    name: 'Orbital Bombardment',
    description: 'Meteors orbit you in the sky. Command them to strike down with devastating impact',
    attackType: AttackType.PARTICLE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 20, // Orbit contact damage
    cooldown: 0.0, // Continuous orbit
    particleCount: 4, // Orbiting meteors
    orbitRadius: 300, // High orbit (visual)
    orbitSpeed: 0.8,

    // Visual
    color: '#FF6600',
    secondaryColor: '#663300',
    visualScale: 1.2,
    icon: 'meteor_storm',
    imageId: 'weapon_orbital_bombardment',
    bladeImageId: 'orbital_bombardment_blade',

    // Meteor system
    meteorSystem: {
      enabled: true,
      // Passive orbit (high above player)
      orbit: {
        height: 200, // Visual height above player
        shadowOnGround: true,
        contactDamage: 20,
      },
      // Strike mechanic - meteors fall on enemies
      strike: {
        enabled: true,
        autoTarget: true,
        strikeInterval: 2.5, // Seconds between auto-strikes
        impactDamage: 80,
        impactRadius: 70,
        fallSpeed: 800,
        warningTime: 0.8, // Warning indicator before impact
        // Crater effect after impact
        crater: {
          enabled: true,
          duration: 3.0,
          radius: 50,
          damage: 10, // DoT in crater
          tickRate: 0.5,
          slowEffect: 0.6,
        },
      },
      // Meteor regeneration
      regeneration: {
        enabled: true,
        regenTime: 4.0, // Time to spawn new meteor after strike
        maxMeteors: 6,
      },
    },

    // Visual effects
    meteorVisual: {
      type: 'flaming_rock',
      size: 18,
      trailEnabled: true,
      trailLength: 40,
      trailColors: ['#FF6600', '#FF3300', '#330000'],
      rotationSpeed: 2,
      glowRadius: 25,
    },

    // Warning indicator
    warningIndicator: {
      enabled: true,
      type: 'target_circle',
      color: '#FF3300',
      pulseSpeed: 4,
      showShadow: true,
    },

    // Impact effects
    impactEffect: {
      type: 'explosion',
      radius: 70,
      debrisCount: 15,
      debrisSpread: 100,
      screenShake: { intensity: 8, duration: 0.3 },
      craterVisual: { color: '#663300', glow: '#FF3300' },
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 30,
      intensity: 0.6,
      color: '#FF6600',
      pulse: true,
      pulseSpeed: 1.5,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'embers_and_smoke',
      colors: ['#FF6600', '#FF9900', '#333333'],
      count: 10,
      spread: 40,
      lifetime: 0.8,
    },

    upgrades: {
      2: { damage: 26, impactDamage: 100, particleCount: 5, strikeInterval: 2.2 },
      3: { damage: 33, crater: { duration: 4.0, damage: 14 }, impactRadius: 85 },
      4: { damage: 42, impactDamage: 130, maxMeteors: 7, regenTime: 3.5 },
      5: { damage: 55, particleCount: 6, impactDamage: 170, strikeInterval: 1.8 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
