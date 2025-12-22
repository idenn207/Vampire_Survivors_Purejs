/**
 * @fileoverview Sunbeam - Rare laser that grows in damage/width while channeled, ends with solar flare
 * @module Data/Weapons/Rare/Sunbeam
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.sunbeam = {
    id: 'sunbeam',
    name: 'Sunbeam',
    description: 'A beam of concentrated sunlight that intensifies over time, ending in a blinding solar flare',
    attackType: AttackType.LASER,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 15, // Starting DPS
    cooldown: 8.0, // Time between beams
    range: 400,
    width: 12, // Starting width
    duration: 3.0, // Channel time

    // Visual
    color: '#FFFF00',
    secondaryColor: '#FFFFFF',
    icon: 'sunbeam',
    imageId: 'weapon_sunbeam',
    laserImageId: 'sunbeam_laser',

    // Status effect
    statusEffect: {
      type: 'burn',
      damage: 5,
      duration: 2.0,
      tickRate: 0.5,
    },

    // Channel growth mechanic
    channelGrowth: {
      enabled: true,
      // Damage growth over channel time
      damageGrowth: {
        startMultiplier: 1.0,
        endMultiplier: 3.0, // 3x damage at end of channel
        curve: 'exponential', // Accelerates toward end
      },
      // Width growth
      widthGrowth: {
        startWidth: 12,
        endWidth: 35,
        curve: 'linear',
      },
      // Heat buildup on enemies
      heatStack: {
        enabled: true,
        stacksPerSecond: 2,
        maxStacks: 10,
        damagePerStack: 0.05, // +5% damage per stack
      },
      // Visual escalation
      visualEscalation: [
        { time: 0, color: '#FFFF66', intensity: 0.4, particles: 3 },
        { time: 1, color: '#FFFF00', intensity: 0.6, particles: 6 },
        { time: 2, color: '#FFAA00', intensity: 0.8, particles: 10 },
        { time: 2.5, color: '#FF6600', intensity: 1.0, particles: 15 },
      ],
    },

    // Solar flare on channel end
    solarFlare: {
      enabled: true,
      damage: 80,
      radius: 100, // Centered on beam end position
      knockback: 150,
      burnDamage: 10,
      burnDuration: 3.0,
      // Blind effect
      blind: {
        enabled: true,
        duration: 1.5,
        radius: 120,
      },
      // Flare visual
      visual: {
        type: 'sun_explosion',
        rayCount: 16,
        rayLength: 150,
        coronaEffect: true,
      },
    },

    // Visual effects
    laserVisual: {
      type: 'radiant_beam',
      coreColor: '#FFFFFF',
      edgeColor: '#FFFF00',
      wavyEdge: true,
      heatDistortion: true,
      lightRays: true,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 40,
      intensity: 0.7,
      color: '#FFFF66',
      growWithChannel: true,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'solar_particles',
      colors: ['#FFFF00', '#FFAA00', '#FFFFFF'],
      count: 8,
      spread: 30,
      lifetime: 0.5,
      emitAlongBeam: true,
    },

    // Screen effects
    screenEffects: {
      duringChannel: {
        warming: { intensity: 0.1, growOverTime: true },
      },
      onFlare: {
        flash: { color: '#FFFFFF', intensity: 0.7, duration: 0.2 },
        shake: { intensity: 5, duration: 0.3 },
      },
    },

    upgrades: {
      2: { damage: 20, duration: 3.5, solarFlare: { damage: 100, radius: 120 } },
      3: { damage: 26, endMultiplier: 3.5, endWidth: 42, cooldown: 7.0 },
      4: { damage: 34, solarFlare: { damage: 130, blind: { duration: 2.0 } } },
      5: { damage: 45, duration: 4.0, endMultiplier: 4.0, solarFlare: { damage: 170 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
