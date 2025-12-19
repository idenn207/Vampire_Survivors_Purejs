/**
 * @fileoverview Dimensional Rift - Rare area with linked portals that teleport enemies
 * @module Data/Weapons/Rare/DimensionalRift
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.dimensional_rift = {
    id: 'dimensional_rift',
    name: 'Dimensional Rift',
    description: 'Creates two linked portals. Enemies entering one are violently expelled from the other',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 1,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 30, // Damage on teleport
    cooldown: 8.0, // Time between new rift pairs
    radius: 60, // Portal radius
    duration: 6.0, // How long rifts last
    range: 350, // Max distance from player for placement

    // Visual
    color: '#9933FF',
    secondaryColor: '#FF33FF',
    icon: 'portal',
    imageId: 'weapon_dimensional_rift',

    // Portal system
    portalSystem: {
      enabled: true,
      portalCount: 2, // Always comes in pairs
      linkType: 'bidirectional', // Can teleport both ways
      // Teleport mechanics
      teleport: {
        damage: 30, // Damage on teleport
        disorientation: 1.5, // Seconds enemy is confused after teleport
        velocityBoost: 2.0, // Ejection speed multiplier
        invulnFrames: 0.2, // Brief invuln to prevent instant re-teleport
      },
      // Pull effect near portals
      pullAura: {
        enabled: true,
        radius: 100,
        force: 60,
      },
      // Portal appearance
      portalVisual: {
        type: 'swirling_vortex',
        innerColor: '#000000',
        outerColor: '#9933FF',
        rotationSpeed: 3,
        particleSpiral: true,
      },
    },

    // Dimensional instability - bonus damage in area between portals
    dimensionalInstability: {
      enabled: true,
      lineDamage: 8, // DoT in line between portals
      lineWidth: 40,
      tickRate: 0.5,
      visualEffect: 'crackling_energy',
    },

    // Visual effects
    glow: {
      enabled: true,
      radius: 80,
      intensity: 0.6,
      color: '#9933FF',
      pulse: true,
      pulseSpeed: 2.5,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'dimensional_sparks',
      colors: ['#9933FF', '#FF33FF', '#6600CC'],
      count: 15,
      spread: 60,
      lifetime: 0.6,
      spiralMotion: true,
    },

    // Distortion effect
    distortion: {
      enabled: true,
      type: 'space_warp',
      radius: 70,
      intensity: 0.5,
    },

    // Screen effects on teleport
    screenEffects: {
      onTeleport: {
        flash: { color: '#9933FF', intensity: 0.2, duration: 0.1 },
      },
    },

    upgrades: {
      2: { damage: 40, duration: 7.0, pullAura: { force: 75 } },
      3: { damage: 50, portalCount: 4, cooldown: 7.0, radius: 70 },
      4: { damage: 65, dimensionalInstability: { lineDamage: 12 }, disorientation: 2.0 },
      5: { damage: 85, duration: 8.0, portalCount: 6, cooldown: 6.0 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
